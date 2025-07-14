"use server";

import { Client } from "dwolla-v2";

const getEnvironment = (): "production" | "sandbox" => {
  const environment = process.env.DWOLLA_ENV as string;

  switch (environment) {
    case "sandbox":
      return "sandbox";
    case "production":
      return "production";
    default:
      throw new Error(
        "Dwolla environment should either be set to `sandbox` or `production`"
      );
  }
};

const dwollaClient = new Client({
  environment: getEnvironment(),
  key: process.env.DWOLLA_KEY as string,
  secret: process.env.DWOLLA_SECRET as string,
});

// Create a Dwolla Funding Source using a Plaid Processor Token
export const createFundingSource = async (
  options: CreateFundingSourceOptions
) => {
  try {
    return await dwollaClient
      .post(`customers/${options.customerId}/funding-sources`, {
        name: options.fundingSourceName,
        plaidToken: options.plaidToken,
      })
      .then((res) => res.headers.get("location"));
  } catch (err: any) {
    console.error("Creating a Funding Source Failed: ", err);
    
    // Handle DuplicateResource error (bank account already exists)
    if (err.body?.code === "DuplicateResource") {
      console.log("Funding source already exists, attempting to retrieve existing one...");
      
      try {
        // Get existing funding sources for this customer
        const fundingSources = await dwollaClient.get(`customers/${options.customerId}/funding-sources`);
        
        // Find the funding source with matching name
        const existingSource = fundingSources.body._embedded?.["funding-sources"]?.find(
          (source: any) => source.name === options.fundingSourceName && source.status === "verified"
        );
        
        if (existingSource) {
          console.log("Found existing funding source:", existingSource._links.self.href);
          return existingSource._links.self.href;
        } else {
          // If we can't find the existing source, try to get all sources and pick the first verified one
          const verifiedSource = fundingSources.body._embedded?.["funding-sources"]?.find(
            (source: any) => source.status === "verified" && source.type === "bank"
          );
          
          if (verifiedSource) {
            console.log("Using existing verified funding source:", verifiedSource._links.self.href);
            return verifiedSource._links.self.href;
          }
        }
      } catch (retrieveErr) {
        console.error("Failed to retrieve existing funding sources:", retrieveErr);
      }
    }
    
    // Handle InvalidResourceState error (customer status issue)
    if (err.body?.code === "InvalidResourceState") {
      console.log("InvalidResourceState error - customer may need verification");
      
      try {
        // Get existing funding sources for this customer to see if any are available
        const fundingSources = await dwollaClient.get(`customers/${options.customerId}/funding-sources`);
        
        // Find any verified funding source
        const verifiedSource = fundingSources.body._embedded?.["funding-sources"]?.find(
          (source: any) => source.status === "verified" && source.type === "bank"
        );
        
        if (verifiedSource) {
          console.log("Using existing verified funding source due to InvalidResourceState:", verifiedSource._links.self.href);
          return verifiedSource._links.self.href;
        }
      } catch (retrieveErr) {
        console.error("Failed to retrieve existing funding sources:", retrieveErr);
      }
    }
    
    // Re-throw the error if we can't handle it
    throw err;
  }
};

export const createOnDemandAuthorization = async () => {
  try {
    const onDemandAuthorization = await dwollaClient.post(
      "on-demand-authorizations"
    );
    const authLink = onDemandAuthorization.body._links;
    return authLink;
  } catch (err) {
    console.error("Creating an On Demand Authorization Failed: ", err);
  }
};

export const createDwollaCustomer = async (
  newCustomer: NewDwollaCustomerParams
) => {
  
  try {
    return await dwollaClient
      .post("customers", newCustomer)
      .then((res) => res.headers.get("location"));
  } catch (err) {
    
    console.error("Creating a Dwolla Customer Failed: ", err);
  }
};

export const createTransfer = async ({
  sourceFundingSourceUrl,
  destinationFundingSourceUrl,
  amount,
}: TransferParams) => {
  
  try {
    const requestBody = {
      _links: {
        source: {
          href: sourceFundingSourceUrl,
        },
        destination: {
          href: destinationFundingSourceUrl,
        },
      },
      amount: {
        currency: "USD",
        value: amount,
      },
    };
    return await dwollaClient
      .post("transfers", requestBody)
      .then((res) => res.headers.get("location"));
  } catch (err) {
 
    console.error("Transfer fund failed: ", err);
  }
};

export const addFundingSource = async ({
  dwollaCustomerId,
  processorToken,
  bankName,
}: AddFundingSourceParams) => {
  try {
    // create dwolla auth link
    const dwollaAuthLinks = await createOnDemandAuthorization();

    // add funding source to the dwolla customer & get the funding source url
    const fundingSourceOptions = {
      customerId: dwollaCustomerId,
      fundingSourceName: bankName,
      plaidToken: processorToken,
      _links: dwollaAuthLinks,
    };
    return await createFundingSource(fundingSourceOptions);
  } catch (err: any) {
    console.error("Add funding source failed: ", err);
    
    // Provide more specific error messages
    if (err.body?.code === "DuplicateResource") {
      throw new Error("This bank account is already connected to your account. Please use the existing connection or remove it first.");
    } else if (err.body?.code === "InvalidResourceState") {
      throw new Error("Your Dwolla account needs additional verification before adding bank accounts. Please contact support.");
    } else if (err.body?.code === "ValidationError") {
      throw new Error("There was an issue validating your bank account. Please check your account information and try again.");
    } else if (err.body?.code === "InvalidCredentials") {
      throw new Error("Invalid bank account credentials. Please verify your account information.");
    } else {
      throw new Error("Failed to connect bank account. Please try again later.");
    }
  }
};