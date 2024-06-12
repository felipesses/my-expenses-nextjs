import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import { useConfirm } from "../hooks/use-confirm";
import { useOpenTransaction } from "../hooks/use-open-transaction";
import { useEditTransaction } from "@/features/transactions/api/use-edit-transaction";
import { useDeleteTransaction } from "@/features/transactions/api/use-delete-transaction";
import { AccountForm } from "./transaction-form";
import { insertTransactionsSchema } from "@/db/schema";
import { z } from "zod";
import { useGetTransaction } from "../api/use-get-transaction";
import { Loader2 } from "lucide-react";

const formSchema = insertTransactionsSchema.pick({
  name: true,
});

type FormValues = z.input<typeof formSchema>;

export const EditTransactionSheet = () => {
  const { id, isOpen, onClose } = useOpenTransaction();

  const [ConfirmDialog, confirm] = useConfirm(
    "Tem certeza?",
    "Você está prestes a remover essa transação"
  );

  const transactionQuery = useGetTransaction(id);
  const { mutate, isPending } = useEditTransaction(id);
  const { mutate: deleteMutate } = useDeleteTransaction(id);

  const isLoading = transactionQuery.isLoading;

  const onSubmit = (values: FormValues) => {
    mutate(values, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  const defaultValues = transactionQuery?.data
    ? {
        name: transactionQuery.data.name,
      }
    : {
        name: "",
      };

  const onDelete = async () => {
    const ok = await confirm();

    if (ok) {
      deleteMutate(undefined, {
        onSuccess: () => {
          onClose();
        },
      });
    }
  };

  return (
    <>
      <ConfirmDialog />
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent className="space-y-4">
          <SheetHeader>
            <SheetTitle>Editar conta</SheetTitle>
            <SheetDescription>Atualize os dados da sua conta</SheetDescription>
          </SheetHeader>
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="size-4 text-muted-foreground animate-spin" />
            </div>
          ) : (
            <AccountForm
              id={id}
              onSubmit={onSubmit}
              isPending={isPending}
              disabled={isPending}
              defaultValues={defaultValues}
              onDelete={onDelete}
            />
          )}
        </SheetContent>
      </Sheet>
    </>
  );
};
