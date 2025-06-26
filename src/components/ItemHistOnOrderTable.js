import React, { useState, useMemo } from 'react';
import dayjs from 'dayjs';
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
} from '@chakra-ui/react';
import { Modal } from '@mantine/core';
import { NumericFormat } from 'react-number-format';
//import { Box } from '@mantine/core';
//import { useRecoilState } from "recoil";
//import { itemState } from "../data/atomdata";
//import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
//import { AlertDialogBox } from "../helpers/AlertDialogBox";
//import { useItems } from "../react-query/items/useItems";
//import { useAddItem } from "../react-query/items/useAddItem";
//import { useUpdateItem } from "../react-query/items/useUpdateItem";
//import { useDeleteItem } from "../react-query/items/useDeleteItem";
//import { useItemsOnOrder } from "../react-query/itemsonorder/useItemsOnOrder";
import CustomReactTable from '../helpers/CustomReactTable';
//import ItemForm from "./ItemForm";

const initial_item = {
  item_no: '',
  item_desp: '',
  item_brand: '',
  item_manufacturer: '',
  item_catno: '',
  item_lotno: '',
  item_grade: '',
  item_datereceived: dayjs().format('YYYY-MM-DD'),
  item_location: '',
  item_condition: '',
  item_size: '',
  item_suppno: '',
  item_supplier: '',
  item_price: 0,
  item_cost: 0,
  item_dateused: dayjs().format('YYYY-MM-DD'),
  item_others: '',
  item_certificate: '',
  item_content: '',
  item_attachment1: '',
  item_attachment2: '',
  item_attachment3: '',
  item_type: '',
  item_expirydate: dayjs().format('YYYY-MM-DD'),
  item_productno: '',
  item_trackexpiry: false,
  item_unit: '',
};

const ItemHistOnOrderTable = ({ itemsonorder }) => {
  //const { items } = useItems();
  //const addItem = useAddItem();
  //const updateItem = useUpdateItem();
  //const deleteItem = useDeleteItem();
  //const { itemsonorder } = useItemsOnOrder();
  //const [state, setState] = useRecoilState(itemState);
  //const [statustype, setStatusType] = useState("");
  //const [filterText, setFilterText] = React.useState("");

  const totqtyonorder = itemsonorder.reduce((acc, item) => {
    return acc + item.tl_qty;
  }, 0);

  const {
    isOpen: isAlertDeleteOpen,
    onOpen: onAlertDeleteOpen,
    onClose: onAlertDeleteClose,
  } = useDisclosure();

  const {
    isOpen: isItemOpen,
    onOpen: onItemOpen,
    onClose: onItemClose,
  } = useDisclosure();

  const title = 'Items On Order';

  const columns = useMemo(
    () => [
      {
        header: 'Item No',
        accessorFn: row => row.tl_itemno,
        size: 100,
        mantineTableBodyCellProps: {
          align: 'left',
        },
      },
      {
        id: 'desp',
        header: 'Description',
        accessorFn: row => row.tl_desp,
        size: 200,
        mantineTableBodyCellProps: {
          align: 'left',
        },
      },
      {
        header: 'Packing',
        accessorFn: row => row.tl_packing,
        //size: 200,
        mantineTableBodyCellProps: {
          align: 'left',
        },
      },
      /*  {
        header: 'U/Price',
        accessorFn: row => row.item_wsp,
        size: 100,
        Cell: ({ cell }) =>
          cell.getValue()?.toLocaleString?.('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }),
        mantineTableBodyCellProps: {
          align: 'right',
        },
      }, */
      {
        header: 'U/Cost',
        accessorFn: row => row.tl_netucost,
        size: 100,
        Cell: ({ cell }) =>
          cell.getValue()?.toLocaleString?.('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }),
        mantineTableBodyCellProps: {
          align: 'right',
        },
      },
      {
        header: 'Qty OnOrderd',
        accessorFn: row => row.tl_qty,
        Cell: ({ row, cell }) => (
          <NumericFormat
            value={row.original.tl_qty}
            decimalScale={3}
            fixedDecimalScale
            displayType="text"
            thousandSeparator=","
          />
        ),
        //size: 120,
        mantineTableBodyCellProps: {
          align: 'right',
        },
      },

      {
        header: 'Lot No',
        accessorFn: row => row.tl_lotno,
        size: 100,
        mantineTableBodyCellProps: {
          align: 'left',
        },
      },
      {
        header: 'PO No',
        accessorFn: row => row.tl_tranno,
        size: 100,
        mantineTableBodyCellProps: {
          align: 'left',
        },
      },

      {
        header: 'PO Date',
        accessorFn: row => {
          const tDay = new Date(row.tl_trandate);
          tDay.setHours(0, 0, 0, 0); // remove time from date
          return tDay;
        },
        Cell: ({ cell }) =>
          dayjs(cell.getValue().toLocaleDateString()).format('DD-MMM-YYYY'),
        size: 200,
        filterVariant: 'date',
        sortingFn: 'datetime',
        mantineTableBodyCellProps: {
          align: 'left',
        },
      },
    ],
    []
  );

  const handleOnDeleteConfirm = () => {
    //deleteItem(state);
  };

  const handleAddItem = () => {
    //setStatusType((prev) => (prev = "add"));
    const data = { ...initial_item };
    //setState(data);
    //onItemOpen(true);
  };

  const handleEditItem = row => {
    const { original } = row;
    //setStatusType((prev) => (prev = "edit"));
    //setState(original);
    //onItemOpen(true);
  };

  const handleDeleteItem = row => {
    const { original } = row;
    //setState((prev) => (prev = { ...original }));
    //onAlertDeleteOpen();
  };

  const add_Item = data => {
    //console.log('add', data);
    //addItem(data);
  };

  const update_Item = data => {
    //updateItem(data);
  };

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
          title={`Total Qty OnOrder: ${totqtyonorder}`}
          columns={columns}
          data={itemsonorder}
          disableRowActionStatus={true}
          disableAddStatus={true}
          disableEditStatus={true}
          initialState={{ sorting: [{ id: 'desp', desc: false }] }}
        />
      </Box>
    </Flex>
  );
};

export default ItemHistOnOrderTable;
