import React, { useState, useMemo } from "react";
import currency from "currency.js";
import { format } from "date-fns";
import {
  Box,
  Flex,
  Heading,
  IconButton,
  useDisclosure,
} from "@chakra-ui/react";
import { Modal } from "@mantine/core";
import { useRecoilState } from "recoil";
import {
  tranState,
  trandetlsState,
  tranlotsState,
  transerialState,
  editTranIdState,
  editTranDetlsIdState,
  editTranLotsIdState,
  editTranSerialIdState,
} from "../data/atomdata";
import { formatPrice } from "../helpers/utils";
import { Toast } from "../helpers/CustomToastify";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { AlertDialogBox } from "../helpers/AlertDialogBox";
//import { AiFillEdit, AiFillDelete, AiOutlinePlus } from 'react-icons/ai';
import { EditIcon, DeleteIcon, AddIcon } from "@chakra-ui/icons";
import { useTrans } from "../react-query/trans/useTrans";
import { useAddTran } from "../react-query/trans/useAddTran";
import { useDeleteTran } from "../react-query/trans/useDeleteTran";
import { useUpdateTran } from "../react-query/trans/useUpdateTran";
import { useTransDetls } from "../react-query/transdetls/useTranDetls";
import { useDeleteTranDetls } from "../react-query/transdetls/useDeleteTranDetls";
import { useTranLots } from "../react-query/translots/useTranLots";
import { useDeleteTranLot } from "../react-query/translots/useDeleteTranLot";
import { useTranSerial } from "../react-query/transserial/useTranSerial";
import { useDeleteTranSerial } from "../react-query/transserial/useDeleteTranSerial";
import { useItemsHistory } from "../react-query/itemshistory/useItemsHistory";
import { useDeleteItemsHistory } from "../react-query/itemshistory/useDeteteItemsHistory";
import { useItemsExpiry } from "../react-query/itemsexpiry/useItemsExpiry";
import { useDeleteItemExpiry } from "../react-query/itemsexpiry/useDeleteItemExpiry";
import CustomReactTable from "../helpers/CustomReactTable";
import TranForm from "./TranForm";

const initial_tran = {
  t_no: "",
  t_date: dayjs().format("YYYY-MM-DD"),
  t_type: "",
  t_docno: "",
  t_docdate: dayjs().format("YYYY-MM-DD"),
  t_scno: "",
  t_sc: "",
  t_add1: "",
  t_add2: "",
  t_add3: "",
  t_add4: "",
  t_term: "",
  t_branch: "",
  t_remark: "",
  t_post: "0",
  t_print: "",
  t_subtotal: 0,
  t_disc: 0,
  t_nettotal: 0,
  t_layout: "Item",
  t_postdate: dayjs().format("YYYY-MM-DD"),
  t_glcode: "",
  t_recdate: dayjs().format("YYYY-MM-DD"),
  t_createdby: "",
  t_updby: "",
  t_createddate: dayjs().format("YYYY-MM-DD"),
  t_createdtime: "",
  t_upddate: dayjs().format("YYYY-MM-DD"),
  t_updtime: "",
  t_dono: "",
  t_dodate: dayjs().format("YYYY-MM-DD"),
  t_name: "",
  t_section: "",
};

const initial_expiry = {
  ie_itemno: "",
  ie_lotno: "",
  ie_datereceived: null,
  ie_location: "",
  ie_dateexpiry: 0,
  ie_pono: 0,
  ie_podate: 0,
  ie_qtyonhand: 0,
  ie_qtyreceived: 1,
  ie_ucost: "",
  ie_post: "0",
};

