"use server";

import {
  ACHClass,
  CountryCode,
  TransferAuthorizationCreateRequest,
  TransferCreateRequest,
  TransferNetwork,
  TransferType,
} from "plaid";

import { plaidClient } from "../plaid";
import { parseStringify } from "../utils";

import { getTransactionsByBankId } from "./transaction.actions";
import { getBank, getBanks } from "./user.actions";

// Get multiple bank accounts
export const getAccounts = async ({ userId }: getAccountsProps) => {

  try {
    if (!userId) {
      console.log("getAccounts: userId is required");
      return { data: [], totalBanks: 0, totalCurrentBalance: 0 };
    }
    
    // get banks from db
    const banks = await getBanks({userId});
    
    if (!banks || banks.length === 0) {
      return { data: [], totalBanks: 0, totalCurrentBalance: 0 };
    }
 
    const accounts = await Promise.all(
     
      banks?.map(async (bank: Bank) => {
         
        // get each account info from plaid
        const accountsResponse = await plaidClient.accountsGet({
          access_token: bank.accessToken,
        });
     
        const accountData = accountsResponse.data.accounts[0];
        
        // get institution info from plaid
        const institution = await getInstitution({
          institutionId: accountsResponse.data.item.institution_id!,
        });

        const account = { id: accountData.account_id, availableBalance: accountData.balances.available!, currentBalance: accountData.balances.current!, institutionId: institution.institution_id, name: accountData.name, officialName: accountData.official_name, mask: accountData.mask!, type: accountData.type as string, subtype: accountData.subtype! as string, appwriteItemId: bank.$id };

        return account;
      })
    );
    
    const totalBanks = accounts.length;
    const totalCurrentBalance = accounts.reduce((total, account) => {
      return total + account.currentBalance;
    }, 0);

    return parseStringify({ data: accounts, totalBanks, totalCurrentBalance });
  } catch (error) {
    console.error("An error occurred while getting the accounts:", error);
    return { 
      data: [], 
      totalBanks: 0, 
      totalCurrentBalance: 0, 
      error: error instanceof Error ? error.message : "Failed to fetch accounts. Please try again." 
    };
  }
};

// Get one bank account
export const getAccount = async ({ appwriteItemId }: getAccountProps) => {
 
  try {
    if (!appwriteItemId) {
      console.log("getAccount: appwriteItemId is required");
      return null;
    }

    // get bank from db
    const bank = await getBank({ documentId: appwriteItemId });

    if (!bank) {
      console.log("getAccount: bank not found");
      return null;
    }
   
    // get account info from plaid
    const accountsResponse = await plaidClient.accountsGet({
      access_token: bank.accessToken,
    });
   
    
    const accountData = accountsResponse.data.accounts[0];

    // get transfer transactions from appwrite
    const transferTransactionsData = await getTransactionsByBankId({
      bankId: bank.bankId,
    });


    const transferTransactions = transferTransactionsData.documents.map(
      (transferData: Transaction) => ({
        id: transferData.$id,
        name: transferData.name!,
        amount: transferData.amount!,
        date: transferData.$createdAt,
        paymentChannel: transferData.channel,
        type: transferData.senderBankId === bank.$id ? "debit" : "credit",
        category: transferData.category
      })
    );

    // get institution info from plaid
    const institution = await getInstitution({
      institutionId: accountsResponse.data.item.institution_id!,
    });

    const transactions = await getTransactions({
      accessToken: bank.accessToken,
    });
   
    // Ensure transactions is always an array
    const safeTransactions = Array.isArray(transactions) ? transactions : [];

    const account = {
      id: accountData.account_id,
      availableBalance: accountData.balances.available!,
      currentBalance: accountData.balances.current!,
      institutionId: institution.institution_id,
      name: accountData.name,
      officialName: accountData.official_name,
      mask: accountData.mask!,
      type: accountData.type as string,
      subtype: accountData.subtype! as string,
      appwriteItemId: bank.$id,
    };

    // sort transactions by date such that the most recent transaction is first
    const allTransactions = [...safeTransactions, ...transferTransactions].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
   
    return parseStringify({
      data: account,
      transactions: allTransactions,
    });
  } catch (error) {
    console.error("An error occurred while getting the account:", error);
    return {
      data: null,
      transactions: [],
      error: error instanceof Error ? error.message : "Failed to fetch account details. Please try again."
    };
  }
};

// Get bank info
export const getInstitution = async ({
  institutionId,
}: getInstitutionProps) => {
  try {
    const institutionResponse = await plaidClient.institutionsGetById({
      institution_id: institutionId,
      country_codes: ["US"] as CountryCode[],
    });

    const institution = institutionResponse.data.institution;

    return parseStringify(institution);
  } catch (error) {
    console.error("An error occurred while getting the institution:", error);
    // Return a default institution object to prevent errors
    return {
      institution_id: institutionId,
      name: "Unknown Institution",
      products: [],
      country_codes: ["US"]
    };
  }
};

// Get transactions
export const getTransactions = async ({
  accessToken,
}: getTransactionsProps) => {
  let hasMore = true;
  let transactions: any = [];

  try {
       
    // Iterate through each page of new transaction updates for item
    while (hasMore) {
       
      const response = await plaidClient.transactionsSync({
        access_token: accessToken,
      });

    
     

      const data = response.data;
  
      transactions = response.data.added.map((transaction) => ({
        id: transaction.transaction_id,
        name: transaction.name,
        paymentChannel: transaction.payment_channel,
        type: transaction.payment_channel,
        accountId: transaction.account_id,
        amount: transaction.amount,
        pending: transaction.pending,
        category: transaction.category ? transaction.category[0] : "",
        date: transaction.date,
        image: transaction.logo_url,
      }));

      hasMore = data.has_more;
    }

    return parseStringify(transactions);
  } catch (error) {
    console.error("An error occurred while getting the transactions:", error);
    // Return empty array instead of undefined to prevent iteration errors
    return parseStringify([]);
  }
};

// Create Transfer
export const createTransfer = async () => {
  const transferAuthRequest: TransferAuthorizationCreateRequest = {
    access_token: "access-sandbox-cddd20c1-5ba8-4193-89f9-3a0b91034c25",
    account_id: "Zl8GWV1jqdTgjoKnxQn1HBxxVBanm5FxZpnQk",
    funding_account_id: "442d857f-fe69-4de2-a550-0c19dc4af467",
    type: "credit" as TransferType,
    network: "ach" as TransferNetwork,
    amount: "10.00",
    ach_class: "ppd" as ACHClass,
    user: {
      legal_name: "Anne Charleston",
    },
  };
  try {
    const transferAuthResponse =
      await plaidClient.transferAuthorizationCreate(transferAuthRequest);
    const authorizationId = transferAuthResponse.data.authorization.id;

    const transferCreateRequest: TransferCreateRequest = {
      access_token: "access-sandbox-cddd20c1-5ba8-4193-89f9-3a0b91034c25",
      account_id: "Zl8GWV1jqdTgjoKnxQn1HBxxVBanm5FxZpnQk",
      description: "payment",
      authorization_id: authorizationId,
    };

    const responseCreateResponse = await plaidClient.transferCreate(
      transferCreateRequest
    );

    const transfer = responseCreateResponse.data.transfer;
   
    return parseStringify(transfer);
  } catch (error) {
    console.error(
      "An error occurred while creating transfer authorization:",
      error
    );
  }
};