import ClientDemoWrapper from "@/components/ClientDemoWrapper";
import ErrorDisplay from "@/components/ErrorDisplay";
import HeaderBox from "@/components/HeaderBox";
import PlaidLink from "@/components/PlaidLink";
import RecentTransactions from "@/components/RecentTransactions";
import RightSidebar from "@/components/RightSidebar";
import TotalBalanceBox from "@/components/TotalBalanceBox";
import { getAccount, getAccounts } from "@/lib/actions/bank.actions";
import { getLoggedInUser } from "@/lib/actions/user.actions";

const Home = async ({ searchParams: { id, page } }: SearchParamProps) => {
  const currentPage = Number(page as string) || 1;

  const loggedIn = await getLoggedInUser();

  const accounts = await getAccounts({ userId: loggedIn?.$id });

  if (!accounts) return;
  const accountsData = accounts?.data;
  
  // Check for errors from getAccounts
  const accountsError = (accounts as any)?.error;
  
  if (!accountsData || accountsData.length === 0) {
    return (
      <section className="home">
        <div className="home-content">
          <ErrorDisplay 
            error={accountsError} 
            title="Account Loading Error"
            showPlaidCredentials={true}
          />
          <HeaderBox
            type="greeting"
            title="Welcome"
            user={loggedIn?.firstName || "Guest"}
            subtext="No bank accounts connected. Please connect a bank account to get started."
          />
          <div className="flex items-center justify-center mt-8">
            <PlaidLink user={loggedIn} variant="primary" />
          </div>
        </div>
      </section>
    );
  }

  const appwriteItemId = (id as string) || accountsData[0]?.appwriteItemId;

  if (!appwriteItemId) {
    return (
      <section className="home">
        <div className="home-content">
          <HeaderBox
            type="greeting"
            title="Welcome"
            user={loggedIn?.firstName || "Guest"}
            subtext="Unable to load account information. Please try again."
          />
        </div>
      </section>
    );
  }

  const account = await getAccount({ appwriteItemId });
  
  // Check for errors from getAccount
  const accountError = (account as any)?.error;

  return (
    <ClientDemoWrapper>
      <section className="home">
        <div className="home-content">
          <ErrorDisplay 
            error={accountsError || accountError} 
            title="Account Error"
            showPlaidCredentials={!!accountsError || !!accountError}
          />
        <header className="home-header">
          <HeaderBox
            type="greeting"
            title="Welcome"
            user={loggedIn?.firstName || "Guest"}
            subtext="Access and manage your account and transactions efficiently"
          />
          <TotalBalanceBox
            accounts={accountsData}
            totalBanks={accounts?.totalBanks}
            totalCurrentBalance={accounts?.totalCurrentBalance}
          />
        </header>
        <RecentTransactions
          accounts={accountsData}
          transactions={account?.transactions}
          appwriteItemId={appwriteItemId}
          page={currentPage}
        />
      </div>
      <RightSidebar
        user={loggedIn}
        transactions={account?.transactions}
        banks={accountsData?.slice(0, 2)}
      />
      </section>
    </ClientDemoWrapper>
  );
};

export default Home;
