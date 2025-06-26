import React, { useState, useEffect, useMemo } from 'react';

import {
  Box,
  Flex,
  Heading,
  IconButton,
  useDisclosure,
} from '@chakra-ui/react';
import { Modal } from '@mantine/core';
import { AlertDialogBox } from '../helpers/AlertDialogBox';
import { useGroups } from '../react-query/groups/useGroups';
import { useAddGroup } from '../react-query/groups/useAddGroup';
import { useUpdateGroup } from '../react-query/groups/useUpdateGroup';
import { useDeleteGroup } from '../react-query/groups/useDeleteGroup';
import CustomReactTable from '../helpers/CustomReactTable';
import GroupForm from './GroupForm';

const initial_group = {
  group_desp: '',
  group_category: '',
};

const initial_selection = [{ name: 'ALL', field: 'all' }];

const GroupsTable = () => {
  const { groups, setGroupId } = useGroups();
  const addGroup = useAddGroup();
  const updateGroup = useUpdateGroup();
  const deleteGroup = useDeleteGroup();
  const [state, setState] = useState({});
  const [statustype, setStatusType] = useState('');

  const {
    isOpen: isAlertDeleteOpen,
    onOpen: onAlertDeleteOpen,
    onClose: onAlertDeleteClose,
  } = useDisclosure();

  const {
    isOpen: isGroupOpen,
    onOpen: onGroupOpen,
    onClose: onGroupClose,
  } = useDisclosure();

  const title = 'Groups';

  const columns = useMemo(
    () => [
      {
        header: 'Description',
        accessorFn: row => row.group_desp,
        size: 120,
        mantineTableBodyCellProps: {
          align: 'left',
        },
      },
      {
        header: 'Category',
        accessorFn: row => row.group_category,
        size: 120,
        mantineTableBodyCellProps: {
          align: 'left',
        },
      },
    ],
    []
  );

  const handleOnDeleteConfirm = () => {
    deleteGroup(state);
  };

  const handleAddGroup = () => {
    setStatusType(prev => (prev = 'add'));
    const data = { ...initial_group };
    setState(data);
    onGroupOpen();
  };

  const handleEditGroup = row => {
    const { original } = row;
    setStatusType(prev => (prev = 'edit'));
    setState(prev => original);
    onGroupOpen();
  };

  const handleDeleteGroup = row => {
    const { original } = row;
    setState(prev => original);
    onAlertDeleteOpen();
  };

  const add_Group = data => {
    addGroup(data);
  };

  const update_Group = data => {
    updateGroup(data);
    onGroupClose();
  };

  /* useEffect(() => {
    build_selection();
  }, [groups]); */

  return (
    <Flex p={5}>
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
          handleAdd={handleAddGroup}
          handleEdit={handleEditGroup}
          handleDelete={handleDeleteGroup}
          disableAddStatus={true}
        />
      </Box>
      <Modal opened={isGroupOpen} onClose={onGroupClose} size="lg">
        <GroupForm
          state={state}
          setState={setState}
          add_Group={add_Group}
          update_Group={update_Group}
          statustype={statustype}
          onGroupClose={onGroupClose}
          grouptype={state.group_category}
        />
      </Modal>
      <AlertDialogBox
        onClose={onAlertDeleteClose}
        onConfirm={handleOnDeleteConfirm}
        isOpen={isAlertDeleteOpen}
        title="Delete Group"
      >
        <Heading size="md">
          Are you sure you want to delete {state.group_desp} ?
        </Heading>
      </AlertDialogBox>
    </Flex>
  );
};

export default GroupsTable;
