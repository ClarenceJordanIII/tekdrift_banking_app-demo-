import { formatAmount } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import Copy from "./Copy";

const BankCard = ({
  key,
  account,
  userName,
  showBalance = true,
}: CreditCardProps) => {
  return (
    <div key={key}>
      {
        <Link
          href={`/transaction-history/?id=${account.appwriteItemId}`}
          className="bank-card  "
        >
          <div className="bank-card_content">
            <h1 className="text-16 font-semibold text-white">{account.name}</h1>
            <p className="font-ibm-plex-serif font-black text-white">
              {formatAmount(account.currentBalance)}
            </p>
            <article className="flex flex-col gap-2">
              <div className="flex justify-between">
                <h1 className="text-12 font-semibold text-white">{userName}</h1>
                <h2 className="text-12 font-semibold text-white">●●/ ●●</h2>
              </div>
              <p className="text-12 font-semibold tracking-[1.1px] text-white">
                ●●●● ●●●● ●●●●
                <span className="text-16 ">{account?.mask}</span>
              </p>
            </article>
          </div>
          <div className="bank-card_icon">
            <Image src="./icons/Paypass.svg" width={20} height={24} alt="pay" />
            <Image
              src="./icons/mastercard.svg"
              width={45}
              height={32}
              alt="mastercard"
              className="ml-5"
            />
          </div>
          <Image
            src="/icons/lines.png"
            width={316}
            height={190}
            alt="lines"
            className="absolute top-0 left-0"
          />
        </Link>
      }

      {showBalance && <Copy title={account?.shareableId} />}
    </div>
  );
};

export default BankCard;
