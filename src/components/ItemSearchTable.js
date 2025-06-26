import React, { useState } from "react";
import {
  Box,
  Checkbox,
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
import { NumericFormat } from "react-number-format";
//import { EditIcon, DeleteIcon } from '@chakra-ui/icons';
import { useRecoilState } from "recoil";
import { searchitemState } from "../data/atomdata";
import { useItems } from "../react-query/items/useItems";
import CustomReactTable from "../helpers/CustomReactTable";
// import { useAddItem } from '../react-query/items/useAddItem';
// import { useUpdateItem } from '../react-query/items/useUpdateItem';
// import { useDeleteItem } from '../react-query/items/useDeleteItem';
// import ItemForm from './ItemForm';

const initial_item = [
  {
    item_no: "",
    item_desp: "",
    item_unit: "",
    item_packing: "",
    item_category: "",
    item_brand: "",
    item_location: "",
    item_dept: "",
    item_uprice_pc: 0,
    item_uprice_ctn: 0,
    item_pfactor: 1,
    item_qtyhand: 0,
    item_nonstock: false,
    item_type: "",
    item_smcode: "",
  },
];

const ItemSearchTable = ({ update_Item, onItemSearchClose }) => {
  const { items } = useItems();
  const [searchitem, setSearchItem] = useRecoilState(searchitemState);
  const titles = "Items Search Table";

  const columns = [
    {
      header: "Item No",
      accessorFn: (row) => row.item_no,
      size: 80,
      mantineTableBodyCellProps: ({ cell }) => ({
        sx: {
          color: cell.getValue("item_inactive") === true ? "red" : "black",
          fontWeight: "bold",
        },
      }),
    },
    {
      id: "desp",
      header: "Desciption",
      accessorFn: (row) => row.item_desp,
      size: "200",
      mantineTableBodyCellProps: {
        align: "left",
      },
    },
    {
      header: "Packing",
      accessorFn: (row) => row.item_pack,
      size: "100",
      mantineTableBodyCellProps: {
        align: "left",
      },
    },

    {
      header: "UPrice",
      accessorFn: (row) => row.item_price,
      size: "100px",
      //align: 'left',
      Cell: ({ cell }) =>
        cell.getValue()?.toLocaleString?.("en-US", {
          style: "currency",
          currency: "USD",
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }),
      mantineTableBodyCellProps: {
        align: "right",
      },
    },
    /*  {
      header: 'U/Cost',
      accessorFn: row => row.item_cif,
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
      header: "Unit",
      accessorFn: (row) => row.item_unit,
      size: "100",
      mantineTableBodyCellProps: {
        align: "left",
      },
    },
    {
      header: "Qty Onhand",
      accessorFn: (row) => row.item_qtyonhand,
      Cell: ({ row }) => (
        <NumericFormat
          value={row.original.item_qtyonhand}
          decimalScale={3}
          fixedDecimalScale
          displayType="text"
        />
      ),
      size: 120,
      mantineTableBodyCellProps: {
        align: "right",
      },
    },

    {
      header: "Brand",
      accessorFn: (row) => row.item_brand,
      size: "100px",
      grow: 4,
      mantineTableBodyCellProps: {
        align: "left",
      },
    },
    {
      header: "Category",
      accessorFn: (row) => row.item_cat,
      size: "100px",
      grow: 4,
      mantineTableBodyCellProps: {
        align: "left",
      },
    },
    {
      header: "Inactive",
      accessorKey: "item_inactive",
      mantineTableBodyCellProps: {
        align: "center",
      },
      Cell: ({ cell }) => (
        <Box>
          <Checkbox isChecked={cell.getValue()} />
        </Box>
      ),
    },
  ];

  const handleRowDoubleClick = (row) => {
    const { original } = row;
    setSearchItem((prev) => (prev = original));
    update_Item(original);
    onItemSearchClose();
  };

  const handleSelectRow = (row) => {
    const { original } = row;
    setSearchItem((prev) => (prev = original));
    update_Item(original);
    onItemSearchClose();
  };

  return (
    <Flex>
      <Box width="100%" borderWidth={1} borderColor="teal.800" overflow="auto">
        <CustomReactTable
          title={titles}
          columns={columns}
          data={items}
          disableExportStatus={true}
          disableRowActionStatus={true}
          disableAddStatus={true}
          initialState={{ sorting: [{ id: "desp", desc: false }] }}
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

export default ItemSearchTable;
