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
import { searchitemState } from "../data/atomdata";
import { useCustomers } from "../react-query/customers/useCustomers";
import CustomReactTable from "../helpers/CustomReactTable";

const initial_cust = {
  c_custno: "",
  c_cust: "",
  c_add1: "",
  c_add2: "",
  c_add3: "",
  c_add4: "",
  c_phone: "",
  c_email: "",
  c_fax: "",
  c_contact: "",
  c_area: "",
};

const CustomerSearchTable = ({ update_Item, onCustomerSearchClose }) => {
  const { customers } = useCustomers();
  const [filterText, setFilterText] = React.useState("");
  const [searchitem, setSearchItem] = useRecoilState(searchitemState);
  const title = "Customer Search";

  const columns = useMemo(
    () => [
      {
        header: "Cust No",
        accessorKey: "c_custno",
        size: 120,
        mantineTableBodyCellProps: {
          align: "left",
        },
      },
      {
        header: "Customer",
        accessorKey: "c_cust",
        size: 200,
        mantineTableBodyCellProps: {
          align: "left",
        },
      },
      {
        header: "Phone",
        accessorFn: (row) => row.c_phone,
        size: 120,
        mantineTableBodyCellProps: {
          align: "left",
        },
      },
      {
        header: "Email",
        accessorFn: (row) => row.c_email,
        size: 120,
        mantineTableBodyCellProps: {
          align: "left",
        },
      },
      {
        header: "Fax",
        accessorFn: (row) => row.c_fax,
        size: 120,
        mantineTableBodyCellProps: {
          align: "left",
        },
      },
      {
        header: "Contact",
        accessorFn: (row) => row.c_contact,
        size: 120,
        mantineTableBodyCellProps: {
          align: "left",
        },
      },
      {
        header: "Area",
        accessorFn: (row) => row.c_area,
        size: 120,
        mantineTableBodyCellProps: {
          align: "left",
        },
      },
    ],
    []
  );

  const handleRowDoubleClick = (row) => {
    const { original } = row;
    setSearchItem((prev) => (prev = original));
    update_Item(original);
    onCustomerSearchClose();
  };

  const handleSelectRow = (row) => {
    const { original } = row;
    setSearchItem((prev) => (prev = original));
    update_Item(original);
    onCustomerSearchClose();
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
          data={customers}
          disableExportStatus={true}
          disableRowActionStatus={true}
          disableAddStatus={true}
          initialState={{ sorting: [{ id: "c_cust", desc: false }] }}
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

export default CustomerSearchTable;
