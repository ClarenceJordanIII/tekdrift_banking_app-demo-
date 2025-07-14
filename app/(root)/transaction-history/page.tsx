import ErrorDisplay from "@/components/ErrorDisplay";
import HeaderBox from "@/components/HeaderBox";
import { Pagination } from "@/components/Pagination";
import TransactionsTable from "@/components/TransactionsTable";
import { getAccount, getAccounts } from "@/lib/actions/bank.actions";
import { getLoggedInUser } from "@/lib/actions/user.actions";
import { formatAmount } from "@/lib/utils";

const TransactionHistory = async ({
  searchParams: { id, page },
}: SearchParamProps) => {
  const currentPage = Number(page as string) || 1;

  const loggedIn = await getLoggedInUser();
  const accounts = await getAccounts({ userId: loggedIn.$id });
  
  // Check for errors from getAccounts
  const accountsError = (accounts as any)?.error;

  if (!accounts) return;
  const accountsData = accounts?.data;
  
  if (!accountsData || accountsData.length === 0) {
    return (
      <section className="transactions">
        <div className="transactions-header">
          <ErrorDisplay 
            error={accountsError || "No bank accounts found"} 
            title="Transaction History Error"
            showPlaidCredentials={true}
          />
          <div>No bank accounts found. Please connect a bank account first.</div>
        </div>
      </section>
    );
  }
  
  const appwriteItemId = (id as string) || accountsData[0]?.appwriteItemId;
  
  if (!appwriteItemId) {
    return (
      <section className="transactions">
        <ErrorDisplay 
          error="Unable to load account information" 
          title="Account Error"
          showPlaidCredentials={true}
        />
        <div>Unable to load account information. Please try again.</div>
      </section>
    );
  }

  const account = await getAccount({ appwriteItemId });
  
  // Check for errors from getAccount
  const accountError = (account as any)?.error;
  
  if (!account || !account.data) {
    return (
      <section className="transactions">
        <ErrorDisplay 
          error={accountError || "Account not found"} 
          title="Account Error"
          showPlaidCredentials={true}
        />
        <div>Account not found. Please try again.</div>
      </section>
    );
  }

  const rowsPerPage = 10;
  const totalPages = Math.ceil(account?.transactions.length / rowsPerPage);

  const indexOfLastTransaction = currentPage * rowsPerPage;

  const indexOfFisrtTransaction = indexOfLastTransaction - rowsPerPage;

  const currentTransactions = account?.transactions.slice(
    indexOfFisrtTransaction,
    indexOfLastTransaction
  );

  return (
    <div className="transactions">
      <ErrorDisplay 
        error={accountsError || accountError} 
        title="Transaction Error"
        showPlaidCredentials={!!(accountsError || accountError)}
      />
      <div className="transactions-header">
        <HeaderBox
          title="Transaction History"
          subtext="See your bank details and transactions."
        />
      </div>

      <div className="space-y-6">
        <div className="transactions-account">
          <div className="flex flex-col gap-2">
            <h2 className="text-18 font-bold text-white">
              {account?.data.name}
            </h2>
            <p className="text-14 text-blue-25">{account?.data.officialName}</p>
            <p className="text-14 font-semibold tracking-[1.1px] text-white">
              ●●●● ●●●● ●●●● {account?.data.mask}
            </p>
          </div>

          <div className="transactions-account-balance">
            <p className="text-14">Current balance</p>
            <p className="text-24 text-center font-bold">
              {formatAmount(account?.data.currentBalance)}
            </p>
          </div>
        </div>

        <section className="flex w-full flex-col gap-6">
          <TransactionsTable transactions={currentTransactions} />
          {totalPages > 1 && (
            <div className="my-4 w-full">
              <Pagination totalPages={totalPages} page={currentPage} />
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default TransactionHistory;
