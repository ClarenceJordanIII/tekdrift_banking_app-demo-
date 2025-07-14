"use client";

import {
  createLinkToken,
  exchangePublicToken,
} from "@/lib/actions/user.actions";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import {
  PlaidLinkOnSuccess,
  PlaidLinkOptions,
  usePlaidLink,
} from "react-plaid-link";
import { Button } from "./ui/button";

const PlaidLink = ({ user, variant }: PlaidLinkProps) => {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getLinkToken = async () => {
      const data = await createLinkToken(user);

      setToken(data?.linkToken);
    };
    getLinkToken();
  }, [user]);

  const onSuccess = useCallback<PlaidLinkOnSuccess>(
    async (public_token: string) => {
      try {
        setIsLoading(true);
        setError(null);
        
        await exchangePublicToken({
          publicToken: public_token,
          user,
        });

        router.push("/");
      } catch (error: any) {
        console.error("Error connecting bank account:", error);
        setError(error.message || "Failed to connect bank account. Please try again.");
        setIsLoading(false);
      }
    },
    [user, router]
  );

  const config: PlaidLinkOptions = {
    token,
    onSuccess,
  };
  const { open, ready } = usePlaidLink(config);
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
        <h4 className="text-blue-800 font-semibold mb-2">🔑 Test Credentials</h4>
        <div className="text-blue-700 space-y-1 text-sm">
          <p><strong>Username:</strong> <code className="bg-blue-100 px-2 py-1 rounded">user_good</code></p>
          <p><strong>Password:</strong> <code className="bg-blue-100 px-2 py-1 rounded">pass_good</code></p>
        </div>
      </div>
      
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center w-full max-w-md">
          <h4 className="text-red-800 font-semibold mb-2">❌ Connection Error</h4>
          <p className="text-red-700 text-sm">{error}</p>
          <Button 
            onClick={() => setError(null)} 
            className="mt-2 bg-red-100 text-red-800 hover:bg-red-200 text-xs"
            size="sm"
          >
            Dismiss
          </Button>
        </div>
      )}
      
      {variant === "primary" ? (
        <Button
          onClick={() => open()}
          disabled={!ready || isLoading}
          className="plaidlink-primary"
        >
          {isLoading ? "Connecting..." : "Connect bank"}
        </Button>
      ) : variant === "ghost" ? (
        <Button 
          onClick={() => open()} 
          disabled={isLoading}
          className="plaidlink-ghost"
        >
          <Image
            src="/icons/connect-bank.svg"
            alt="connect bank"
            width={24}
            height={24}
          />
          <p className="hidden text-[16px] font-semibold text-black-2 xl:block">
            {isLoading ? "Connecting..." : "Connect bank"}
          </p>
        </Button>
      ) : (
        <Button 
          onClick={() => open()} 
          disabled={isLoading}
          className="plaidlink-default"
        >
          <Image
            src="/icons/connect-bank.svg"
            alt="connect bank"
            width={24}
            height={24}
          />
          <p className="text-[16px] font-semibold text-black-2">
            {isLoading ? "Connecting..." : "Connect bank"}
          </p>
        </Button>
      )}
    </div>
  );
};

export default PlaidLink;
