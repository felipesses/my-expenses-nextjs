import { z } from "zod";
import { Loader2, Trash } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { insertAccountSchema } from "@/db/schema";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const formSchema = insertAccountSchema.pick({
  name: true,
});

type FormValues = z.input<typeof formSchema>;

type Props = {
  id?: string;
  defaultValues?: FormValues;
  onSubmit: (values: FormValues) => void;
  onDelete?: () => void;
  disabled: boolean;
  isPending: boolean;
};

export const AccountForm = ({
  id,
  defaultValues,
  onSubmit,
  onDelete,
  disabled,
  isPending,
}: Props) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues,
  });

  const handleSubmit = (values: FormValues) => {
    onSubmit(values);
  };

  const handleDelete = () => {
    onDelete?.();
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-4 pt-4"
      >
        <FormField
          name="name"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome da conta</FormLabel>
              <FormControl>
                <Input
                  disabled={disabled}
                  placeholder="Nubank, Itaú, Caixa Econômica..."
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <Button disabled={disabled} className="w-full">
          {isPending ? (
            <Loader2 className="size-8 animate-spin" />
          ) : id ? (
            "Salvar mudanças"
          ) : (
            "Criar conta"
          )}
        </Button>

        {id ? (
          <Button
            type="button"
            disabled={disabled}
            onClick={handleDelete}
            className="w-full gap-2"
            variant="outline"
          >
            <Trash className="size-4" />
            <p>Remover conta</p>
          </Button>
        ) : null}
      </form>
    </Form>
  );
};
