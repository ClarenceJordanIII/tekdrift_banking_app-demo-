import ErrorDisplay from "@/components/ErrorDisplay";
import HeaderBox from "@/components/HeaderBox";
import PaymentTransferForm from "@/components/PaymentTransferForm";
import { getAccounts } from "@/lib/actions/bank.actions";
import { getLoggedInUser } from "@/lib/actions/user.actions";

const Transfer = async () => {
  const loggedIn = await getLoggedInUser();
  
  // Check if user is properly logged in
  if (!loggedIn || !loggedIn.$id) {
    return (
      <section className="payment-transfer">
        <ErrorDisplay 
          error="User not authenticated. Please sign in again."
          title="Authentication Error"
          showPlaidCredentials={false}
        />
      </section>
    );
  }

  const accounts = await getAccounts({ userId: loggedIn.$id });
  
  // Check for errors from getAccounts
  const accountsError = (accounts as any)?.error;
  
  if (!accounts) return;
  const accountsData = accounts?.data;

  return (
    <section className="payment-transfer">
      <ErrorDisplay 
        error={accountsError} 
        title="Payment Transfer Error"
        showPlaidCredentials={true}
      />
      <HeaderBox
        title="Payment Transfer"
        subtext="Please provide any specific details or notes related to the payment transfer"
      />
      <section className="size-full pt-5">
        <PaymentTransferForm accounts={accountsData} />
      </section>
    </section>
  );
};

export default Transfer;
