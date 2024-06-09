import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import { useCreateAccount } from "../api/use-create-account";
import { useNewAccount } from "@/features/accounts/hooks/use-new-account";
import { AccountForm } from "./account-form";
import { insertAccountSchema } from "@/db/schema";
import { z } from "zod";

const formSchema = insertAccountSchema.pick({
  name: true,
});

type FormValues = z.input<typeof formSchema>;

export const NewAccountSheet = () => {
  const { isOpen, onOpen, onClose } = useNewAccount();

  const { mutate, isPending } = useCreateAccount();

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
          <SheetTitle>Nova conta</SheetTitle>
          <SheetDescription>
            Crie uma nova conta para gerenciar suas transações
          </SheetDescription>
        </SheetHeader>
        <AccountForm
          onSubmit={onSubmit}
          isPending={isPending}
          disabled={isPending}
          defaultValues={{ name: "" }}
        />
      </SheetContent>
    </Sheet>
  );
};
