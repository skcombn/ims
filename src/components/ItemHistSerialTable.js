import React, { useState, useMemo } from "react";
import dayjs from "dayjs";
import {
  Box,
  Flex,
  Heading,
  IconButton,
  //Modal,
  //ModalOverlay,
  //ModalContent,
  //ModalHeader,
  //ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from "@chakra-ui/react";
import { Modal } from "@mantine/core";
import { NumericFormat } from "react-number-format";
import CustomReactTable from "../helpers/CustomReactTable";

const ItemHistSerialTable = ({ itemsserialdata }) => {
  const columns = useMemo(
    () => [
      {
        header: "Serial No",
        accessorKey: "is_serialno",
        size: 100,
        mantineTableBodyCellProps: {
          align: "left",
        },
      },
      {
        header: "PO No",
        accessorFn: (row) => row.is_pono,
        size: 100,
        mantineTableBodyCellProps: {
          align: "left",
        },
      },

      {
        header: "PO Date",
        accessorFn: (row) => {
          const tDay = new Date(row.is_podate);
          tDay.setHours(0, 0, 0, 0); // remove time from date
          return tDay;
        },
        Cell: ({ cell }) =>
          dayjs(cell.getValue().toLocaleDateString()).format("DD-MMM-YYYY"),
        size: 200,
        filterVariant: "date",
        sortingFn: "datetime",
        mantineTableBodyCellProps: {
          align: "left",
        },
      },
    ],
    []
  );
  return (
    <Flex p={5}>
      <Box
        width="100%"
        borderWidth={1}
        borderColor="teal.800"
        borderRadius={15}
        overflow="auto"
      >
        <CustomReactTable
          title="Serial No Table"
          columns={columns}
          data={itemsserialdata}
          disableRowActionStatus={true}
          disableAddStatus={true}
          disableEditStatus={true}
          initialState={{ sorting: [{ id: "is_serialno", desc: false }] }}
        />
      </Box>
    </Flex>
  );
};

export default ItemHistSerialTable;
