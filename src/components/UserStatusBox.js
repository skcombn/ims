import React, { useState } from "react";
import dayjs from "dayjs";
import {
  Avatar,
  Button,
  IconButton,
  Heading,
  Stack,
  HStack,
  VStack,
  Text,
} from "@chakra-ui/react";
import { RiLogoutBoxRLine } from "react-icons/ri";
import useLocalStorageState from "use-local-storage-state";
import { user_localstorage_key } from "../utils/constants";
import GetLocalUser from "../helpers/GetLocalUser";
import { useAddAuditlog } from "../react-query/auditlog/useAddAuditlog";

const UserStatusBox = () => {
  const [localstate, setLocalState, { removeItem }] = useLocalStorageState(
    user_localstorage_key
  );
  const addAuditlog = useAddAuditlog();
  const localuser = GetLocalUser();

  const handleSignOut = () => {
    //add to auditlog
    const auditdata = {
      al_userid: localuser.userid,
      al_user: localuser.name,
      al_date: dayjs().format("YYYY-MM-DD"),
      al_time: dayjs().format("HHmmss"),
      al_timestr: dayjs().format("HH:mm:ss"),
      al_module: "Sign Out",
      al_action: "Log out",
      al_record: "",
      al_remark: "Successful",
    };
    addAuditlog(auditdata);

    removeItem();
  };

  return (
    <HStack justify="space-between">
      <Heading size="sm">
        {localstate.userid.length > 0 ? localstate.userid : "unknown"}
      </Heading>

      {localstate.userid.length > 0 && (
        <IconButton
          icon={<RiLogoutBoxRLine />}
          display={{ base: "none", md: "inline-flex" }}
          fontSize={"28"}
          fontWeight={600}
          color="teal"
          bg={"white"}
          href={"#"}
          _hover={{
            bg: "teal.300",
          }}
          onClick={handleSignOut}
        ></IconButton>
      )}
    </HStack>
  );
};

export default UserStatusBox;
