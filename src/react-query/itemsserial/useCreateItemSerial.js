import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../constants";
import { Toast } from "../../helpers/CustomToastify";

async function addItemSerial(data) {
  await fetch(queryKeys.itemsserial, {
    method: "POST",
    body: JSON.stringify({ ...data }),
  });
}

export function useAddItemSerial(data) {
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: (data) => addItemSerial(data),
    onSuccess: () => {
      Toast({
        title: "New Serial Item being added!",
        status: "success",
        customId: "itemserialAdd",
      });
    },
    onError: () => {
      Toast({
        title: "Item Serial Add Error!",
        status: "warning",
        customId: "itemserialAddErr",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries("itemsserial");
    },
  });

  return mutate;
}
