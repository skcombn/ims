import React, { useMemo } from 'react';

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
import CustomDataTable from './CustomDataTable';
import { useRecoilState } from 'recoil';
import { searchitemState } from '../data/atomdata';
import { useGroups } from '../react-query/groups/useGroups';
import CustomReactTable from '../helpers/CustomReactTable';

const initial_group = {
  group_desp: '',
  group_category: '',
};

const GroupSearchTable = ({ update_Item, onSearchClose }) => {
  const { groups, setGroupId } = useGroups();
  const [filterText, setFilterText] = React.useState('');
  const [searchitem, setSearchItem] = useRecoilState(searchitemState);
  const title = 'Group Search';

  const filteredData = groups.filter(
    item =>
      item.group_desp &&
      item.group_desp.toLowerCase().includes(filterText.toLowerCase())
  );

  const columns = useMemo(
    () => [
      {
        header: 'Description',
        accessorFn: row => row.group_desp,
        //size: 120,
        mantineTableBodyCellProps: {
          align: 'left',
        },
      },
      {
        header: 'Category',
        accessorFn: row => row.group_category,
        //size: 120,
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
    onSearchClose();
  };

  const handleSelectRow = row => {
    const { original } = row;
    setSearchItem(prev => (prev = original));
    update_Item(original);
    onSearchClose();
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
          data={groups}
          disableExportStatus={true}
          disableRowActionStatus={true}
          disableAddStatus={true}
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
export default GroupSearchTable;
