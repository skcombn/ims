import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Flex,
  Heading,
  IconButton,
  useDisclosure,
} from "@chakra-ui/react";
import { EditIcon, DeleteIcon, AddIcon } from "@chakra-ui/icons";
import { AlertDialogBox } from "../helpers/AlertDialogBox";
import CustomReactTable from "../helpers/CustomReactTable";
import { useRecoilState } from "recoil";
import {
  tranadjustState,
  tranadjustdetlsState,
  editTranadjustIdState,
  editTranadjustDetlsIdState,
} from "../data/atomdata";
import { useTransDetls } from "../react-query/transdetls/useTranDetls";

const TransAdjustDetlsTable = ({
  batchdetlsstate,
  setBatchDetlsState,
  handleAddBatchDetls,
  handleDeleteBatchDetls,
  handleEditBatchDetls,
}) => {
  //const { samplesbatchdetls, setBatchDetlsId } = useSamplesBatchDetls();
  //const [batchdetls, setBatchDetls] = useState();
  //const [state, setState] = useState({});
  //const [statustype, setStatusType] = useState('');
  const [filterText, setFilterText] = useState("");
  const [editBatchId, setEditBatchId] = useRecoilState(editTranadjustIdState);
  // const [singleSampleBatch, setSingleSampleBatch] = useRecoilState(
  //   singleSampleBatchState
  // );
  // const [singleSampleBatchDetls, setSingleSampleBatchDetls] = useRecoilState(
  //   singleSampleBatchDetlsState
  // );

  /* const filteredData = batchdetlsstate.filter(
    item =>
      item.tl_desp &&
      item.tl_desp.toLowerCase().includes(filterText.toLowerCase())
  ); */

  const {
    isOpen: isAlertDeleteOpen,
    onOpen: onAlertDeleteOpen,
    onClose: onAlertDeleteClose,
  } = useDisclosure();

  const {
    isOpen: isBatchDetlsOpen,
    onOpen: onBatchDetlsOpen,
    onClose: onBatchDetlsClose,
  } = useDisclosure();

  const title = "Adjustment Details";

  const columns = useMemo(
    () => [
      {
        header: "Item No",
        accessorKey: "tad_itemno",
        //size: 200,
        mantineTableBodyCellProps: {
          align: "left",
        },
      },
      {
        header: "Description",
        accessorFn: (row) => row.tad_desp,
        //size: 200,
        mantineTableBodyCellProps: {
          align: "left",
        },
      },
      {
        header: "Packing",
        accessorFn: (row) => row.tad_packing,
        //size: 200,
        mantineTableBodyCellProps: {
          align: "left",
        },
      },
      {
        header: "Qty Onhand",
        accessorFn: (row) => row.tad_qtyonhand || 0,
        //size: 200,

        mantineTableBodyCellProps: {
          align: "right",
        },
      },
      {
        header: "Qty Count",
        accessorFn: (row) => row.tad_qtycount || 0,
        //size: 200,

        mantineTableBodyCellProps: {
          align: "right",
        },
      },
      {
        header: "Qty Adjust",
        accessorFn: (row) => row.tad_qtyadjust || 0,
        //size: 200,

        mantineTableBodyCellProps: {
          align: "right",
        },
      },
      {
        header: "Unit",
        accessorFn: (row) => row.tad_unit || "",
        //size: 200,
        mantineTableBodyCellProps: {
          align: "left",
        },
      },

      {
        header: "Remark",
        accessorFn: (row) => row.tad_remark,
        //size: 200,
        mantineTableBodyCellProps: {
          align: "left",
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
        borderRadius={10}
        overflow="auto"
      >
        <CustomReactTable
          title={title}
          columns={columns}
          data={batchdetlsstate}
          initialState={{ sorting: [{ id: "tad_itemno", desc: false }] }}
          handleAdd={handleAddBatchDetls}
          handleEdit={handleEditBatchDetls}
          handleDelete={handleDeleteBatchDetls}
          disableExportStatus={true}
        />
      </Box>
    </Flex>
  );
};

export default TransAdjustDetlsTable;
