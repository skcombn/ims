import { Box, Checkbox, Flex } from '@chakra-ui/react';
import { NumericFormat } from 'react-number-format';
import { useRecoilState } from 'recoil';
import { searchitemState } from '../data/atomdata';
import { useItems } from '../react-query/items/useItems';
import CustomReactTable from '../helpers/CustomReactTable';

const ItemSearchTable = ({ update_Item, onItemSearchClose }) => {
  const { items } = useItems();
  const [searchitem, setSearchItem] = useRecoilState(searchitemState);
  const titles = 'Items Search Table';

  const columns = [
    {
      header: 'Item No',
      accessorFn: row => row.item_no,
      size: 80,
      mantineTableBodyCellProps: ({ cell }) => ({
        sx: {
          color: cell.getValue('item_inactive') === true ? 'red' : 'black',
          fontWeight: 'bold',
        },
      }),
    },
    {
      id: 'desp',
      header: 'Desciption',
      accessorFn: row => row.item_desp,
      size: '200',
      mantineTableBodyCellProps: {
        align: 'left',
      },
    },
    {
      header: 'Packing',
      accessorFn: row => row.item_pack,
      size: '100',
      mantineTableBodyCellProps: {
        align: 'left',
      },
    },

    {
      header: 'UPrice',
      accessorFn: row => row.item_price,
      size: '100px',
      //align: 'left',
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
      header: 'Unit',
      accessorFn: row => row.item_unit,
      size: '100',
      mantineTableBodyCellProps: {
        align: 'left',
      },
    },
    {
      header: 'Qty Onhand',
      accessorFn: row => row.item_qtyonhand,
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
        align: 'right',
      },
    },

    {
      header: 'Brand',
      accessorFn: row => row.item_brand,
      size: '100px',
      grow: 4,
      mantineTableBodyCellProps: {
        align: 'left',
      },
    },
    {
      header: 'Category',
      accessorFn: row => row.item_cat,
      size: '100px',
      grow: 4,
      mantineTableBodyCellProps: {
        align: 'left',
      },
    },
    {
      header: 'Inactive',
      accessorKey: 'item_inactive',
      mantineTableBodyCellProps: {
        align: 'center',
      },
      Cell: ({ cell }) => (
        <Box>
          <Checkbox isChecked={cell.getValue()} />
        </Box>
      ),
    },
  ];

  const handleRowDoubleClick = row => {
    const { original } = row;
    setSearchItem(prev => (prev = original));
    update_Item(original);
    onItemSearchClose();
  };

  const handleSelectRow = row => {
    const { original } = row;
    setSearchItem(prev => (prev = original));
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
          initialState={{ sorting: [{ id: 'desp', desc: false }] }}
          handleSelect={handleSelectRow}
          handleRowDoubleClick={handleRowDoubleClick}
        />
      </Box>
    </Flex>
  );
};

export default ItemSearchTable;
