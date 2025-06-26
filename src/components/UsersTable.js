import React, { useState, useMemo } from 'react';

import {
  Box,
  Flex,
  Heading,
  IconButton,
  useDisclosure,
} from '@chakra-ui/react';
import { Modal } from '@mantine/core';
import { AlertDialogBox } from '../helpers/AlertDialogBox';
import { useUsers } from '../react-query/users/useUsers';
import { useAddUser } from '../react-query/users/useAddUser';
import { useUpdateUser } from '../react-query/users/useUpdateUser';
import { useDeleteUser } from '../react-query/users/useDeleteUser';
import CustomReactTable from '../helpers/CustomReactTable';
import UserForm from './UserForm';

const initial_state = {
  u_userid: '',
  u_name: '   ',
  u_email: '',
  u_password: '',
  u_usergroup: '',
  u_level: '',
  u_jobtitle: '',
  u_lastlogindate: null,
};

const UsersTable = () => {
  const { users } = useUsers();
  const addUser = useAddUser();
  const updateUser = useUpdateUser();
  const deleteUser = useDeleteUser();
  const [state, setState] = useState({});
  const [statustype, setStatusType] = useState('');

  const {
    isOpen: isAlertDeleteOpen,
    onOpen: onAlertDeleteOpen,
    onClose: onAlertDeleteClose,
  } = useDisclosure();

  const {
    isOpen: isFormOpen,
    onOpen: onFormOpen,
    onClose: onFormClose,
  } = useDisclosure();

  const title = 'Users';

  const columns = useMemo(
    () => [
      {
        header: 'User Id',
        accessorFn: row => row.u_userid,
        //size: 200,
        mantineTableBodyCellProps: {
          align: 'left',
        },
      },
      {
        header: 'User Name',
        accessorFn: row => row.u_name,
        size: 200,
        mantineTableBodyCellProps: {
          align: 'left',
        },
        cell: row => (
          <div style={{ overflow: 'hidden', textAlign: 'left' }}>
            {row.u_name}
          </div>
        ),
      },
      {
        header: 'Email',
        accessorFn: row => row.u_email,
        //size: 200,
        mantineTableBodyCellProps: {
          align: 'left',
        },
      },
      {
        header: 'Job Title',
        accessorFn: row => row.u_jobtitle,
        //size: 200,
        mantineTableBodyCellProps: {
          align: 'left',
        },
      },
      {
        header: 'Group',
        accessorFn: row => row.u_usergroup,
        //size: 200,
        mantineTableBodyCellProps: {
          align: 'left',
        },
      },
      {
        header: 'Level',
        accessorFn: row => row.u_level,
        //size: 200,
        mantineTableBodyCellProps: {
          align: 'left',
        },
      },
    ],
    []
  );

  const handleOnDeleteConfirm = () => {
    deleteUser(state);
  };

  const handleAddUser = () => {
    setStatusType(prev => (prev = 'add'));
    const data = { ...initial_state };
    setState(data);
    onFormOpen(true);
  };

  const handleEditUser = row => {
    const { original } = row;
    setStatusType(prev => (prev = 'edit'));
    setState(prev => original);
    onFormOpen(true);
  };

  const handleDeleteUser = row => {
    const { original } = row;
    setState(prev => original);
    onAlertDeleteOpen();
  };

  const add_User = data => {
    addUser(data);
  };

  const update_User = data => {
    updateUser(data);
  };

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
          data={users}
          handleAdd={handleAddUser}
          handleEdit={handleEditUser}
          handleDelete={handleDeleteUser}
        />
      </Box>
      <Modal opened={isFormOpen} onClose={onFormClose} size="xl">
        <UserForm
          state={state}
          setState={setState}
          add_User={add_User}
          update_User={update_User}
          statustype={statustype}
          onFormClose={onFormClose}
        />
      </Modal>
      <AlertDialogBox
        onClose={onAlertDeleteClose}
        onConfirm={handleOnDeleteConfirm}
        isOpen={isAlertDeleteOpen}
        title="Delete Manufacturer"
      >
        u_
        <Heading size="md">
          Are you sure you want to delete this User {state.u_userid}{' '}
          {state.u_name} ?
        </Heading>
      </AlertDialogBox>
    </Flex>
  );
};

export default UsersTable;
