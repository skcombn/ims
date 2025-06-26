import React, { useState, useMemo } from 'react';
import { formatNumber, formatCurrency } from '../helpers/utils';
import {
  Box,
  Flex,
  Heading,
  HStack,
  VStack,
  IconButton,
  useDisclosure,
} from '@chakra-ui/react';
import { Grid, Modal, Tabs } from '@mantine/core';
import { useRecoilState } from 'recoil';
import {
  tranState,
  trandetlsState,
  tranlotsState,
  transerialState,
  editTranIdState,
  editTranDetlsIdState,
  editTranLotsIdState,
  editTranSerialIdState,
} from '../data/atomdata';
import { formatPrice } from '../helpers/utils';
import { Toast } from '../helpers/CustomToastify';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { AlertDialogBox } from '../helpers/AlertDialogBox';
//import { AiFillEdit, AiFillDelete, AiOutlinePlus } from 'react-icons/ai';
import { EditIcon, DeleteIcon, AddIcon } from '@chakra-ui/icons';
import { useTrans } from '../react-query/trans/useTrans';
import { useAddTran } from '../react-query/trans/useAddTran';
import { useDeleteTran } from '../react-query/trans/useDeleteTran';
import { useUpdateTran } from '../react-query/trans/useUpdateTran';
import { useTransDetls } from '../react-query/transdetls/useTranDetls';
import { useUpdateTranDetls } from '../react-query/transdetls/useUpdateTranDetls';
import { useTranLots } from '../react-query/translots/useTranLots';
import { useUpdateTranLot } from '../react-query/translots/useUpdateTranLot';
import { useTranSerial } from '../react-query/transserial/useTranSerial';
import { useUpdateTranSerial } from '../react-query/transserial/useUpdateTranSerial';
import { useItemsHistory } from '../react-query/itemshistory/useItemsHistory';
import { useDeleteItemsHistory } from '../react-query/itemshistory/useDeteteItemsHistory';
import { useItemsExpiry } from '../react-query/itemsexpiry/useItemsExpiry';
import { useUpdateItemExpiry } from '../react-query/itemsexpiry/useUpdateItemExpiry';
import { useAddAuditlog } from '../react-query/auditlog/useAddAuditlog';
import GetLocalUser from '../helpers/GetLocalUser';
import CustomReactTable from '../helpers/CustomReactTable';
import Export2Excel from '../helpers/Export2Excel';
import Export2PDF from '../helpers/Export2PDF';
import Export2CSV from '../helpers/Export2CSV';

const initial_tran = {
  t_no: '',
  t_date: dayjs().format('YYYY-MM-DD'),
  t_type: '',
  t_docno: '',
  t_docdate: dayjs().format('YYYY-MM-DD'),
  t_scno: '',
  t_sc: '',
  t_add1: '',
  t_add2: '',
  t_add3: '',
  t_add4: '',
  t_term: 0,
  t_branch: '',
  t_remark: '',
  t_post: '0',
  t_print: '',
  t_subtotal: 0,
  t_disc: 0,
  t_nettotal: 0,
  t_layout: 'Item',
  t_postdate: dayjs().format('YYYY-MM-DD'),
  t_glcode: '',
  t_recdate: dayjs().format('YYYY-MM-DD'),
  t_createdby: '',
  t_updby: '',
  t_createddate: dayjs().format('YYYY-MM-DD'),
  t_createdtime: '',
  t_upddate: dayjs().format('YYYY-MM-DD'),
  t_updtime: '',
  t_dono: '',
  t_name: '',
  t_section: '',
  t_dodate: dayjs().format('YYYY-MM-DD'),
};

const initial_expiry = {
  ie_itemno: '',
  ie_lotno: '',
  ie_datereceived: null,
  ie_location: '',
  ie_dateexpiry: null,
  ie_pono: 0,
  ie_podate: 0,
  ie_qtyonhand: 0,
  ie_qtyreceived: 1,
  ie_ucost: '',
  ie_post: '0',
};

