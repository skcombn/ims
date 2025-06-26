import React, { useMemo } from "react";

import {
  Box,
  Flex,
  Heading,
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  //ModalHeader,
  //ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from "@chakra-ui/react";

import { useRecoilState } from "recoil";
import { searchuserState } from "../data/atomdata";
import { useUsers } from "../react-query/users/useUsers";
import CustomReactTable from "../helpers/CustomReactTable";

const UserSearchTable = ({ update_Item, onUserSearchClose }) => {
  const { users } = useUsers();
  const [filterText, setFilterText] = React.useState("");
  const [searchuser, setSearchUser] = useRecoilState(searchuserState);
  const title = "User Search";

  const filteredData = users.filter(
    (item) =>
      item.u_name &&
      item.u_name.toLowerCase().includes(filterText.toLowerCase())
  );

  const columns = useMemo(
    () => [
      {
        header: "User Id",
        accessorFn: (row) => row.u_userid,
        size: 120,
        mantineTableBodyCellProps: {
          align: "left",
        },
      },
      {
        header: "Name",
        accessorFn: (row) => row.u_name,
        size: 200,
        mantineTableBodyCellProps: {
          align: "left",
        },
      },
      {
        header: "Email",
        accessorFn: (row) => row.u_email,
        //size: 120,
        mantineTableBodyCellProps: {
          align: "left",
        },
      },
      {
        header: "Group",
        accessorFn: (row) => row.u_group,
        //size: 120,
        mantineTableBodyCellProps: {
          align: "left",
        },
      },
      {
        header: "Level",
        accessorFn: (row) => row.u_level,
        //size: 120,
        mantineTableBodyCellProps: {
          align: "left",
        },
      },
    ],
    []
  );

  const handleRowDoubleClick = (row) => {
    const { original } = row;

    setSearchUser((prev) => (prev = original));
    update_Item(original);
    onUserSearchClose();
  };

  const handleSelectRow = (row) => {
    const { original } = row;
    const { item_no } = original;
    console.log("click", original);
    setSearchUser((prev) => (prev = original));
    update_Item(original);
    onUserSearchClose();
  };

  return (
    <Flex>
      <Box
        width="100%"
        borderWidth={1}
        borderColor="teal.800"
        borderRadius={10}
        overflow="scroll"
      >
        <CustomReactTable
          title={title}
          columns={columns}
          data={users}
          disableExportStatus={true}
          disableAddStatus={true}
          disableSelectStatus={false}
          disableUpdateStatus={true}
          enableSelectStatus={true}
          //handleAdd={handleAddEquip}
          //handleEdit={handleEditEquip}
          //handleDelete={handleDeleteEquip}
          handleSelect={handleSelectRow}
          handleRowDoubleClick={handleRowDoubleClick}
        />
      </Box>
    </Flex>
  );
};

export default UserSearchTable;
