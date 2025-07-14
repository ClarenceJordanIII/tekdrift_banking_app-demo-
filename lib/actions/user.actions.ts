"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { ID, Query } from "node-appwrite";
import {
  CountryCode,
  ProcessorTokenCreateRequest,
  ProcessorTokenCreateRequestProcessorEnum,
  Products,
} from "plaid";
import { createAdminClient, createSessionClient } from "../appwrite";
import { plaidClient } from "../plaid";
import { encryptId, extractCustomerIdFromUrl, parseStringify } from "../utils";
import { addFundingSource, createDwollaCustomer } from "./dwolla.actions";

const {
  APPWRITE_DATABASE_ID: DATABASE_ID,
  APPWRITE_USER_COLLECTION_ID: USER_COLLECTION_ID,
  APPWRITE_BANK_COLLECTION_ID: BANK_COLLECTION_ID,
} = process.env;

export const getUserInfo = async ({ userId }: getUserInfoProps) => {
  try {
    if (!userId) {
      console.log("getUserInfo: userId is required");
      return null;
    }
    
    const { database } = await createAdminClient();
    // Query by document $id instead of userId field
    const user = await database.getDocument(
      DATABASE_ID!,
      USER_COLLECTION_ID!,
      userId
    );
    
    return parseStringify(user);
  } catch (error) {
    console.log("getUserInfo error:", error);
    return null;
  }
};

export const signIn = async ({ email, password }: signInProps) => {
  try {
    const { account } = await createAdminClient();
    const session = await account.createEmailPasswordSession(email, password);

    cookies().set("appwrite-session", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });
    const user = await getUserInfo({ userId: session.userId });
    return parseStringify(user);
  } catch (error: any) {
    console.error("Sign in error:", error);
    
    // Handle specific Appwrite error types
    if (error.type === 'user_invalid_credentials') {
      throw new Error("Invalid email or password. Please check your credentials and try again.");
    } else if (error.type === 'user_blocked') {
      throw new Error("Your account has been blocked. Please contact support.");
    } else if (error.type === 'user_not_found') {
      throw new Error("No account found with this email. Please sign up first.");
    } else if (error.type === 'general_rate_limit_exceeded') {
      throw new Error("Too many login attempts. Please wait a few minutes and try again.");
    } else {
      throw new Error("Failed to sign in. Please try again.");
    }
  }
};
export const signUp = async ({ password, ...userData }: SignUpParams) => {
  const { email, firstName, lastName } = userData;
  let newUserAccount;
  try {
    // mutation/Data/make fetch
    const { account, database } = await createAdminClient();

    newUserAccount = await account.create(
      ID.unique(),
      email,
      password,
      `${firstName} ${lastName}`
    );

    if (!newUserAccount) throw new Error("Error creating new user");

    const dwollaCustomerUrl = await createDwollaCustomer({
      ...userData,
      type: "personal",
    });

    if (!dwollaCustomerUrl) throw new Error("Error creating dwolla customer");

    const dwollaCustomerId = extractCustomerIdFromUrl(dwollaCustomerUrl);
    const newUser = await database.createDocument(
      DATABASE_ID!,
      USER_COLLECTION_ID!,
      newUserAccount.$id, // Use the Appwrite account ID as the document ID
      {
        email: userData.email,
        name: `${userData.firstName} ${userData.lastName}`,
        dwollaCustomerId,
        dwollaCustomerUrl,
        firstName: userData.firstName,
        lastName: userData.lastName,
        address1: userData.address1,
        city: userData.city,
        state: userData.state,
        postalCode: userData.postalCode,
        dateOfBirth: userData.dateOfBirth,
        ssn: userData.ssn,
      }
    );

    const session = await account.createEmailPasswordSession(email, password);

    cookies().set("appwrite-session", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });
    return parseStringify(newUser);
  } catch (error: any) {
    console.error("Sign up error:", error);
    
    // Handle specific Appwrite error types
    if (error.type === 'user_already_exists') {
      throw new Error("An account with this email already exists. Please sign in instead.");
    } else if (error.type === 'user_email_already_exists') {
      throw new Error("This email is already registered. Please use a different email or sign in.");
    } else if (error.type === 'user_phone_already_exists') {
      throw new Error("This phone number is already registered. Please use a different phone number.");
    } else if (error.type === 'user_password_mismatch') {
      throw new Error("Password confirmation does not match. Please try again.");
    } else if (error.type === 'general_argument_invalid') {
      throw new Error("Please check your information and ensure all fields are filled correctly.");
    } else if (error.type === 'user_password_recently_used') {
      throw new Error("This password was recently used. Please choose a different password.");
    } else if (error.message && error.message.includes("already exists")) {
      throw new Error("An account with this information already exists. Please sign in or use different details.");
    } else if (error.message && error.message.includes("dwolla")) {
      throw new Error("Failed to set up payment processing. Please try again or contact support.");
    } else {
      throw new Error("Failed to create account. Please check your information and try again.");
    }
  }
};

// ... your initilization functions

export async function getLoggedInUser() {
  try {
    const { account } = await createSessionClient();
    const result = await account.get();
   
    const user = await getUserInfo({ userId: result.$id });
    return parseStringify(user);
  } catch (error) {
    return null;
  }
}

export const logoutAccount = async () => {
  try {
    const { account } = await createSessionClient();
    cookies().delete("appwrite-session");
    await account.deleteSession("current");
  } catch (error) {
    return null;
  }
};