const TranPOTable = () => {
  const navigate = useNavigate();
  const { transactions, setTranno } = useTrans();
  const addTran = useAddTran();
  const deleteTran = useDeleteTran();
  const updateTran = useUpdateTran();
  const { transdetls, setTranNo } = useTransDetls();
  const { translots, setLotTranNo } = useTranLots();
  const { transserial, setSerialTranNo } = useTranSerial();
  const updateTranDetls = useUpdateTranDetls();
  const updateTranLot = useUpdateTranLot();
  const updateTranSerial = useUpdateTranSerial();

  const { itemshistory, setItemhistItemno } = useItemsHistory();
  const deleteItemsHistory = useDeleteItemsHistory();

  const [state, setState] = useState({});
  const [statustype, setStatusType] = useState('');
  const [filterText, setFilterText] = React.useState('');
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
  const addAuditlog = useAddAuditlog();
  const localuser = GetLocalUser();
  const [activeTab, setActiveTab] = useState('open');

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

  const title = `Purchases Table`;

  const columns = useMemo(
    () => [
      {
        id: 't_no',
        header: 'PO No',
        accessorFn: row => row.t_no,
        //size: 200,
        mantineTableBodyCellProps: {
          align: 'left',
        },
      },

      {
        id: 'date',
        header: 'PO Date',
        accessorFn: row => {
          const tDay = new Date(row.t_date);
          tDay.setHours(0, 0, 0, 0); // remove time from date
          return tDay;
        },
        Cell: ({ cell }) =>
          dayjs(cell.getValue().toLocaleDateString()).format('DD-MMM-YYYY'),
        size: 200,
        filterVariant: 'date',
        sortingFn: 'datetime',
        mantineTableBodyCellProps: {
          align: 'left',
        },
      },
      {
        header: 'MR No',
        accessorFn: row => row.t_docno,
        //size: 200,
        mantineTableBodyCellProps: {
          align: 'left',
        },
      },
      {
        header: 'MR Date',
        accessorFn: row => {
          const tDay = new Date(row.t_docdate);
          tDay.setHours(0, 0, 0, 0); // remove time from date
          return tDay;
        },
        Cell: ({ cell }) =>
          dayjs(cell.getValue().toLocaleDateString()).format('DD-MMM-YYYY'),
        size: 200,
        filterVariant: 'date',
        sortingFn: 'datetime',
        mantineTableBodyCellProps: {
          align: 'left',
        },
      },
      {
        header: 'Type',
        accessorFn: row => row.t_type,
        //size: 200,
        mantineTableBodyCellProps: {
          align: 'left',
        },
      },
      {
        header: 'Amount',
        accessorFn: row => row.t_nettotal,
        //size: 200,
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
        header: 'Source',
        accessorFn: row => row.t_sc,
        //size: 200,
        mantineTableBodyCellProps: {
          align: 'left',
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
        header: 'Status',
        accessorFn: row => {
          switch (row.t_post) {
            case '0':
              return <div>Open</div>;
            case '1':
              return <div>Posted</div>;
            case 'D':
              return <div>Deleted</div>;
            default:
              return null;
          }
        },
        size: 120,
        mantineTableBodyCellProps: {
          align: 'left',
        },
      },
    ],
    []
  );

  const handleOnDeleteConfirm = () => {
    const { t_no } = state;
    const updRec = { ...state, t_post: 'D' };
    updateTran(updRec);
    //deleteTranDetls({ tl_tranno: t_no });
    transdetls
      .filter(r => r.tl_tranno === t_no)
      .forEach(rec => {
        updateTranDetls({ ...rec, tl_post: 'D' });
      });
    translots
      .filter(r => r.tl_tranno === t_no)
      .forEach(rec => {
        updateTranLot({ ...rec, tl_post: 'D' });
      });
    transserial
      .filter(r => r.ts_pono === t_no)
      .forEach(rec => {
        updateTranSerial({ ...rec, ts_post: 'D' });
      });

    //delete ItemsHistory
    /*itemshistory
      .filter(r => r.it_transno === t_no)
      .forEach(rec => {
        deleteItemsHistory(rec.tl_id);
      }); */
    //add to auditlog
    const auditdata = {
      al_userid: localuser.userid,
      al_user: localuser.name,
      al_date: dayjs().format('YYYY-MM-DD'),
      al_time: dayjs().format('HHmmss'),
      al_timestr: dayjs().format('HH:mm:ss'),
      al_module: 'Purchases',
      al_action: 'Delete',
      al_record: t_no,
      al_remark: 'Successful',
    };
    addAuditlog(auditdata);
  };

  const handleAddTran = () => {
    setEditInvoiceId(
      prev => (prev = { id: '', batchno: '', layout: 'Item', status: 'add' })
    );
    setInvoice(prev => (prev = { ...initial_tran, t_type: 'Purchase' }));
    setInvoicedetls(
      prev => (prev = transdetls.filter(r => r.tl_tranno === ''))
    );
    setInvoicelots(prev => (prev = translots.filter(r => r.tl_tranno === '')));
    setInvoiceserial(
      prev => (prev = transserial.filter(r => r.ts_tranno === ''))
    );

    navigate('/purchaseinvoice');
  };

  const handleEditTran = row => {
    const { original } = row;
    const { t_id, t_no, t_layout } = original;
    setEditInvoiceId(
      prev => (prev = { id: t_id, no: t_no, layout: t_layout, status: 'edit' })
    );
    setInvoice(prev => (prev = { ...prev, ...original }));
    setEditInvoicedetlsId(prev => (prev = { ...prev, id: t_id, no: t_no }));
    setInvoicedetls(prev => transdetls.filter(r => r.tl_tranno === t_no));
    setInvoicelots(prev => translots.filter(r => r.tl_tranno === t_no));
    setInvoiceserial(prev => transserial.filter(r => r.ts_pono === t_no));
    //navigate
    navigate('/purchaseinvoice');
  };

  const handleDeleteTran = row => {
    const { original } = row;
    const { t_post } = original;
    if (t_post !== '0') {
      Toast({
        title: 'This transaction can not be deleted!',
        status: 'warning',
        customId: 'trandelErr',
      });
    } else {
      setState(prev => (prev = { ...original }));
      onAlertDeleteOpen();
    }
  };

  const add_Tran = data => {
    addTran(data);
  };

  const update_Tran = data => {
    updateTran(data);
    onTranClose();
  };

  const handleExportExcel = rows => {
    // add auditlog
    const auditdata = {
      al_userid: localuser.userid,
      al_user: localuser.name,
      al_date: dayjs().format('YYYY-MM-DD'),
      al_time: dayjs().format('HHmmss'),
      al_timestr: dayjs().format('HH:mm:ss'),
      al_module: 'Purchases',
      al_action: 'Export to Excel',
      al_record: '',
      al_remark: 'Successful',
    };
    addAuditlog(auditdata);
    // export excel
    const heading = [columns.map(c => c.header)];
    //const heading = [header];
    const rowData = rows.map(row => [
      row.original.t_no,
      row.original.t_date,
      row.original.t_docno,
      row.original.t_docdate,
      row.original.t_type,
      formatCurrency(row.original.t_nettotal),
      row.original.t_sc,
      row.original.t_post === '0' ? 'Open' : 'Posted',
    ]);
    const colWidths = [
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
    ];
    Export2Excel({ heading, rowData, colWidths, title });
  };

  const handleExportCSV = rows => {
    // add auditlog
    const auditdata = {
      al_userid: localuser.userid,
      al_user: localuser.name,
      al_date: dayjs().format('YYYY-MM-DD'),
      al_time: dayjs().format('HHmmss'),
      al_timestr: dayjs().format('HH:mm:ss'),
      al_module: 'Purchases',
      al_action: 'Export to CSV',
      al_record: '',
      al_remark: 'Successful',
    };
    addAuditlog(auditdata);
    // export csv
    const tableHeaders = columns.map(c => c.header);
    //const rowData = rows.map(row => row.original);
    const rowData = rows.map(row => [
      row.original.t_no,
      row.original.t_date,
      row.original.t_docno,
      row.original.t_docdate,
      row.original.t_type,
      formatCurrency(row.original.t_nettotal),
      row.original.t_sc,
      row.original.t_post === '0' ? 'Open' : 'Posted',
    ]);
    Export2CSV({ rowData, title });
  };

  const handleExportPDF = rows => {
    // add auditlog
    const auditdata = {
      al_userid: localuser.userid,
      al_user: localuser.name,
      al_date: dayjs().format('YYYY-MM-DD'),
      al_time: dayjs().format('HHmmss'),
      al_timestr: dayjs().format('HH:mm:ss'),
      al_module: 'Purchases',
      al_action: 'Export to PDF',
      al_record: '',
      al_remark: 'Successful',
    };
    addAuditlog(auditdata);
    // export pdf

    const tableData = rows.map(row =>
      Object.values([
        row.original.t_no,
        row.original.t_date,
        row.original.t_docno,
        row.original.t_docdate,
        row.original.t_type,
        formatCurrency(row.original.t_nettotal),
        row.original.t_sc,
        row.original.t_post === '0' ? 'Open' : 'Posted',
      ])
    );
    const tableHeaders = columns.map(c => c.header);

    Export2PDF({
      tableHeaders: tableHeaders,
      tableData: tableData,
      title: title,
      layout: 'l',
    });
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
        <Tabs value={activeTab} onTabChange={setActiveTab}>
          <Tabs.List>
            <Tabs.Tab value="open">
              <VStack alignItems={'flex-start'} p={1}>
                <Heading size="md">Open</Heading>
              </VStack>
            </Tabs.Tab>
            <Tabs.Tab value="posted">
              <VStack alignItems={'flex-start'} p={1}>
                <Heading size="md">Posted</Heading>
              </VStack>
            </Tabs.Tab>
            <Tabs.Tab value="deleted">
              <VStack alignItems={'flex-start'} p={1}>
                <Heading size="md">Deleted</Heading>
              </VStack>
            </Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value="open">
            <CustomReactTable
              title="Open Purchases Table"
              columns={columns}
              data={transactions.filter(
                r =>
                  (r.t_type === 'Purchase' && r.t_post === '0') ||
                  (r.t_type === 'PO Returns' && r.t_post === '0')
              )}
              initialState={{ sorting: [{ id: 't_no', desc: true }] }}
              handleAdd={handleAddTran}
              handleEdit={handleEditTran}
              handleDelete={handleDeleteTran}
              handleExportPDF={handleExportPDF}
              handleExportCSV={handleExportCSV}
              handleExportExcel={handleExportExcel}
            />
          </Tabs.Panel>
          <Tabs.Panel value="posted">
            <CustomReactTable
              title="Posted Purchases Table"
              columns={columns}
              data={transactions.filter(
                r =>
                  (r.t_type === 'Purchase' && r.t_post === '1') ||
                  (r.t_type === 'PO Returns' && r.t_post === '1')
              )}
              initialState={{ sorting: [{ id: 't_no', desc: true }] }}
              handleAdd={handleAddTran}
              handleEdit={handleEditTran}
              handleDelete={handleDeleteTran}
              handleExportPDF={handleExportPDF}
              handleExportCSV={handleExportCSV}
              handleExportExcel={handleExportExcel}
            />
          </Tabs.Panel>
          <Tabs.Panel value="deleted">
            <CustomReactTable
              title="Deleted Purchases Table"
              columns={columns}
              data={transactions.filter(
                r =>
                  (r.t_type === 'Purchase' && r.t_post === 'D') ||
                  (r.t_type === 'PO Returns' && r.t_post === 'D')
              )}
              initialState={{ sorting: [{ id: 't_no', desc: true }] }}
              handleAdd={handleAddTran}
              handleEdit={handleEditTran}
              handleDelete={handleDeleteTran}
              handleExportPDF={handleExportPDF}
              handleExportCSV={handleExportCSV}
              handleExportExcel={handleExportExcel}
            />
          </Tabs.Panel>
        </Tabs>
      </Box>

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

export default TranPOTable;
