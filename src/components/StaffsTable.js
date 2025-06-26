import React, { useState, useEffect, useMemo } from "react";

import {
  Box,
  Flex,
  Heading,
  IconButton,
  useDisclosure,
} from "@chakra-ui/react";
import { Modal } from "@mantine/core";
import { AlertDialogBox } from "../helpers/AlertDialogBox";
import { useStaffs } from "../react-query/staffs/useStaffs";
import { useAddStaff } from "../react-query/staffs/useAddStaff";
import { useUpdateStaff } from "../react-query/staffs/useUpdateStaff";
import { useDeleteStaff } from "../react-query/staffs/useDeleteStaff";
import CustomReactTable from "../helpers/CustomReactTable";
import StaffForm from "./StaffForm";

const initial_staff = {
  s_code: "",
  s_name: "",
  s_designation: "",
  s_comms: 0,
  s_area: "",
};

const initial_selection = [{ name: "ALL", field: "all" }];

const StaffsTable = () => {
  const { staffs, setStaffId } = useStaffs();
  const addStaff = useAddStaff();
  const updateStaff = useUpdateStaff();
  const deleteStaff = useDeleteStaff();
  const [state, setState] = useState({});
  const [statustype, setStatusType] = useState("");

  const {
    isOpen: isAlertDeleteOpen,
    onOpen: onAlertDeleteOpen,
    onClose: onAlertDeleteClose,
  } = useDisclosure();

  const {
    isOpen: isStaffOpen,
    onOpen: onStaffOpen,
    onClose: onStaffClose,
  } = useDisclosure();

  const title = "Staffs";

  const columns = useMemo(
    () => [
      {
        header: "Code",
        accessorKey: "s_code",
        size: 120,
        mantineTableBodyCellProps: {
          align: "left",
        },
      },
      {
        header: "Name",
        accessorKey: "s_name",
        size: 120,
        mantineTableBodyCellProps: {
          align: "left",
        },
      },
      {
        header: "Designation",
        accessorKey: "s_designation",
        size: 120,
        mantineTableBodyCellProps: {
          align: "left",
        },
      },
      {
        header: "Commission",
        accessorKey: "s_comms",
        size: 120,
        mantineTableBodyCellProps: {
          align: "left",
        },
      },
      {
        header: "Area",
        accessorKey: "s_area",
        size: 120,
        mantineTableBodyCellProps: {
          align: "left",
        },
      },
    ],
    []
  );

  const handleOnDeleteConfirm = () => {
    //console.log('del group', state);
    deleteStaff(state);
  };

  const handleAddStaff = () => {
    setStatusType((prev) => (prev = "add"));
    const data = { ...initial_staff };
    setState(data);
    onStaffOpen();
  };

  const handleEditStaff = (row) => {
    const { original } = row;
    setStatusType((prev) => (prev = "edit"));
    setState((prev) => original);
    onStaffOpen();
  };

  const handleDeleteStaff = (row) => {
    const { original } = row;
    setState((prev) => original);
    onAlertDeleteOpen();
  };

  const add_Staff = (data) => {
    addStaff(data);
  };

  const update_Staff = (data) => {
    const { id, s_id, ...fields } = data;
    updateStaff({ id, ...fields });
    onStaffClose();
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
          data={staffs}
          handleAdd={handleAddStaff}
          handleEdit={handleEditStaff}
          handleDelete={handleDeleteStaff}
        />
      </Box>
      <Modal opened={isStaffOpen} onClose={onStaffClose} size="lg">
        <StaffForm
          state={state}
          setState={setState}
          add_Staff={add_Staff}
          update_Staff={update_Staff}
          statustype={statustype}
          onStaffClose={onStaffClose}
        />
      </Modal>
      <AlertDialogBox
        onClose={onAlertDeleteClose}
        onConfirm={handleOnDeleteConfirm}
        isOpen={isAlertDeleteOpen}
        title="Delete Staff"
      >
        <Heading size="md">
          Are you sure you want to delete this staff {state.s_name} ?
        </Heading>
      </AlertDialogBox>
    </Flex>
  );
};

export default StaffsTable;