export const createLinkToken = async (user: User) => {
  try {
    const tokenParams = {
      user: {
        client_user_id: user.$id,
      },
      client_name: `${user.firstName} ${user.lastName}`,
      products: ["auth", "transactions"] as Products[],
      language: "en",
      country_codes: ["US"] as CountryCode[],
    };

    const response = await plaidClient.linkTokenCreate(tokenParams);
    return parseStringify({ linkToken: response.data.link_token });
  } catch (error: any) {
    console.error("Create link token error:", error);
    
    // Handle Plaid-specific errors
    if (error.error_code === 'INVALID_CREDENTIALS') {
      throw new Error("Invalid Plaid configuration. Please contact support.");
    } else if (error.error_code === 'RATE_LIMIT_EXCEEDED') {
      throw new Error("Too many requests. Please wait a moment and try again.");
    } else {
      throw new Error("Failed to initialize bank connection. Please try again.");
    }
  }
};

export const createBankAccount = async ({
  userId,
  bankId,
  accountId,
  accessToken,
  fundingSourceUrl,
  shareableId,
}: createBankAccountProps) => {
  try {
    const { database } = await createAdminClient();
    
    // Debug logging
    console.log("Creating bank account with data:", {
      userId,
      bankId,
      accountId,
      accessToken: accessToken ? "***" : undefined,
      fundingSourceUrl,
      shareableId,
    });
    
    // Create bank account document with shareableId (now required in database)
    const bankAccount = await database.createDocument(
      DATABASE_ID!,
      BANK_COLLECTION_ID!,
      ID.unique(),
      {
        userId,
        bankId,
        accountId,
        accessToken,
        fundingSourceUrl,
        shareableId, // Now required in database schema
      }
    );
    return parseStringify(bankAccount);
  } catch (error: any) {
    console.error("Create bank account error:", error);
    
    // Handle Appwrite database errors
    if (error.type === 'document_already_exists') {
      throw new Error("This bank account is already connected to your profile.");
    } else if (error.type === 'document_invalid_structure') {
      throw new Error("Invalid account information. Please try connecting your bank again.");
    } else if (error.type === 'general_rate_limit_exceeded') {
      throw new Error("Too many requests. Please wait a moment and try again.");
    } else {
      throw new Error("Failed to save bank account information. Please try again.");
    }
  }
};

export const exchangePublicToken = async ({
  publicToken,
  user,
}: exchangePublicTokenProps) => {
  try {
    const response = await plaidClient.itemPublicTokenExchange({
      public_token: publicToken,
    });
 
    const accessToken = response.data.access_token;

    const itemId = response.data.item_id;
    const accountsResponse = await plaidClient.accountsGet({
      access_token: accessToken,
    });
    const accountData = accountsResponse.data.accounts[0];
    // Create a processor token for Dwolla using the access token and account ID
    const request: ProcessorTokenCreateRequest = {
      access_token: accessToken,
      account_id: accountData.account_id,
      processor: "dwolla" as ProcessorTokenCreateRequestProcessorEnum,
    };
    const processorTokenResponse = await plaidClient.processorTokenCreate(
      request
    );
    const processorToken = processorTokenResponse.data.processor_token;
    
    // create a funding source URL for the account using the Dwolla customer Id,
    // processor token, and bank name
    const fundingSourceUrl = await addFundingSource({
      dwollaCustomerId: user.dwollaCustomerId,
      processorToken,
      bankName: accountData.name,
    });

    if (!fundingSourceUrl) {
      throw new Error("Failed to create or retrieve funding source URL from Dwolla");
    }
    
    // Generate shareableId
    const shareableId = encryptId(accountData.account_id);
    console.log("Generated shareableId:", shareableId);
    
    //  Create a bank account using the user Id, item Id, account Id, access token, funding source URL, and sharable Id
    await createBankAccount({
      userId: user.$id,
      bankId: itemId,
      accountId: accountData.account_id,
      accessToken,
      fundingSourceUrl,
      shareableId,
    });

    // revalidate the path to reflect the changes
    revalidatePath("/");
    // return success message
    return parseStringify({
      publicTokenExchange: "complete",
    });
  } catch (error: any) {
    console.error("An error occurred while exchanging token:", error);
    
    // Re-throw the error with more context so it can be handled by the calling code
    if (error.message && typeof error.message === 'string') {
      throw new Error(error.message);
    } else {
      throw new Error("Failed to connect bank account. Please try again.");
    }
  }
};

export const getBanks = async ({ userId }: getBanksProps) => {

  try {
    if (!userId) {
      console.log("getBanks: userId is required");
      return [];
    }
    
    const { database } = await createAdminClient();
    
    const banks = await database.listDocuments(
      DATABASE_ID!,
      BANK_COLLECTION_ID!,
      [Query.equal("userId", [userId])]
    );
   
    return parseStringify(banks.documents);
  } catch (error) {
    
    console.log("getBanks error:", error);
    return [];
  }
};
export const getBank = async ({ documentId }: getBankProps) => {

  try {
    if (!documentId) {
      console.log("getBank: documentId is required");
      return null;
    }
    
    const { database } = await createAdminClient();
    const bank = await database.getDocument(
      DATABASE_ID!,
      BANK_COLLECTION_ID!,
      documentId
    );
    return parseStringify(bank);
  } catch (error) {
  
    console.log("getBank error:", error);
    return null;
  }
};

export const getBankByAccountId = async ({
  accountId,
}: getBankByAccountIdProps) => {
  try {
    if (!accountId) {
      console.log("getBankByAccountId: accountId is required");
      return null;
    }
    
    const { database } = await createAdminClient();
    const bank = await database.listDocuments(
      DATABASE_ID!,
      BANK_COLLECTION_ID!,
      [Query.equal("accountId", [accountId])]
    );

    if (bank.total !== 1) return null;

    return parseStringify(bank);
  } catch (error) {
     
    console.log("getBankByAccountId error:", error);
    return null;
  }
};
