import React from "react";
import useLocalStorageState from "use-local-storage-state";
import { user_localstorage_key } from "../utils/constants";

const GetLocalUser = () => {
  const [localstate, setLocalState, { removeItem }] = useLocalStorageState(
    user_localstorage_key
  );

  return localstate;
};

export default GetLocalUser;
