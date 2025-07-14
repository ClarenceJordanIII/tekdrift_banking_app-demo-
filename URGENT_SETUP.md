# 🚨 CRITICAL: Account Creation Setup Guide

Your account creation is failing because you need to set up your backend services. Here's exactly what you need to do:

## 🔥 IMMEDIATE PRIORITY: Appwrite Setup (Required for ANY account creation)

**Without Appwrite, NO accounts can be created at all.**

### Step 1: Create Appwrite Project
1. Go to https://cloud.appwrite.io
2. Sign up for free account
3. Create a new project
4. Copy your Project ID

### Step 2: Create Database & Collections
In your Appwrite console:

1. **Create Database:**
   - Go to Databases → Create Database
   - Name it "banking" (or any name)
   - Copy the Database ID

2. **Create Collections:**
   Create these 3 collections with these exact names:

   **a) Users Collection:**
   - Name: "users"
   - Add these attributes:
     - email (string, required)
     - name (string, required)
     - firstName (string, required)
     - lastName (string, required)
     - address1 (string, required)
     - city (string, required)
     - state (string, required)
     - postalCode (string, required)
     - dateOfBirth (string, required)
     - ssn (string, required)
     - dwollaCustomerId (string, optional)
     - dwollaCustomerUrl (string, optional)

   **b) Banks Collection:**
   - Name: "banks"
   - Add these attributes:
     - accountId (string, required)
     - bankId (string, required)
     - accessToken (string, required)
     - fundingSourceUrl (string, optional)
     - userId (string, required)
     - shareableId (string, required)

   **c) Transactions Collection:**
   - Name: "transactions"
   - Add these attributes:
     - name (string, required)
     - amount (integer, required)
     - channel (string, required)
     - category (string, required)
     - type (string, required)
     - accountId (string, required)
     - userId (string, required)

### Step 3: Create API Key
1. Go to Settings → API Keys
2. Create new API key with full permissions
3. Copy the secret key

### Step 4: Update .env.local
Replace these in your .env.local file:
```
NEXT_PUBLIC_APPWRITE_PROJECT=your_actual_project_id
APPWRITE_DATABASE_ID=your_actual_database_id
APPWRITE_USER_COLLECTION_ID=your_actual_users_collection_id
APPWRITE_BANK_COLLECTION_ID=your_actual_banks_collection_id
APPWRITE_TRANSACTION_COLLECTION_ID=your_actual_transactions_collection_id
NEXT_APPWRITE_KEY=your_actual_api_key
```

## 💳 OPTIONAL: Dwolla Setup (For Payment Features)

**Account creation will work WITHOUT Dwolla, but payment features won't work.**

1. Go to https://dashboard.dwolla.com
2. Sign up for sandbox account
3. Get API Key and Secret
4. Update in .env.local:
   ```
   DWOLLA_KEY=your_actual_dwolla_key
   DWOLLA_SECRET=your_actual_dwolla_secret
   ```

## 🏦 OPTIONAL: Plaid Setup (For Bank Connections)

**Account creation will work WITHOUT Plaid, but bank connections won't work.**

1. Go to https://dashboard.plaid.com
2. Sign up for free sandbox account
3. Get Client ID and Secret
4. Update in .env.local:
   ```
   PLAID_CLIENT_ID=your_actual_client_id
   PLAID_SECRET=your_actual_secret
   ```

## ✅ Test Your Setup

After setting up Appwrite (minimum requirement):

1. Restart your development server: `npm run dev`
2. Try creating an account
3. Check the console for any errors

## 🐛 Troubleshooting

**If account creation still fails:**
1. Check browser console for errors
2. Check terminal console for errors
3. Verify all Appwrite credentials are correct
4. Make sure your .env.local file has no extra spaces or quotes

**Common Issues:**
- Collection IDs are wrong
- API key doesn't have proper permissions
- Database ID is incorrect
- Project ID is wrong

## Current Status

✅ Dwolla: Configured to fail gracefully (signup will work without it)
✅ Signup Process: Will continue even if Dwolla/Plaid fail
❌ Appwrite: MUST be configured for any account creation
❌ Environment Variables: Still have placeholder values

**PRIORITY: Set up Appwrite first, then test account creation!**
