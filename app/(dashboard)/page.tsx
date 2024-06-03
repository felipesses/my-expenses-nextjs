"use client";

import { useGetAccounts } from "@/hooks/accounts/api/use-get-accounts";

export default function Home() {
  const { data, isLoading } = useGetAccounts();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div>
        {data?.map((account) => (
          <div key={account.id}>{account.name}</div>
        ))}
      </div>
    </div>
  );
}
