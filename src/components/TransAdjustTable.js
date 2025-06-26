import React, { useState, useMemo } from 'react';
import currency from 'currency.js';
import { formatNumber, formatCurrency } from '../helpers/utils';
import { Toast } from '../helpers/CustomToastify';
import {
  Box,
  Flex,
  Heading,
  IconButton,
  HStack,
  VStack,
  useDisclosure,
} from '@chakra-ui/react';
import { Modal, Tabs } from '@mantine/core';
import { useRecoilState } from 'recoil';
import {
  tranadjustState,
  tranadjustdetlsState,
  tranadjustlotState,
  editTranadjustIdState,
  editTranadjustDetlsIdState,
  editTranadjustLotIdState,
} from '../data/atomdata';
import { formatPrice } from '../helpers/utils';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import CustomReactTable from '../helpers/CustomReactTable';
import { AlertDialogBox } from '../helpers/AlertDialogBox';
//import { AiFillEdit, AiFillDelete, AiOutlinePlus } from 'react-icons/ai';
import { EditIcon, DeleteIcon, AddIcon } from '@chakra-ui/icons';
import { useTransadjust } from '../react-query/transadjust/useTransadjust';
import { useAddTransadjust } from '../react-query/transadjust/useAddTransadjust';
import { useDeleteTransadjust } from '../react-query/transadjust/useDeleteTransadjust';
import { useUpdateTransadjust } from '../react-query/transadjust/useUpdateTransadjust';
import { useTransadjustDetls } from '../react-query/transadjustdetls/useTransadjustsDetls';
import { useDeleteTransAdjustDetls } from '../react-query/transadjustdetls/useDeleteTransAdjustDetls';
import { useAddTransAdjustDetls } from '../react-query/transadjustdetls/useAddTransAdjustDetls';
import { useTransadjustLot } from '../react-query/transadjlot/useTransadjustLot';
import { useAddTransAdjustLot } from '../react-query/transadjlot/useAddTransadjustLot';
import { useDeleteTransAdjustLot } from '../react-query/transadjlot/useDeleteTransadjustLot';
import { useItemsHistory } from '../react-query/itemshistory/useItemsHistory';
import { useDeleteItemsHistory } from '../react-query/itemshistory/useDeteteItemsHistory';
import { useAddAuditlog } from '../react-query/auditlog/useAddAuditlog';
import GetLocalUser from '../helpers/GetLocalUser';
import Export2Excel from '../helpers/Export2Excel';
import Export2PDF from '../helpers/Export2PDF';
import Export2CSV from '../helpers/Export2CSV';
import TransAdjustForm from './TransAdjustForm';

const initial_tran = {
  ta_batchno: '',
  ta_date: dayjs().format('YYYY-MM-DD'),
  ta_userid: '',
  ta_user: '',
  ta_branch: '',
  ta_remark: '',
  ta_post: '0',
  ta_type: 'Adjustment',
};

