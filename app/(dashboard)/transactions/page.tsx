"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNewTransaction } from "@/features/transactions/hooks/use-new-transaction";
import { useGetTransactions } from "@/features/transactions/api/use-get-transactions";
import { useBulkDeleteTransactions } from "@/features/transactions/api/use-bulk-delete-transactions";

import { Loader2, Plus } from "lucide-react";

import { DataTable } from "@/components/data-table";
import { Skeleton } from "@/components/ui/skeleton";

import { columns } from "./columns";
import { useGetTransactionsByMonth } from "@/features/transactions/api/use-get-transactions-by-month";

const TransactionsPage = () => {
  const newTransaction = useNewTransaction();
  const deleteTransactions = useBulkDeleteTransactions();
  const transactionsQuery = useGetTransactions();
  const transactions = transactionsQuery.data || [];

  const { data } = useGetTransactionsByMonth();

  console.log("TRANSACTION JUNE DATA ", data);

  const isDisabled =
    transactionsQuery.isLoading || deleteTransactions.isPending;

  if (transactionsQuery.isLoading) {
    return (
      <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
        <Card className="border-none drop-shadow-sm">
          <CardHeader>
            <Skeleton className="h-8 w-48" />
          </CardHeader>
          <CardContent>
            <div className="h-[500px] w-full flex items-center justify-center">
              <Loader2 className="size-6 text-slate-300 animate-spin" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
      <Card className="border-none drop-shadow-sm">
        <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
          <CardTitle className="text-xl line-clamp-1">
            Histórico de transações
          </CardTitle>
          <Button onClick={newTransaction.onOpen} size="sm">
            <Plus className="size-4 mr-2" />
            Adicionar transação
          </Button>
        </CardHeader>

        <CardContent>
          {/* <DataTable
            columns={columns}
            data={transactions}
            filterKeyName="transações"
            filterKey="notes"
            onDelete={(rows) => {
              const ids = rows.map((r) => r.original.id);
              deleteTransactions.mutate({ ids });
            }}
            disabled={isDisabled}
          /> */}
        </CardContent>
      </Card>
    </div>
  );
};

export default TransactionsPage;
