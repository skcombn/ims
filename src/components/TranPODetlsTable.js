import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
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
} from "@chakra-ui/react";
import { EditIcon, DeleteIcon, AddIcon } from "@chakra-ui/icons";
import { AlertDialogBox } from "../helpers/AlertDialogBox";
import CustomReactTable from "../helpers/CustomReactTable";
import { useRecoilState } from "recoil";
import {
  tranState,
  trandetlsState,
  editTranIdState,
  editTranDetlsIdState,
} from "../data/atomdata";
import { useTransDetls } from "../react-query/transdetls/useTranDetls";

const TranPODetlsTable = ({
  batchdetlsstate,
  setBatchDetlsState,
  batchserialstate,
  setBatchSerialState,
  handleAddBatchDetls,
  handleDeleteBatchDetls,
  handleEditBatchDetls,
}) => {
  //const navigate = useNavigate();
  //const { samplesbatchdetls, setBatchDetlsId } = useSamplesBatchDetls();
  //const [batchdetls, setBatchDetls] = useState();
  //const [state, setState] = useState({});
  //const [statustype, setStatusType] = useState('');
  const [filterText, setFilterText] = useState("");
  const [editBatchId, setEditBatchId] = useRecoilState(editTranIdState);
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

  const title = "Items Details";

  const columns = useMemo(
    () => [
      {
        header: "Item No",
        accessorFn: (row) => row.tl_itemno,
        //size: 200,
        mantineTableBodyCellProps: {
          align: "left",
        },
      },
      {
        header: "Description",
        accessorFn: (row) => row.tl_desp,
        //size: 200,
        mantineTableBodyCellProps: {
          align: "left",
        },
      },
      {
        header: "Packing",
        accessorFn: (row) => row.tl_packing,
        //size: 200,
        mantineTableBodyCellProps: {
          align: "left",
        },
      },
      {
        header: "Qty",
        accessorFn: (row) => row.tl_qty || 0,
        //size: 200,

        mantineTableBodyCellProps: {
          align: "right",
        },
      },
      {
        header: "Unit",
        accessorFn: (row) => row.tl_unit || "",
        //size: 200,
        mantineTableBodyCellProps: {
          align: "left",
        },
      },
      {
        header: "Unit Value",
        accessorFn: (row) => row.tl_netucost || 0,
        //size: 200,
        Cell: ({ cell }) =>
          cell.getValue()?.toLocaleString?.("en-US", {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }),
        mantineTableBodyCellProps: {
          align: "right",
        },
      },
      {
        header: "Amount",
        accessorFn: (row) => row.tl_amount || 0,
        //size: 200,
        Cell: ({ cell }) =>
          cell.getValue()?.toLocaleString?.("en-US", {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }),
        mantineTableBodyCellProps: {
          align: "right",
        },
      },
      {
        header: "Remark",
        accessorFn: (row) => row.tl_remark,
        //size: 200,
        mantineTableBodyCellProps: {
          align: "left",
        },
      },
    ],
    []
  );

  const columns_others = useMemo(
    () => [
      {
        id: 1,
        key: "editaction",
        text: "Action",
        sortable: false,
        width: "60px",
        cell: (record) => {
          return (
            <>
              <IconButton
                icon={<EditIcon />}
                size="sm"
                onClick={() => {
                  handleEditBatchDetls(record);
                }}
              ></IconButton>
            </>
          );
        },
      },
      {
        id: 2,
        key: "deleteaction",
        text: "Action",
        width: "60px",
        sortable: false,
        cell: (record) => {
          return (
            <>
              <IconButton
                icon={<DeleteIcon />}
                size="sm"
                onClick={() => {
                  handleDeleteBatchDetls(record);
                }}
              />
            </>
          );
        },
      },

      {
        id: 5,
        name: "Description",
        selector: (row) => row.tl_desp,
        //minWidth: '200px',
        sortable: true,
        filterable: true,
        align: "left",
        wrap: false,
        cell: (row) => (
          <div style={{ overflow: "hidden", textAlign: "left" }}>
            {row.tl_desp}
          </div>
        ),
      },

      {
        id: 10,
        name: "Amount",
        selector: (row) => row.tl_amount || 0,
        width: "200px",
        sortable: true,
        filterable: true,
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
          handleAdd={handleAddBatchDetls}
          handleEdit={handleEditBatchDetls}
          handleDelete={handleDeleteBatchDetls}
          disableExportStatus={true}
        />
      </Box>
    </Flex>
  );
};

export default TranPODetlsTable;