const TransTable = () => {
  const navigate = useNavigate();
  const { tranadjust, setTranAdjno } = useTransadjust();
  const addTransadjust = useAddTransadjust();
  const deleteTransadjust = useDeleteTransadjust();
  const updateTransadjust = useUpdateTransadjust();
  const { tranadjustdetls, setTranAdjDetlId } = useTransadjustDetls();
  const addTransadjustDetls = useAddTransAdjustDetls();
  const deleteTransadjustDetls = useDeleteTransAdjustDetls();
  const { tranadjustlot, setTranAdjlotId } = useTransadjustLot();
  const addTransadjustLot = useAddTransAdjustLot();
  const deleteTransadjustLot = useDeleteTransAdjustLot();

  const { itemshistory, setItemhistItemno } = useItemsHistory();
  const deleteItemsHistory = useDeleteItemsHistory();
  const [state, setState] = useState({});
  const [statustype, setStatusType] = useState('');
  const [filterText, setFilterText] = React.useState('');
  const [trans, setTrans] = useRecoilState(tranadjustState);
  const [transdetls, setTransdetls] = useRecoilState(tranadjustdetlsState);
  const [translot, setTranslot] = useRecoilState(tranadjustlotState);
  const [editTranId, setEditTranId] = useRecoilState(editTranadjustIdState);
  const [editTrandetlsId, setEditTrandetlsId] = useRecoilState(
    editTranadjustDetlsIdState
  );
  const [editTranlotId, setEditTranlotId] = useRecoilState(
    editTranadjustLotIdState
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

  const title = `Adjustment Transactions`;

  const columns = useMemo(
    () => [
      {
        header: 'Batch No',
        accessorKey: 'ta_batchno',
        //size: 200,
        mantineTableBodyCellProps: {
          align: 'left',
        },
      },

      {
        id: 'date',
        header: 'Batch Date',
        accessorFn: row => {
          const tDay = new Date(row.ta_date);
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
        header: 'Remark',
        accessorKey: 'ta_remark',
        //size: 200,
        mantineTableBodyCellProps: {
          align: 'left',
        },
      },
      {
        header: 'Status',
        accessorFn: row => {
          switch (row.ta_post) {
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
    const { id, ta_id, ta_batchno } = state;
    const updRec = { ...state, ta_post: 'D' };
    updateTransadjust(updRec);
    /*  tranadjustdetls
      .filter(r => r.tad_batchno === ta_batchno)
      .forEach(rec => {
        deleteTransadjustDetls({ tad_id: rec.tad_id });
      }); */
    //add to auditlog
    const auditdata = {
      al_userid: localuser.userid,
      al_user: localuser.name,
      al_date: dayjs().format('YYYY-MM-DD'),
      al_time: dayjs().format('HHmmss'),
      al_timestr: dayjs().format('HH:mm:ss'),
      al_module: 'Adjustment',
      al_action: 'Delete',
      al_record: ta_batchno,
      al_remark: 'Successful',
    };
    addAuditlog(auditdata);
  };

  const handleAddTran = () => {
    setEditTranId(
      prev => (prev = { id: '', batchno: '', layout: 'Item', status: 'add' })
    );
    setTrans(prev => (prev = { ...initial_tran }));
    setTransdetls(
      prev => (prev = tranadjustdetls.filter(r => r.tad_batchno === ''))
    );
    setTranslot(
      prev => (prev = tranadjustlot.filter(r => r.tal_batchno === ''))
    );
    navigate('/adjustmentform');
  };

  const handleEditTran = row => {
    const { original } = row;
    const { ta_id, ta_batchno } = original;
    setEditTranId(
      prev => (prev = { id: ta_id, no: ta_batchno, status: 'edit' })
    );
    setTrans(prev => (prev = { ...prev, ...original }));
    setEditTrandetlsId(prev => (prev = { ...prev, id: ta_id, no: ta_batchno }));
    setTransdetls(prev =>
      tranadjustdetls.filter(r => r.tad_batchno === ta_batchno)
    );
    setEditTranlotId(prev => (prev = { ...prev, id: ta_id, no: ta_batchno }));
    setTranslot(prev =>
      tranadjustlot.filter(r => r.tal_batchno === ta_batchno)
    );

    navigate('/adjustmentform');
  };

  const handleDeleteTran = row => {
    const { original } = row;
    const { ta_post } = original;
    if (ta_post !== '0') {
      Toast({
        title: 'This transaction can not be deleted!',
        status: 'warning',
        customId: 'transadjustDelErr',
      });
    } else {
      setState(prev => (prev = { ...original }));
      onAlertDeleteOpen();
    }
  };

  const add_Tran = data => {
    addTransadjust(data);
  };

  const update_Tran = data => {
    updateTransadjust(data);
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
      al_module: 'Adjustment',
      al_action: 'Export to Excel',
      al_record: '',
      al_remark: 'Successful',
    };
    addAuditlog(auditdata);
    // export excel
    const heading = [columns.map(c => c.header)];
    //const heading = [header];
    const rowData = rows.map(row => [
      row.original.ta_batchno,
      row.original.ta_date,
      row.original.ta_remark,
      row.original.t_post === '0'
        ? 'Open'
        : row.original.t_post === '1'
        ? 'Posted'
        : 'Deleted',
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
      al_module: 'Adjustment',
      al_action: 'Export to CSV',
      al_record: '',
      al_remark: 'Successful',
    };
    addAuditlog(auditdata);
    // export CSV
    const tableHeaders = columns.map(c => c.header);
    //const rowData = rows.map(row => row.original);
    const rowData = rows.map(row => [
      row.original.ta_batchno,
      row.original.ta_date,
      row.original.ta_remark,
      row.original.t_post === '0'
        ? 'Open'
        : row.original.t_post === '1'
        ? 'Posted'
        : 'Deleted',
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
      al_module: 'Adjustment',
      al_action: 'Export to PDF',
      al_record: '',
      al_remark: 'Successful',
    };
    addAuditlog(auditdata);
    // export pdf

    const tableData = rows.map(row =>
      Object.values([
        row.original.ta_batchno,
        row.original.ta_date,
        row.original.ta_remark,
        row.original.t_post === '0'
          ? 'Open'
          : row.original.t_post === '1'
          ? 'Posted'
          : 'Deleted',
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
              title={title}
              columns={columns}
              data={tranadjust.filter(r => r.ta_post === '0')}
              initialState={{ sorting: [{ id: 'date', desc: true }] }}
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
              title={title}
              columns={columns}
              data={tranadjust.filter(r => r.ta_post === '1')}
              initialState={{ sorting: [{ id: 'date', desc: true }] }}
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
              title={title}
              columns={columns}
              data={tranadjust.filter(r => r.ta_post === 'D')}
              initialState={{ sorting: [{ id: 'date', desc: true }] }}
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
      <Modal opened={isTranOpen} onClose={onTranClose} size="4xl">
        <TransAdjustForm
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
          Are you sure you want to delete this transaction {state.ta_batchno} ?
        </Heading>
      </AlertDialogBox>
    </Flex>
  );
};

export default TransTable;
