import { useState, useMemo } from 'react';
import { Box, Flex, IconButton, useDisclosure } from '@chakra-ui/react';
import { EditIcon, DeleteIcon } from '@chakra-ui/icons';
import CustomReactTable from '../helpers/CustomReactTable';
import { useRecoilState } from 'recoil';
import {
  editTranIdState,
  editTranDetlsIdState,
  editTranLotsIdState,
} from '../data/atomdata';

const TranSalesDetlsTable = ({
  batchdetlsstate,
  batchlotsstate,
  handleAddBatchDetls,
  handleDeleteBatchDetls,
  handleEditBatchDetls,
}) => {
  const title = 'Items Details';

  const columns = useMemo(
    () => [
      {
        header: 'Item No',
        accessorFn: row => row.tl_itemno,
        //size: 200,
        mantineTableBodyCellProps: {
          align: 'left',
        },
      },
      {
        header: 'Description',
        accessorFn: row => row.tl_desp,
        //size: 200,
        mantineTableBodyCellProps: {
          align: 'left',
        },
      },
      {
        header: 'Qty',
        accessorFn: row => row.tl_qty || 0,
        //size: 200,

        mantineTableBodyCellProps: {
          align: 'right',
        },
      },
      {
        header: 'Unit',
        accessorFn: row => row.tl_unit || '',
        //size: 200,
        mantineTableBodyCellProps: {
          align: 'left',
        },
      },
      {
        header: 'Unit Value',
        accessorFn: row => row.tl_uprice || 0,
        //size: 200,
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
        header: 'Amount',
        accessorFn: row => row.tl_amount || 0,
        //size: 200,
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
        header: 'Remark',
        accessorFn: row => row.tl_remark,
        //size: 200,
        mantineTableBodyCellProps: {
          align: 'left',
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
        borderRadius={10}
        overflow="auto"
      >
        <CustomReactTable
          title={title}
          columns={columns}
          data={batchdetlsstate}
          handleAdd={handleAddBatchDetls}
          handleEdit={handleEditBatchDetls}
          handleDelete={handleDeleteBatchDetls}
          disableExportStatus={true}
        />
      </Box>
    </Flex>
  );
};

export default TranSalesDetlsTable;
