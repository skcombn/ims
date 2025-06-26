import React, { useEffect, useMemo } from "react";
import { Box, IconButton } from "@chakra-ui/react";
import { MantineReactTable, useMantineReactTable } from "mantine-react-table";
import { ActionIcon, Button, Flex, Text, Tooltip } from "@mantine/core";
import { ModalsProvider, modals } from "@mantine/modals";
import {
  IconEdit,
  IconTrash,
  IconSquareRoundedPlus,
  IconPlus,
} from "@tabler/icons-react";

const CustomReactCRUDTable = ({
  title,
  columns,
  data,
  initialState,
  handleEdit,
  handleAdd,
  handleDelete,
}) => {
  //CREATE action
  const handleCreateItem = ({ values, exitCreatingMode }) => {
    //console.log("create", values);
    handleAdd({ ...values });
    exitCreatingMode();
  };

  //UPDATE action
  const handleSaveItem = ({ values, table, row }) => {
    const { original } = row;
    handleEdit({ ...values, id: original.id });
    table.setEditingRow(null); //exit editing mode
  };

  //DELETE action
  const openDeleteConfirmModal = (row) =>
    modals.openConfirmModal({
      title: (
        <Text fw={700} fz="lg" c="teal" inherit>
          Delete Record
        </Text>
      ),
      children: (
        <Text>
          Are you sure you want to delete{" "}
          <Text fw={400} c="teal" span inherit>
            {row.original.name}
          </Text>
          ? This action cannot be undone.
        </Text>
      ),
      labels: { confirm: "Delete", cancel: "Cancel" },
      confirmProps: { color: "red" },
      onConfirm: () => handleDelete(row.original),
    });

  const table = useMantineReactTable({
    title: title,
    columns,
    data: data,
    initialState: { ...initialState },
    createDisplayMode: "row",
    editDisplayMode: "row",
    enableEditing: true,
    getRowId: (row) => row.id,
    onCreatingRowSave: handleCreateItem,
    onEditingRowSave: handleSaveItem,
    renderRowActions: ({ row, table }) => (
      <Flex gap="md">
        <Tooltip label="Edit">
          <ActionIcon onClick={() => table.setEditingRow(row)}>
            <IconEdit />
          </ActionIcon>
        </Tooltip>
        <Tooltip label="Delete">
          <ActionIcon color="red" onClick={() => openDeleteConfirmModal(row)}>
            <IconTrash />
          </ActionIcon>
        </Tooltip>
      </Flex>
    ),
    renderTopToolbarCustomActions: ({ table }) => (
      <ActionIcon
        variant="outline"
        onClick={() => {
          table.setCreatingRow(true);
        }}
        color="teal"
      >
        <IconPlus size="40" />
      </ActionIcon>
    ),
  });

  return <MantineReactTable table={table} />;
};

export default CustomReactCRUDTable;
