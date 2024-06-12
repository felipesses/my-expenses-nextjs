import { toast } from "sonner";
import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/hono";

type ResponseType = InferResponseType<
  (typeof client.api.transactions)["bulk-delete"]["$post"]
>;
type RequestType = InferRequestType<
  (typeof client.api.transactions)["bulk-delete"]["$post"]
>["json"];

export const useBulkDeleteTransactions = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api.transactions["bulk-delete"]["$post"]({
        json,
      });
      return await response.json();
    },
    onSuccess: (_, variables) => {
      const ids = variables.ids;
      console.log("IDS VARIABLES", ids);
      let successString = "";

      if (ids.length <= 1) {
        successString = "Transação removida com sucesso!";
      } else {
        successString = "Transações removidas com sucesso!";
      }

      toast.success(successString);
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
    onError: () => {
      toast.error("Falha ao remover transações");
    },
  });

  return mutation;
};
