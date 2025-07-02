import { useMemo } from 'react';
import { Box, Flex } from '@chakra-ui/react';

import CustomReactTable from '../helpers/CustomReactTable';

const TransAdjustDetlsTable = ({
  batchdetlsstate,
  handleAddBatchDetls,
  handleDeleteBatchDetls,
  handleEditBatchDetls,
}) => {
  const title = 'Adjustment Details';

  const columns = useMemo(
    () => [
      {
        header: 'Item No',
        accessorKey: 'tad_itemno',
        //size: 200,
        mantineTableBodyCellProps: {
          align: 'left',
        },
      },
      {
        header: 'Description',
        accessorFn: row => row.tad_desp,
        //size: 200,
        mantineTableBodyCellProps: {
          align: 'left',
        },
      },
      {
        header: 'Packing',
        accessorFn: row => row.tad_packing,
        //size: 200,
        mantineTableBodyCellProps: {
          align: 'left',
        },
      },
      {
        header: 'Qty Onhand',
        accessorFn: row => row.tad_qtyonhand || 0,
        //size: 200,

        mantineTableBodyCellProps: {
          align: 'right',
        },
      },
      {
        header: 'Qty Count',
        accessorFn: row => row.tad_qtycount || 0,
        //size: 200,

        mantineTableBodyCellProps: {
          align: 'right',
        },
      },
      {
        header: 'Qty Adjust',
        accessorFn: row => row.tad_qtyadjust || 0,
        //size: 200,

        mantineTableBodyCellProps: {
          align: 'right',
        },
      },
      {
        header: 'Unit',
        accessorFn: row => row.tad_unit || '',
        //size: 200,
        mantineTableBodyCellProps: {
          align: 'left',
        },
      },

      {
        header: 'Remark',
        accessorFn: row => row.tad_remark,
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
          initialState={{ sorting: [{ id: 'tad_itemno', desc: false }] }}
          handleAdd={handleAddBatchDetls}
          handleEdit={handleEditBatchDetls}
          handleDelete={handleDeleteBatchDetls}
          disableExportStatus={true}
        />
      </Box>
    </Flex>
  );
};

export default TransAdjustDetlsTable;
