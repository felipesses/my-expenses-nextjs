import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import { useConfirm } from "../hooks/use-confirm";
import { useOpenAccount } from "../hooks/use-open-account";
import { useEditAccount } from "@/features/accounts/api/use-edit-account";
import { useDeleteAccount } from "@/features/accounts/api/use-delete-account";
import { AccountForm } from "./account-form";
import { insertAccountSchema } from "@/db/schema";
import { z } from "zod";
import { useGetAccount } from "../api/use-get-account";
import { Loader2 } from "lucide-react";

const formSchema = insertAccountSchema.pick({
  name: true,
});

type FormValues = z.input<typeof formSchema>;

export const EditAccountSheet = () => {
  const { id, isOpen, onClose } = useOpenAccount();

  const [ConfirmDialog, confirm] = useConfirm(
    "Tem certeza?",
    "Você está prestes a remover essa conta"
  );

  const accountQuery = useGetAccount(id);
  const { mutate, isPending } = useEditAccount(id);
  const { mutate: deleteMutate } = useDeleteAccount(id);

  const isLoading = accountQuery.isLoading;

  const onSubmit = (values: FormValues) => {
    mutate(values, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  const defaultValues = accountQuery?.data
    ? {
        name: accountQuery.data.name,
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
