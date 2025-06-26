import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const USER_LOCALSTORAGE_KEY = "ims_user";

export function getStoredUser() {
  const storedUser = localStorage.getItem(USER_LOCALSTORAGE_KEY);
  return storedUser ? JSON.parse(storedUser) : null;
}

export function setStoredUser(value) {
  localStorage.setItem(USER_LOCALSTORAGE_KEY, JSON.stringify(value));
}

export function clearStoredUser() {
  localStorage.removeItem(USER_LOCALSTORAGE_KEY);
}

export default function useUserContext() {
  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: [USER_LOCALSTORAGE_KEY],
    queryFn: getStoredUser,
  });

  const { mutateAsync: setValue } = useMutation({
    mutationFn: (value) => setStoredUser(value),
    onMutate: (mutatedData) => {
      const current = data;
      queryClient.setQueryData([USER_LOCALSTORAGE_KEY], mutatedData);
      return current;
    },
    onError: (_, __, rollback) => {
      queryClient.setQueryData([USER_LOCALSTORAGE_KEY], rollback);
    },
  });
  return [data, setValue];
}
