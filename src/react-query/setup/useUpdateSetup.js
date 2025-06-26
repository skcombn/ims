import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../constants";
import { Toast } from "../../helpers/CustomToastify";

async function updateSetup(data) {
  const { id, ...fields } = data;

  await fetch(queryKeys.setup, {
    method: "PUT",
    body: JSON.stringify({ id, ...fields }),
  });
}

export function useUpdateSetup(data) {
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: (data) => updateSetup(data),
    onSuccess: () => {
      Toast({
        title: "Setup being updated!",
        status: "success",
        customId: "setupupd",
      });
    },
    onError: () => {
      Toast({
        title: "Setup Update Error! ",
        status: "warning",
        customId: "setupupdErr",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries("setup");
    },
  });

  return mutate;
}
