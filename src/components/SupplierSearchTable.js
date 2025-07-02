import { useMemo } from 'react';

import { Box, Flex } from '@chakra-ui/react';
import { useRecoilState } from 'recoil';
import { searchitemState } from '../data/atomdata';
import { useSuppliers } from '../react-query/suppliers/useSuppliers';
import CustomReactTable from '../helpers/CustomReactTable';

const SupplierSearchTable = ({ update_Item, onSupplierSearchClose }) => {
  const { suppliers } = useSuppliers();
  const [searchitem, setSearchItem] = useRecoilState(searchitemState);
  const title = 'Supplier Search';

  const columns = useMemo(
    () => [
      {
        header: 'Supp No',
        accessorFn: row => row.s_suppno,
        size: 120,
        mantineTableBodyCellProps: {
          align: 'left',
        },
      },
      {
        header: 'Supplier',
        accessorFn: row => row.s_supp,
        size: 200,
        mantineTableBodyCellProps: {
          align: 'left',
        },
      },
      {
        header: 'Phone',
        accessorFn: row => row.s_phone,
        size: 200,
        mantineTableBodyCellProps: {
          align: 'left',
        },
      },
      {
        header: 'Email',
        accessorFn: row => row.s_email,
        size: 200,
        mantineTableBodyCellProps: {
          align: 'left',
        },
      },
      {
        header: 'Fax',
        accessorFn: row => row.s_fax,
        size: 200,
        mantineTableBodyCellProps: {
          align: 'left',
        },
      },
      {
        header: 'Contact',
        accessorFn: row => row.s_contact,
        size: 200,
        mantineTableBodyCellProps: {
          align: 'left',
        },
      },
    ],
    []
  );

  const handleRowDoubleClick = row => {
    const { original } = row;

    setSearchItem(prev => (prev = original));
    update_Item(original);
    onSupplierSearchClose();
  };

  const handleSelectRow = row => {
    const { original } = row;
    console.log('click', original);
    setSearchItem(prev => (prev = original));
    update_Item(original);
    onSupplierSearchClose();
  };

  return (
    <Flex>
      <Box
        width="100%"
        borderWidth={1}
        borderColor="teal.800"
        borderRadius={10}
        overflow="scroll"
      >
        <CustomReactTable
          title={title}
          columns={columns}
          data={suppliers}
          disableExportStatus={true}
          disableRowActionStatus={true}
          disableAddStatus={true}
          handleSelect={handleSelectRow}
          handleRowDoubleClick={handleRowDoubleClick}
        />
      </Box>
    </Flex>
  );
};

export default SupplierSearchTable;
