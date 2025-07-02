import { useState, useMemo } from 'react';
import { Box, Flex, Heading, useDisclosure } from '@chakra-ui/react';
import { Modal } from '@mantine/core';
import { NumericFormat } from 'react-number-format';
import { useRecoilState } from 'recoil';
import { itemState } from '../data/atomdata';
import { AlertDialogBox } from '../helpers/AlertDialogBox';
import { useItems } from '../react-query/items/useItems';
import { useAddItem } from '../react-query/items/useAddItem';
import { useUpdateItem } from '../react-query/items/useUpdateItem';
import { useDeleteItem } from '../react-query/items/useDeleteItem';
import CustomReactTable from '../helpers/CustomReactTable';
import ItemForm from './ItemForm';

const ItemsMinLvlTable = () => {
  const { items } = useItems();
  const addItem = useAddItem();
  const updateItem = useUpdateItem();
  const deleteItem = useDeleteItem();
  const [state, setState] = useRecoilState(itemState);
  const [statustype, setStatusType] = useState('');

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

  const title = 'Items below minimum level';

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
        //size: 200,
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
        header: 'Qty Onhand',
        accessorFn: row => row.item_qtyonhand,
        Cell: ({ row, cell }) => (
          <NumericFormat
            value={row.original.item_qtyonhand}
            decimalScale={3}
            fixedDecimalScale
            displayType="text"
            thousandSeparator=","
          />
        ),
        size: 100,
        mantineTableBodyCellProps: {
          align: 'right',
          sx: {
            color: 'red',
          },
        },
      },
      {
        header: 'Min Level',
        accessorFn: row => row.item_minlvl,
        Cell: ({ row }) => (
          <NumericFormat
            value={row.original.item_minlvl}
            decimalScale={3}
            fixedDecimalScale
            displayType="text"
          />
        ),
        size: 100,
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
        header: 'Supplier',
        accessorFn: row => row.item_supplier,
        //size: 100,
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

  const add_Item = data => {
    //console.log('add', data);
    addItem(data);
  };

  const update_Item = data => {
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
          data={items.filter(r => {
            const qty = r.item_qtyonhand;
            if (qty < r.item_minlvl) {
              return true;
            } else {
              return false;
            }
          })}
          disableAddStatus={true}
          disableEditStatus={true}
          initialState={{ sorting: [{ id: 'desp', desc: false }] }}
        />
      </Box>
      <Modal opened={isItemOpen} onClose={onItemClose} size="2x1">
        <ItemForm
          state={state}
          setState={setState}
          add_Item={add_Item}
          update_Item={update_Item}
          statustype={statustype}
          onItemClose={onItemClose}
        />
      </Modal>
      <AlertDialogBox
        onClose={onAlertDeleteClose}
        onConfirm={handleOnDeleteConfirm}
        isOpen={isAlertDeleteOpen}
        title="Delete Item"
      >
        <Heading size="md">
          Are you sure you want to delete this item {state.item_no}
          {state.item_desp}
          {state.ic_desp} ?
        </Heading>
      </AlertDialogBox>
    </Flex>
  );
};

export default ItemsMinLvlTable;
