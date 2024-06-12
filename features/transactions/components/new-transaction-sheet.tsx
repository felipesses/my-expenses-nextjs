import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import { useCreateTransaction } from "../api/use-create-transaction";
import { useNewTransaction } from "@/features/transactions/hooks/use-new-transaction";

import { useCreateCategory } from "@/features/categories/api/use-create-category";
import { useGetCategories } from "@/features/categories/api/use-get-categories";

import { useGetAccounts } from "@/features/accounts/api/use-get-accounts";
import { useCreateAccount } from "@/features/accounts/api/use-create-account";

import { insertTransactionsSchema } from "@/db/schema";
import { z } from "zod";
import { TransactionForm } from "./transaction-form";
import { Loader2 } from "lucide-react";

const formSchema = insertTransactionsSchema.omit({
  id: true,
});

type FormValues = z.input<typeof formSchema>;

export const NewTransactionSheet = () => {
  const { isOpen, onClose } = useNewTransaction();

  const { mutate, isPending } = useCreateTransaction();

  const categoryQuery = useGetCategories();
  const categoryMutation = useCreateCategory();

  const accountQuery = useGetAccounts();
  const accountMutation = useCreateAccount();

  const isSomeDataPending =
    isPending || categoryMutation.isPending || accountMutation.isPending;

  const isLoading = categoryQuery.isLoading || accountQuery.isLoading;

  const onCreateCategory = (name: string) =>
    categoryMutation.mutate({
      name,
    });

  const onCreateAccount = (name: string) =>
    accountMutation.mutate({
      name,
    });

  const categoryOptions = (categoryQuery.data ?? []).map((category) => ({
    label: category.name,
    value: category.id,
  }));

  const accountOptions = (accountQuery.data ?? []).map((account) => ({
    label: account.name,
    value: account.id,
  }));

  const onSubmit = (values: FormValues) => {
    mutate(values, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="space-y-4">
        <SheetHeader>
          <SheetTitle>Nova transação</SheetTitle>
          <SheetDescription>Crie uma nova transação</SheetDescription>
        </SheetHeader>
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="size-4 text-muted-foreground animate-spin" />
          </div>
        ) : (
          <TransactionForm
            onSubmit={onSubmit}
            isPending={isSomeDataPending}
            disabled={isSomeDataPending}
            categoryOptions={categoryOptions}
            onCreateCategory={onCreateCategory}
            accountOptions={accountOptions}
            onCreateAccount={onCreateAccount}
          />
        )}
      </SheetContent>
    </Sheet>
  );
};
