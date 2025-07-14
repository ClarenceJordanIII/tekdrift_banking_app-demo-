# TekDrift Banking App Setup Guide

## Required Services Setup

### 1. Appwrite Setup (Required for user authentication and database)
1. Go to [https://cloud.appwrite.io](https://cloud.appwrite.io)
2. Create a new account or sign in
3. Create a new project
4. Copy your Project ID to `.env.local` as `NEXT_PUBLIC_APPWRITE_PROJECT`
5. Go to "Settings" → "API Keys" and create a new API key with all permissions
6. Copy the key to `.env.local` as `NEXT_APPWRITE_KEY`
7. Create a database:
   - Go to "Databases" → "Create Database"
   - Copy the Database ID to `.env.local` as `APPWRITE_DATABASE_ID`
8. Create Collections:
   - **Users Collection**: Copy ID as `APPWRITE_USER_COLLECTION_ID`
   - **Banks Collection**: Copy ID as `APPWRITE_BANK_COLLECTION_ID`  
   - **Transactions Collection**: Copy ID as `APPWRITE_TRANSACTION_COLLECTION_ID`

### 2. Plaid Setup (Required for bank connections)
1. Go to [https://dashboard.plaid.com](https://dashboard.plaid.com)
2. Create a developer account
3. Create a new app
4. Copy your Client ID to `.env.local` as `PLAID_CLIENT_ID`
5. Copy your Secret (sandbox) to `.env.local` as `PLAID_SECRET`
6. Set `PLAID_ENV=sandbox` for testing

### 3. Dwolla Setup (Optional for payments - app works without it)
1. Go to [https://developers.dwolla.com](https://developers.dwolla.com)
2. Create a sandbox account
3. Copy your Key to `.env.local` as `DWOLLA_KEY`
4. Copy your Secret to `.env.local` as `DWOLLA_SECRET`

## Quick Start (Minimum Setup)

If you just want to test the app quickly:

1. **Only setup Appwrite** (steps above)
2. **Use demo Plaid credentials** (app will work in demo mode)
3. **Skip Dwolla** (payment features will be disabled but signup will work)

## Environment Variables Template

Copy this to your `.env.local` file and fill in your values:

```env
#NEXT
NEXT_PUBLIC_SITE_URL=http://localhost:3000

#APPWRITE (REQUIRED)
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT=your_project_id_here
APPWRITE_DATABASE_ID=your_database_id_here
APPWRITE_USER_COLLECTION_ID=your_user_collection_id_here
APPWRITE_BANK_COLLECTION_ID=your_bank_collection_id_here
APPWRITE_TRANSACTION_COLLECTION_ID=your_transaction_collection_id_here
NEXT_APPWRITE_KEY=your_api_key_here

#PLAID (REQUIRED FOR BANK CONNECTIONS)
PLAID_CLIENT_ID=your_plaid_client_id_here
PLAID_SECRET=your_plaid_secret_here
PLAID_ENV=sandbox
PLAID_PRODUCTS=transactions
PLAID_COUNTRY_CODES=US

#DWOLLA (OPTIONAL - FOR PAYMENTS)
DWOLLA_KEY=your_dwolla_key_here
DWOLLA_SECRET=your_dwolla_secret_here
DWOLLA_BASE_URL=https://api-sandbox.dwolla.com
DWOLLA_ENV=sandbox
```

## Running the App

1. Install dependencies: `npm install`
2. Setup your `.env.local` with at least Appwrite credentials
3. Run the development server: `npm run dev`
4. Open [http://localhost:3000](http://localhost:3000)

## Troubleshooting

- **"User not authenticated"**: Check Appwrite configuration
- **"Bank connection failed"**: Check Plaid configuration
- **"Payment processing failed"**: Dwolla is optional, signup should still work
- **Build errors**: Run `npm run build` to see detailed errors

## Demo Mode

The app is designed to work even with missing credentials:
- Without Plaid: Basic user management works
- Without Dwolla: User signup works, payment features disabled
- With only Appwrite: Core functionality available
