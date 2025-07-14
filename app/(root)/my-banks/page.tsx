import BankCard from "@/components/BankCard";
import ErrorDisplay from "@/components/ErrorDisplay";
import HeaderBox from "@/components/HeaderBox";
import PlaidLink from "@/components/PlaidLink";
import { getAccounts } from "@/lib/actions/bank.actions";
import { getLoggedInUser } from "@/lib/actions/user.actions";

const Mybanks = async () => {
  const loggedIn = await getLoggedInUser();
  
  // Check if user is properly logged in
  if (!loggedIn || !loggedIn.$id) {
    return (
      <section className="flex">
        <div className="my-banks">
          <ErrorDisplay 
            error="User not authenticated. Please sign in again."
            title="Authentication Error"
            showPlaidCredentials={false}
          />
        </div>
      </section>
    );
  }

  const accounts = await getAccounts({ userId: loggedIn.$id });
  
  // Check for errors from getAccounts
  const accountsError = (accounts as any)?.error;

  return (
    <section className="flex">
      <div className="my-banks">
        <ErrorDisplay 
          error={accountsError} 
          title="Banks Loading Error"
          showPlaidCredentials={true}
        />
        <HeaderBox
          title="My Bank Accounts"
          subtext="Effortlessly manage your banking activites."
        />
        <div className="space-y-4 ">
          <h2 className="header-2">Your cards</h2>
          <div className="flex flex-wrap gap-6">
            {accounts && accounts.data.length > 0 ? (
              accounts.data.map((a: Account) => (
                <BankCard
                  key={a.id}
                  account={a}
                  userName={loggedIn?.firstName}
                />
              ))
            ) : (
              <div className="flex flex-col items-center justify-center w-full p-8 text-center">
                <p className="text-gray-500 mb-4">
                  {accountsError ? "Error loading bank accounts." : "No bank accounts connected yet."}
                </p>
                <PlaidLink user={loggedIn} variant="primary" />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Mybanks;
