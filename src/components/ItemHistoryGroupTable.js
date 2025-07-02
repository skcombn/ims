import { useEffect, useMemo } from 'react';
import { NumericFormat } from 'react-number-format';

import { Box, Flex } from '@chakra-ui/react';

import CustomReactTable from '../helpers/CustomReactTable';
import { useItemsHistoryGroupByItemno } from '../react-query/itemshistory/useItemsHistoryGroupByItemno';

const ItemHistoryGroupTable = ({ itemno }) => {
  console.log('item history', itemno);

  const { itemshistorygroup, setHistGrpItemno } =
    useItemsHistoryGroupByItemno();

  const title = 'Items';

  const columns = useMemo(
    () => [
      {
        header: 'Year',
        accessorFn: row => row.txn_year,
        size: 100,
        mantineTableBodyCellProps: {
          align: 'left',
        },
      },
      {
        id: 'Month',
        header: 'Month',
        accessorFn: row => row.txn_month,
        size: 200,
        mantineTableBodyCellProps: {
          align: 'left',
        },
      },
      {
        header: 'IN Qty',
        accessorFn: row => row.mtdqty,
        Cell: ({ row }) => (
          <NumericFormat
            value={row.original.mtdqty}
            decimalScale={3}
            fixedDecimalScale
            displayType="text"
          />
        ),
        //size: 200,
        mantineTableBodyCellProps: {
          align: 'left',
        },
      },
      {
        header: 'IN Amount',
        accessorFn: row => row.mtdamt,
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
        header: 'OUT Qty',
        accessorFn: row => row.mthqty,
        Cell: ({ row }) => (
          <NumericFormat
            value={row.original.mthqty}
            decimalScale={3}
            fixedDecimalScale
            displayType="text"
          />
        ),
        //size: 200,
        mantineTableBodyCellProps: {
          align: 'left',
        },
      },
      {
        header: 'OUT Amount',
        accessorFn: row => row.mtdamt,
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
    ],
    []
  );

  useEffect(() => {
    setHistGrpItemno(itemno);
  }, [itemno]);

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
          data={itemshistorygroup}
          disableAddStatus={true}
          disableEditStatus={true}
          initialState={{ sorting: [{ id: 'desp', desc: false }] }}
        />
      </Box>
    </Flex>
  );
};

export default ItemHistoryGroupTable;
