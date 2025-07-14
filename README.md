# 💜 TekDrift Banking App

A modern, secure, and user-friendly banking application built by **TekDrift** using cutting-edge technologies. This full-stack application provides comprehensive banking features including account management, transaction tracking, and seamless bank connections.

![TekDrift Banking App](https://img.shields.io/badge/TekDrift-Banking%20App-892ADE?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJMMTMuMDkgOC4yNkwyMCA5TDEzLjA5IDE1Ljc0TDEyIDIyTDEwLjkxIDE1Ljc0TDQgOUwxMC45MSA4LjI2TDEyIDJaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4K)

## ✨ Features

### 🏦 **Core Banking Features**
- **Multi-Bank Integration** - Connect and manage multiple bank accounts
- **Real-Time Transactions** - View and track all financial transactions
- **Account Balances** - Live balance tracking across all connected accounts
- **Transaction History** - Comprehensive transaction filtering and search
- **Payment Transfers** - Secure money transfers between accounts

### 🔐 **Security & Authentication**
- **Secure Sign-up/Sign-in** - Robust user authentication system
- **Bank-Level Security** - Industry-standard encryption and security protocols
- **User Data Protection** - Comprehensive data privacy and protection

### 🎨 **TekDrift Design System**
- **Custom Purple Theme** - Signature TekDrift purple (#892ADE) branding
- **Responsive Design** - Optimized for desktop, tablet, and mobile devices
- **Modern UI/UX** - Clean, intuitive, and professional interface
- **Dark/Light Theme Support** - Elegant color schemes for any preference

### 🔌 **Integrations**
- **Plaid API** - Secure bank connection and transaction data
- **Dwolla** - Payment processing and money transfers
- **Appwrite** - Backend database and user management

## 🚀 Technologies Used

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Shadcn/UI** - Modern component library

### Backend & Services
- **Appwrite** - Backend-as-a-Service platform
- **Plaid API** - Banking data aggregation
- **Dwolla** - Payment processing platform

### Development Tools
- **ESLint** - Code linting and quality
- **PostCSS** - CSS processing
- **React Hook Form** - Form management
- **Zod** - Runtime type validation

## 🛠️ Getting Started

### Prerequisites
- Node.js 18+ 
- npm, yarn, pnpm, or bun
- Plaid API credentials
- Dwolla API credentials
- Appwrite project setup

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/CjordanIII/banking-app.git
cd banking-app
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. **Environment Setup**
Create a `.env.local` file in the root directory:
```env
# Appwrite Configuration
NEXT_PUBLIC_APPWRITE_ENDPOINT=your_appwrite_endpoint
NEXT_PUBLIC_APPWRITE_PROJECT=your_project_id
APPWRITE_DATABASE_ID=your_database_id
APPWRITE_USER_COLLECTION_ID=your_user_collection_id
APPWRITE_BANK_COLLECTION_ID=your_bank_collection_id
APPWRITE_TRANSACTION_COLLECTION_ID=your_transaction_collection_id
NEXT_APPWRITE_KEY=your_appwrite_api_key

# Plaid Configuration
PLAID_CLIENT_ID=your_plaid_client_id
PLAID_SECRET=your_plaid_secret
PLAID_ENV=sandbox
PLAID_PRODUCTS=auth,transactions
PLAID_COUNTRY_CODES=US

# Dwolla Configuration
DWOLLA_KEY=your_dwolla_key
DWOLLA_SECRET=your_dwolla_secret
DWOLLA_BASE_URL=https://api-sandbox.dwolla.com
DWOLLA_ENV=sandbox
```

4. **Run the development server**
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

5. **Open your browser**
Navigate to [http://localhost:3000](http://localhost:3000) to see the TekDrift Banking App in action.

## 📱 Screenshots

*Coming soon - Screenshots of the TekDrift Banking App interface*

## 🏗️ Project Structure

```
banking-app/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Authentication pages
│   ├── (root)/            # Protected dashboard pages
│   └── globals.css        # Global styles with TekDrift theme
├── components/            # Reusable UI components
├── lib/                   # Utility functions and API integrations
│   ├── actions/          # Server actions for data fetching
│   ├── appwrite.ts       # Appwrite configuration
│   ├── plaid.ts          # Plaid API integration
│   └── utils.ts          # Utility functions
├── public/               # Static assets and TekDrift branding
├── types/                # TypeScript type definitions
└── constants/            # Application constants
```

## 🎯 Key Features in Detail

### Dashboard
- **Account Overview** - Visual representation of all connected accounts
- **Balance Summary** - Total balance across all accounts with visual charts
- **Recent Transactions** - Latest transaction activity
- **Quick Actions** - Easy access to common banking tasks

### Bank Connections
- **Plaid Integration** - Secure connection to 11,000+ financial institutions
- **Real-time Sync** - Automatic transaction and balance updates
- **Multiple Accounts** - Support for checking, savings, and credit accounts

### Transaction Management
- **Comprehensive History** - All transactions with detailed information
- **Advanced Filtering** - Filter by date, amount, category, and account
- **Transaction Search** - Quickly find specific transactions
- **Export Options** - Download transaction data for personal records

### Payment Transfers
- **Secure Transfers** - Bank-to-bank money transfers
- **Transfer History** - Track all sent and received payments
- **Recipient Management** - Save frequent transfer recipients

## 🔧 API Integrations

### Plaid API
- **Sandbox Environment** - Safe testing with demo bank credentials
- **Institution Support** - 11,000+ supported financial institutions
- **Data Security** - Bank-level encryption and security standards

### Dwolla Payment Processing
- **ACH Transfers** - Secure bank-to-bank transfers
- **Sandbox Testing** - Test payment flows safely
- **Compliance** - Meets financial industry regulations

### Appwrite Backend
- **User Management** - Secure user authentication and profiles
- **Database** - Document-based database for banking data
- **Real-time Updates** - Live data synchronization

## 🚀 Deployment

### Vercel (Recommended)
The easiest way to deploy the TekDrift Banking App:

1. **Connect to Vercel**
```bash
vercel --prod
```

2. **Set Environment Variables**
Add all environment variables in the Vercel dashboard

3. **Deploy**
Your app will be live with automatic deployments on every push to main branch

### Other Platforms
- **Netlify** - Full support for Next.js applications
- **Railway** - Simple deployment with database support
- **Digital Ocean** - Full control with VPS deployment

## 📄 License

This project is built by **TekDrift** and is available under the MIT License. See the `LICENSE` file for more details.

## 🤝 Contributing

While this is a TekDrift project, contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Contact

**TekDrift** - Building the future of financial technology

- **GitHub**: [@CjordanIII](https://github.com/CjordanIII)
- **Project Repository**: [banking-app](https://github.com/CjordanIII/banking-app)

## 🙏 Acknowledgments

- **Plaid** - For secure banking data access
- **Dwolla** - For payment processing capabilities
- **Appwrite** - For backend infrastructure
- **Vercel** - For seamless deployment platform
- **Next.js Team** - For the amazing React framework

---

**Built with 💜 by TekDrift** - *Revolutionizing digital banking experiences*
# tekdrift_banking_app-demo-
