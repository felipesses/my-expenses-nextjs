import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { client } from "@/lib/hono";

export const useGetTransactionsByMonth = () => {
  const params = useSearchParams();
  const month = params.get("month") || "";
  const accountId = params.get("accountId") || "";

  const query = useQuery({
    enabled: !!accountId && !!month,
    queryKey: ["transactionsByMonth", { month, accountId }],
    queryFn: async () => {
      const response = await client.api.transactions.transactionsByMonth.$get({
        query: {
          month,
          accountId,
        },
      });

      if (!response.ok) {
        throw new Error(
          `Failed to fetch transactions by month with status: ${response.status}`
        );
      }

      const { data } = await response.json();

      return data;
    },
  });

  return query;
};
