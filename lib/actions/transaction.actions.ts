'use server'
import { ID, Query } from "node-appwrite";
import { createAdminClient } from "../appwrite";
import { parseStringify } from "../utils";

const {
  APPWRITE_DATABASE_ID: DATABASE_ID,
  APPWRITE_TRANSACTION_COLLECTION_ID: TRANSACTION_COLLECTION_ID,
} = process.env;

export const createTransaction = async (
  transaction: CreateTransactionProps
) => {
 
  try {
    const { database } = await createAdminClient();
    const newTransaction = await database.createDocument(
      DATABASE_ID!,
      TRANSACTION_COLLECTION_ID!,
      ID.unique(),
      {
        channel: "online",
        category: "Transfer",
        ...transaction,
      }
    );
     

    return parseStringify(newTransaction);
  } catch (error) {
  
    console.error(error);
  }
};

export const getTransactionsByBankId = async ({
  bankId,
}: getTransactionsByBankIdProps) => {

  try {
    if (!bankId) {
      console.log("getTransactionsByBankId: bankId is required");
      return { total: 0, documents: [] };
    }
    
    const { database } = await createAdminClient();

    const senderTransactions = await database.listDocuments(
      DATABASE_ID!,
      TRANSACTION_COLLECTION_ID!,
      [Query.equal("senderBankId", bankId)]
    );
  
    const reciverTransactions = await database.listDocuments(
      DATABASE_ID!,
      TRANSACTION_COLLECTION_ID!,
      [Query.equal("receiverBankId", bankId)]
    );
     
    const transactions = {
      total: senderTransactions.total + reciverTransactions.total,
      documents: [
        ...senderTransactions.documents,
        ...reciverTransactions.documents,
      ],
    };
    
    return parseStringify(transactions);
  } catch (error) {
  
    console.error("getTransactionsByBankId error:", error);
    return { total: 0, documents: [] };
  }
};
