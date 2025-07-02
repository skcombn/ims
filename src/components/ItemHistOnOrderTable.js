import { useMemo } from 'react';
import dayjs from 'dayjs';
import { Box, Flex } from '@chakra-ui/react';
import { NumericFormat } from 'react-number-format';

import CustomReactTable from '../helpers/CustomReactTable';

const ItemHistOnOrderTable = ({ itemsonorder }) => {
  const totqtyonorder = itemsonorder.reduce((acc, item) => {
    return acc + item.tl_qty;
  }, 0);

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
