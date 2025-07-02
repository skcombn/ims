import { Box, VStack } from '@chakra-ui/react';
import CustomReactTable from '../helpers/CustomReactTable';

const ItemHistLotTable = ({ itemno, itemhistlot }) => {
  const titles = 'Items Expiry Lot Transactions';

  const columns = [
    {
      header: 'PO No',
      accessorKey: 'ie_pono',
    },
    {
      header: 'Expiry Date',
      accessorKey: 'ie_dateexpiry',
    },
    {
      header: 'Qty Received',
      accessorKey: 'ie_qtyreceived',
      mantineTableBodyCellProps: {
        align: 'right',
      },
    },
    {
      header: 'Qty Onhand',
      accessorKey: 'ie_qtyonhand',
      mantineTableBodyCellProps: {
        align: 'right',
      },
    },
    {
      header: 'Location',
      accessorKey: 'ie_location',
    },
  ];

  return (
    <Box>
      <VStack
        w={{ base: 'auto', md: 'full' }}
        h={{ base: 'auto', md: 'full' }}
        p="2"
        spacing="10"
        //align="left"
        alignItems="flex-start"
      >
        <CustomReactTable
          title={titles}
          columns={columns}
          data={itemhistlot ? itemhistlot : {}}
          initialState={{
            sorting: [{ id: 'ie_dateexpiry', desc: false }],
          }}
          disableRowActionStatus={true}
          disableExportStatus={true}
          disableAddStatus={true}
          disableEditStatus={true}
        />
      </VStack>
    </Box>
  );
};

export default ItemHistLotTable;