const TransTable = ({ transtype }) => {
  const navigate = useNavigate();
  const { transactions, setTranno } = useTrans();
  const addTran = useAddTran();
  const deleteTran = useDeleteTran();
  const updateTran = useUpdateTran();
  const { transdetls, setTranNo } = useTransDetls();
  const { translots, setLotTranNo } = useTranLots();
  const { transserial, setSerialTranNo } = useTranSerial();
  const deleteTranDetls = useDeleteTranDetls();
  const deleteTranLot = useDeleteTranLot();
  const deleteTranSerial = useDeleteTranSerial();

  const { itemshistory, setItemhistItemno } = useItemsHistory();
  const deleteItemsHistory = useDeleteItemsHistory();

  const [state, setState] = useState({});
  const [statustype, setStatusType] = useState("");
  const [filterText, setFilterText] = React.useState("");
  const [invoice, setInvoice] = useRecoilState(tranState);
  const [invoicedetls, setInvoicedetls] = useRecoilState(trandetlsState);
  const [invoicelots, setInvoicelots] = useRecoilState(tranlotsState);
  const [invoiceserial, setInvoiceserial] = useRecoilState(transerialState);
  const [editInvoiceId, setEditInvoiceId] = useRecoilState(editTranIdState);
  const [editInvoicedetlsId, setEditInvoicedetlsId] =
    useRecoilState(editTranDetlsIdState);
  const [editInvoicelotsId, setEditInvoicelotsId] =
    useRecoilState(editTranLotsIdState);
  const [editInvoiceserialId, setEditInvoiceserialId] = useRecoilState(
    editTranSerialIdState
  );

  const {
    isOpen: isAlertDeleteOpen,
    onOpen: onAlertDeleteOpen,
    onClose: onAlertDeleteClose,
  } = useDisclosure();

  const {
    isOpen: isTranOpen,
    onOpen: onTranOpen,
    onClose: onTranClose,
  } = useDisclosure();

  const title = `${transtype}`;

  const columns = useMemo(
    () => [
      {
        id: "t_no",
        header: transtype === "Purchase" ? "PO No" : "Invoice No",
        accessorFn: (row) => row.t_no,
        //size: 200,
        mantineTableBodyCellProps: {
          align: "left",
        },
      },

      {
        id: "date",
        header: transtype === "Purchase" ? "PO Date" : "Invoice Date",
        accessorFn: (row) => {
          const tDay = new Date(row.t_date);
          tDay.setHours(0, 0, 0, 0); // remove time from date
          return tDay;
        },
        Cell: ({ cell }) =>
          dayjs(cell.getValue().toLocaleDateString()).format("DD-MMM-YYYY"),
        size: 200,
        filterVariant: "date",
        sortingFn: "datetime",
        mantineTableBodyCellProps: {
          align: "left",
        },
      },
      {
        header: transtype === "Purchase" ? "MR No" : "DO No",
        accessorFn: (row) => row.t_docno,
        //size: 200,
        mantineTableBodyCellProps: {
          align: "left",
        },
      },
      {
        header: transtype === "Purchase" ? "MR Date" : "DO Date",
        accessorFn: (row) => {
          const tDay = new Date(row.t_docdate);
          tDay.setHours(0, 0, 0, 0); // remove time from date
          return tDay;
        },
        Cell: ({ cell }) =>
          dayjs(cell.getValue().toLocaleDateString()).format("DD-MMM-YYYY"),
        size: 200,
        filterVariant: "date",
        sortingFn: "datetime",
        mantineTableBodyCellProps: {
          align: "left",
        },
      },
      {
        header: "type",
        accessorFn: (row) => row.t_type,
        //size: 200,
        mantineTableBodyCellProps: {
          align: "left",
        },
      },
      {
        header: "Amount",
        accessorFn: (row) => row.t_nettotal,
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
        header: "Source",
        accessorFn: (row) => row.t_sc,
        //size: 200,
        mantineTableBodyCellProps: {
          align: "left",
        },
      },

      /*    {
      id: 10,
      name: 'Amount',
      selector: row => row.t_nettotal,
      width: '120px',
      sortable: true,
      right: true,
      cell: row => <div>{currency(row.t_nettotal).format()}</div>,
    }, */
      {
        header: "Status",
        accessorFn: (row) => {
          switch (row.t_post) {
            case "0":
              return <div>Open</div>;
            case "1":
              return <div>Posted</div>;
            case "D":
              return <div>Deleted</div>;
            default:
              return null;
          }
        },
        size: 120,
        mantineTableBodyCellProps: {
          align: "left",
        },
      },
    ],
    []
  );

  const handleOnDeleteConfirm = () => {
    const { id, t_no } = state;
    deleteTran(id);
    //deleteTranDetls({ tl_tranno: t_no });
    transdetls
      .filter((r) => r.tl_tranno === t_no)
      .forEach((rec) => {
        deleteTranDetls(rec.id);
      });
    translots
      .filter((r) => r.tl_tranno === t_no)
      .forEach((rec) => {
        deleteTranLot(rec.id);
      });
    transserial
      .filter((r) =>
        transtype === "Purchase" ? r.ts_pono === t_no : r.ts_invno === t_no
      )
      .forEach((rec) => {
        deleteTranSerial(rec.id);
      });

    //delete ItemsHistory
    /*  itemshistory
      .filter(r => r.it_transno === t_no)
      .forEach(rec => {
        deleteItemsHistory(rec.tl_id);
      }); */
  };

  const handleAddTran = () => {
    setEditInvoiceId(
      (prev) => (prev = { id: "", batchno: "", layout: "Item", status: "add" })
    );
    setInvoice((prev) => (prev = { ...initial_tran, t_type: transtype }));
    setInvoicedetls(
      (prev) => (prev = transdetls.filter((r) => r.tl_tranno === ""))
    );
    setInvoicelots(
      (prev) => (prev = translots.filter((r) => r.tl_tranno === ""))
    );
    setInvoiceserial(
      (prev) => (prev = transserial.filter((r) => r.ts_tranno === ""))
    );
    switch (transtype) {
      case "Purchase":
        navigate("/purchaseinvoice");
        break;
      case "Purchase Returns":
        navigate("/purchaseinvoice");
        break;
      case "Sales":
        navigate("/salesinvoice");
        break;
      case "Sales Returns":
        navigate("/salesinvoice");
        break;
      default:
        return null;
    }
  };

  const handleEditTran = (row) => {
    const { original } = row;
    const { t_id, t_no, t_layout } = original;
    setEditInvoiceId(
      (prev) =>
        (prev = { id: t_id, no: t_no, layout: t_layout, status: "edit" })
    );
    setInvoice((prev) => (prev = { ...prev, ...original }));
    setEditInvoicedetlsId((prev) => (prev = { ...prev, id: t_id, no: t_no }));
    setInvoicedetls((prev) => transdetls.filter((r) => r.tl_tranno === t_no));
    setInvoicelots((prev) => translots.filter((r) => r.tl_tranno === t_no));
    setInvoiceserial((prev) =>
      transserial.filter((r) =>
        transtype === "Purchase" ? r.ts_pono === t_no : r.ts_invno === t_no
      )
    );

    switch (transtype) {
      case "Purchase":
        navigate("/purchaseinvoice");
        break;
      case "Purchase Returns":
        navigate("/purchaseinvoice");
        break;
      case "Sales":
        navigate("/salesinvoice");
        break;
      case "Sales Returns":
        navigate("/salesinvoice");
        break;
      default:
        return null;
    }
  };

  const handleDeleteTran = (row) => {
    const { original } = row;
    const { t_post } = original;
    if (t_post !== "0") {
      Toast({
        title: "This transaction can not be deleted!",
        status: "warning",
        customId: "trandelErr",
      });
    } else {
      setState((prev) => (prev = { ...original }));
      onAlertDeleteOpen();
    }
  };

  const add_Tran = (data) => {
    addTran(data);
  };

  const update_Tran = (data) => {
    updateTran(data);
    onTranClose();
  };

  return (
    <Flex p={5}>
      <Box
        width="100%"
        borderWidth={1}
        borderRadius={15}
        borderColor="teal.800"
        overflow="auto"
      >
        <CustomReactTable
          title={title}
          columns={columns}
          data={transactions.filter(
            (r) => r.t_type === transtype || r.t_type === transtype + " Returns"
          )}
          initialState={{ sorting: [{ id: "t_no", desc: true }] }}
          handleAdd={handleAddTran}
          handleEdit={handleEditTran}
          handleDelete={handleDeleteTran}
        />
      </Box>
      <Modal opened={isTranOpen} onClose={onTranClose} size="4xl">
        <TranForm
          state={state}
          setState={setState}
          add_Purchase={add_Tran}
          update_Purchase={update_Tran}
          statustype={statustype}
          onPOClose={onTranClose}
        />
      </Modal>
      <AlertDialogBox
        onClose={onAlertDeleteClose}
        onConfirm={handleOnDeleteConfirm}
        isOpen={isAlertDeleteOpen}
        title="Delete Transaction"
      >
        <Heading size="md">
          Are you sure you want to delete this transaction {state.t_no} ?
        </Heading>
      </AlertDialogBox>
    </Flex>
  );
};

export default TransTable;
