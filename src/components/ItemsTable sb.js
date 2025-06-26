import React, { useState, useMemo } from 'react';
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
} from '@chakra-ui/react';
import { NumericFormat } from 'react-number-format';
//import { Box } from '@mantine/core';
import { useRecoilState } from 'recoil';
import { itemState } from '../data/atomdata';
import { DeleteIcon, EditIcon } from '@chakra-ui/icons';
import { AlertDialogBox } from '../helpers/AlertDialogBox';
import CustomDataTable from '../helpers/CustomDataTable';
import { useItems } from '../react-query/items/useItems';
import { useAddItem } from '../react-query/items/useAddItem';
import { useUpdateItem } from '../react-query/items/useUpdateItem';
import { useDeleteItem } from '../react-query/items/useDeleteItem';
import CustomReactTable from '../helpers/CustomReactTable';
import ItemForm from './ItemForm';

const initial_item = [
  {
    item_no: '',
    item_desp: '',
    item_group: '',
    item_pack: '',
    item_unit: '',
    item_pfactor: 1,
    item_suppno: '',
    item_supp: '',
    item_minM: 0,
    item_qtyhand: 0,
    item_remark: '',
    item_cat: '',
    item_date: null,
    item_brand: '',
    item_dept: '',
    item_wsp: 0,
    item_qq: 0,
    item_rsp: 0,
    item_cif: 0,
    item_duty: 0,
    item_fob: 0,
    item_bal: 0,
    item_comm: 0,
    item_storea: 0,
    item_storeb: 0,
    item_storef: 0,
    item_lsqty: 0,
    item_lsprice: 0,
    item_lsdate: null,
    item_lpqty: 0,
    item_lpcost: 0,
    item_lpdate: null,
    item_extcost: 0,
    item_fc: 0,
    item_inf: 0,
    item_bc: 0,
    item_tf: 0,
    item_lc: 0,
    item_cnf: 0,
    item_tinqty: 0,
    item_tinamt: 0,
    item_toutqty: 0,
    item_toutamt: 0,
    item_phyqty: 0,
    item_phydate: null,
    item_phystor: '',
    item_mtdsamt: 0,
    item_mtdsqty: 0,
    item_mtdpamt: 0,
    item_mpqty: 0,
    item_lock: false,
    item_nonstock: false,
  },
];

const ItemsTable = () => {
  const { items } = useItems();
  const addItem = useAddItem();
  const updateItem = useUpdateItem();
  const deleteItem = useDeleteItem();
  const [state, setState] = useRecoilState(itemState);
  const [statustype, setStatusType] = useState('');
  const [filterText, setFilterText] = React.useState('');

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

  const title = 'Items';

  const columns = useMemo(
    () => [
      {
        header: 'Item No',
        accessorFn: row => row.item_no,
        size: 100,
        mantineTableBodyCellProps: {
          align: 'left',
        },
      },
      {
        id: 'desp',
        header: 'Description',
        accessorFn: row => row.item_desp,
        size: 200,
        mantineTableBodyCellProps: {
          align: 'left',
        },
      },
      {
        header: 'Packing',
        accessorFn: row => row.item_pack,
        //size: 200,
        mantineTableBodyCellProps: {
          align: 'left',
        },
      },
      {
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
      },
      {
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
      },
      {
        header: 'Qty',
        accessorFn: row => row.item_qtyhand,
        Cell: ({ row }) => (
          <NumericFormat
            value={row.original.item_qtyhand}
            decimalScale={3}
            fixedDecimalScale
            displayType="text"
          />
        ),
        size: 120,
        mantineTableBodyCellProps: {
          align: 'right',
        },
      },

      {
        header: 'Unit',
        accessorFn: row => row.item_unit,
        size: 100,
        mantineTableBodyCellProps: {
          align: 'left',
        },
      },
      {
        header: 'Ext. Cost',
        accessorFn: row => row.item_cif * row.item_qtyhand,
        size: 150,
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
        header: 'Brand',
        accessorFn: row => row.item_brand,
        size: 100,
        mantineTableBodyCellProps: {
          align: 'left',
        },
      },
      {
        header: 'Category',
        accessorFn: row => row.item_cat,
        //size: 200,
        mantineTableBodyCellProps: {
          align: 'left',
        },
      },
    ],
    []
  );

  const handleOnDeleteConfirm = () => {
    deleteItem(state);
  };

  const handleAddItem = () => {
    setStatusType(prev => (prev = 'add'));
    const data = { ...initial_item };
    setState(data);
    onItemOpen(true);
  };

  const handleEditItem = row => {
    const { original } = row;
    setStatusType(prev => (prev = 'edit'));
    setState(original);
    onItemOpen(true);
  };

  const handleDeleteItem = row => {
    const { original } = row;
    setState(prev => (prev = { ...original }));
    onAlertDeleteOpen();
  };

  const add_Item = data => {
    const itemdata = {
      ...initial_item,
      item_no: data.item_no,
      item_group: data.item_group,
      item_desp: data.item_desp,
      item_packing: data.item_packing,
      item_category: data.item_category,
      item_unit: data.item_unit,
      item_brand: data.item_brand,
      item_dept: data.item_dept,
      item_smcode: data.item_smcode,
      item_package: data.item_package,
      item_warehouse: data.item_warehouse,
      item_type: data.item_type,
      item_nonstock: data.item_nonstock,
      item_location: data.item_location,
      item_prtreptlabel: data.item_prtreptlabel,
      item_lock: data.item_lock,
      item_inactive: data.item_inactive,
    };

    addItem(itemdata);
  };

  const update_Item = data => {
    /* const itemdata = {
      ...initial_item,
      item_no: data.item_no,
      item_group: data.item_group,
      item_desp: data.item_desp,
      item_packing: data.item_packing,
      item_category: data.item_category,
      item_unit: data.item_unit,
      item_brand: data.item_brand,
      item_dept: data.item_dept,
      item_smcode: data.item_smcode,
      item_package: data.item_package,
      item_warehouse: data.item_warehouse,
      item_type: data.item_type,
      item_nonstock: data.item_nonstock,
      item_location: data.item_location,
      item_prtreptlabel: data.item_prtreptlabel,
      item_lock: data.item_lock,
      item_inactive: data.item_inactive,
    }; */

    updateItem(data);
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
          title={title}
          columns={columns}
          data={items}
          handleAdd={handleAddItem}
          handleEdit={handleEditItem}
          handleDelete={handleDeleteItem}
          initialState={{ sorting: [{ id: 'desp', desc: false }] }}
        />
      </Box>
      <Modal
        closeOnOverlayClick={false}
        isOpen={isItemOpen}
        onClose={onItemClose}
        size="4xl"
      >
        <ModalOverlay />
        <ModalContent>
          {/* <ModalHeader>Product Form</ModalHeader> */}
          <ModalCloseButton />
          <ModalBody>
            <ItemForm
              state={state}
              setState={setState}
              add_Item={add_Item}
              update_Item={update_Item}
              statustype={statustype}
              onItemClose={onItemClose}
            />
          </ModalBody>

          {/* <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onProductClose}>
              Close
              </Button>
          </ModalFooter> */}
        </ModalContent>
      </Modal>
      <AlertDialogBox
        onClose={onAlertDeleteClose}
        onConfirm={handleOnDeleteConfirm}
        isOpen={isAlertDeleteOpen}
        title="Delete Item"
      >
        <Heading size="md">
          Are you sure you want to delete this item {state.item_no}
          {''} {state.item_desp}
          {state.ic_desp} ?
        </Heading>
      </AlertDialogBox>
    </Flex>
  );
};

export default ItemsTable;
