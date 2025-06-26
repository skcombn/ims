import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../constants";
import { Toast } from "../../helpers/CustomToastify";

async function addSetup(data) {
  await fetch(queryKeys.setup, {
    method: "POST",
    body: JSON.stringify({ ...data }),
  });
}

export function useAddSetup(data) {
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: (data) => addSetup(data),
    onSuccess: () => {
      Toast({
        title: "New Setup being added!",
        status: "success",
        customId: "setupAdd",
      });
    },
    onError: () => {
      Toast({
        title: "Setup Add Error!",
        status: "warning",
        customId: "setupAddErr",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries("setup");
    },
  });

  return mutate;
}
