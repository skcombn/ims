import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { formatNumber, formatCurrency } from '../helpers/utils';
import {
  Box,
  Flex,
  Heading,
  IconButton,
  useDisclosure,
} from '@chakra-ui/react';
import { Modal, NumberInput } from '@mantine/core';
import { useRecoilState } from 'recoil';
import {
  itemState,
  // itemAttachmentState,
  editItemIdState,
} from '../data/atomdata';
//import { AiFillEdit, AiFillDelete } from 'react-icons/ai';
import { BiEditAlt } from 'react-icons/bi';
import { MdDelete } from 'react-icons/md';
//import { DeleteIcon, EditIcon } from '@chakra-ui/icons';
import { AlertDialogBox } from '../helpers/AlertDialogBox';
import { useItems } from '../react-query/items/useItems';
import { useAddItem } from '../react-query/items/useAddItem';
import { useUpdateItem } from '../react-query/items/useUpdateItem';
import { useDeleteItem } from '../react-query/items/useDeleteItem';
import { useItemsHistory } from '../react-query/itemshistory/useItemsHistory';
import { useDeleteItemsHistory } from '../react-query/itemshistory/useDeteteItemsHistory';
import { useItemsExpiry } from '../react-query/itemsexpiry/useItemsExpiry';
import { useDeleteItemExpiry } from '../react-query/itemsexpiry/useDeleteItemExpiry';
import { useAddAuditlog } from '../react-query/auditlog/useAddAuditlog';
import GetLocalUser from '../helpers/GetLocalUser';
import CustomReactTable from '../helpers/CustomReactTable';
import ItemForm from './ItemForm';
import Export2Excel from '../helpers/Export2Excel';
import Export2PDF from '../helpers/Export2PDF';
import Export2CSV from '../helpers/Export2CSV';

const initial_item = {
  item_no: '',
  item_desp: '',
  item_pack: '',
  item_group: '',
  item_unit: '',
  item_price: 0,
  item_cost: 0,
  item_qtyonhand: 0,
  item_minlvl: 0,
  item_pfactor: 9,
  item_brand: '',
  item_manufacturer: '',
  item_lotno: '',
  item_grade: '',
  item_location: '',
  item_condition: '',
  item_size: '',
  item_suppno: '',
  item_supplier: '',
  item_type: '',
  item_trackexpiry: false,
  item_trackserial: false,
  item_datereceived: dayjs().format('YYYY-MM-DD'),
  item_remark: '',
  item_productno: '',
  item_inactive: false,
  item_cat: '',
};

const ItemsTable = ({ type }) => {
  let navigate = useNavigate();
  const { items } = useItems();
  const addItem = useAddItem();
  const updateItem = useUpdateItem();
  const deleteItem = useDeleteItem();
  const { itemshistory, setItemHistId } = useItemsHistory();
  const deleteItemsHistory = useDeleteItemsHistory();
  const { itemsexpiry, setItemExpId } = useItemsExpiry();
  const deleteItemExpiry = useDeleteItemExpiry();
  const addAuditlog = useAddAuditlog();
  const localuser = GetLocalUser();
  const [state, setState] = useRecoilState(itemState);
  //const [statustype, setStatusType] = useState('');
  // const [attachments, setAttachments] = useRecoilState(itemAttachmentState);
  const [editItemId, setEditItemId] = useRecoilState(editItemIdState);

  const {
    isOpen: isAlertDeleteOpen,
    onOpen: onAlertDeleteOpen,
    onClose: onAlertDeleteClose,
  } = useDisclosure();

  const {
    isOpen: isItemOpen,
    onOpen: onItemOpen,
    onClose: onItemClose,
  } = useDisclosure();

  const title = type ? `${type}` : 'Items';

  const columns = useMemo(
    () => [
      {
        header: 'Item No',
        accessorKey: 'item_no',
        //size: 200,
        mantineTableBodyCellProps: {
          align: 'left',
        },
      },
      {
        header: 'Description',
        accessorKey: 'item_desp',
        //size: 200,
        mantineTableBodyCellProps: {
          align: 'left',
        },
      },
      {
        header: 'Packing',
        accessorKey: 'item_pack',
        //size: 200,
        mantineTableBodyCellProps: {
          align: 'left',
        },
      },
      {
        header: 'U/Cost',
        accessorFn: row => row.item_cost,
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
        header: 'U/Price',
        accessorFn: row => row.item_price,
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
        header: 'Qth Onhand',
        accessorFn: row => row.item_qtyonhand || 0,
        Cell: ({ cell }) =>
          cell.getValue()?.toLocaleString?.('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }),
        mantineTableBodyCellProps: ({ cell, row }) => ({}),
      },
      {
        header: 'Unit',
        accessorKey: 'item_unit',
        size: 50,
        mantineTableBodyCellProps: {
          align: 'left',
        },
      },
      {
        header: 'Min Level',
        accessorFn: row => row.item_minlvl,
        Cell: ({ cell }) =>
          cell.getValue()?.toLocaleString?.('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }),
        //size: 120,
        mantineTableBodyCellProps: {
          align: 'right',
        },
      },

      /*  {
        header: "Supplier",
        accessorFn: (row) => row.item_manufacturer,
        //size: 200,
        mantineTableBodyCellProps: {
          align: "left",
        },
      }, */
      {
        header: 'Category No',
        accessorFn: row => row.item_cat,
        //size: 200,
        mantineTableBodyCellProps: {
          align: 'left',
        },
      },

      {
        header: 'Inactive',
        accessorFn: row => row.item_inactive,
        Cell: ({ value, row }) => (
          <input
            type="checkbox"
            checked={row.original.item_inactive}
            readOnly
          />
        ),
        //size: 200,
        mantineTableBodyCellProps: {
          align: 'left',
        },
      },
    ],
    []
  );

  const handleOnDeleteConfirm = () => {
    const { id } = state;
    //add to auditlog
    const auditdata = {
      al_userid: localuser.userid,
      al_user: localuser.name,
      al_date: dayjs().format('YYYY-MM-DD'),
      al_time: dayjs().format('HHmmss'),
      al_timestr: dayjs().format('HH:mm:ss'),
      al_module: 'Items',
      al_action: 'Delete',
      al_record: state.item_no,
      al_remark: 'Successful',
    };
    addAuditlog(auditdata);
    // delete item
    deleteItem(state);
    //delete item history
    itemshistory &&
      itemshistory
        .filter(r => r.it_itemno === state.item_no)
        .forEach(rec => {
          const { id } = rec;
          deleteItemsHistory(rec);
        });
    //delete item expiry
    itemsexpiry &&
      itemsexpiry
        .filter(r => r.ie_itemno === state.item_no)
        .forEach(rec => {
          const { id } = rec;
          deleteItemExpiry(rec);
        });
  };

  const handleAddItem = () => {
    setEditItemId(
      prev =>
        (prev = {
          id: '',
          batchno: '',
          layout: '',
          type: type,
          status: 'add',
        })
    );
    const data = { ...initial_item, item_type: type };
    // setAttachments((prev) => []);
    setState(data);

    navigate('/item');
    //onItemOpen(true);
  };

  const handleEditItem = row => {
    const { original } = row;
    const { item_id, item_no } = original;
    setEditItemId(
      prev => (prev = { id: item_id, no: item_no, type: type, status: 'edit' })
    );
    setState(prev => original);
    /*  setAttachments(
      (prev) =>
        (prev = itemsattachments.filter(
          (r) => r.ia_itemno === original.item_no
        ))
    ); */
    //onItemOpen(true);
    navigate('/item');
  };

  const handleDeleteItem = row => {
    const { original } = row;
    setState(prev => original);
    onAlertDeleteOpen();
  };

  const handleDeleteAttachment = rowData => {
    setState(prev => (prev = { ...rowData }));
    //onAlertDeleteAttachmentOpen();
  };

  const handleOnDeleteAttachmentConfirm = () => {
    //deleteItemAttachment(state);
  };
  const add_Item = data => {
    //console.log('add', data);
    addItem(data);

    /*  attachments.forEach((rec) => {
      const { ia_id, ...fields } = rec;
      addItemAttachment({ ...fields, ia_itemno: data.item_no });
    }); */
  };

  const update_Item = data => {
    updateItem(data);
    //delete attachments
    /*  itemsattachments
      .filter((r) => r.ia_itemno === data.item_no)
      .forEach((rec) => {
        deleteItemAttachment({ ...rec });
      }); */
    /*   attachments.forEach((rec) => {
      const { ia_id, ...fields } = rec;
      addItemAttachment(fields);
    }); */
  };

  const add_ItemAttachment = data => {
    //addItemAttachment(data);
  };

  const handleExportExcel = rows => {
    // add auditlog
    const auditdata = {
      al_userid: localuser.userid,
      al_user: localuser.name,
      al_date: dayjs().format('YYYY-MM-DD'),
      al_time: dayjs().format('HHmmss'),
      al_timestr: dayjs().format('HH:mm:ss'),
      al_module: 'Items',
      al_action: 'Export to Excel',
      al_record: '',
      al_remark: 'Successful',
    };
    addAuditlog(auditdata);
    const heading = [columns.map(c => c.header)];
    //const heading = [header];
    const rowData = rows.map(row => [
      row.original.item_no,
      row.original.item_desp,
      row.original.item_pack,
      formatCurrency(row.original.item_cost),
      formatCurrency(row.original.item_price),
      formatNumber(row.original.item_qtyonhand),
      row.original.item_unit,
      formatNumber(row.original.item_minlvl),
      row.original.item_cat,
      row.original.item_inactive,
    ]);
    const colWidths = [
      { wch: 15 },
      { wch: 30 },
      { wch: 30 },
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
      al_module: 'Items',
      al_action: 'Export to CSV',
      al_record: '',
      al_remark: 'Successful',
    };
    addAuditlog(auditdata);
    const tableHeaders = columns.map(c => c.header);
    //const rowData = rows.map(row => row.original);
    const rowData = rows.map(row => [
      row.original.item_no,
      row.original.item_desp,
      row.original.item_pack,
      formatCurrency(row.original.item_cost),
      formatCurrency(row.original.item_price),
      formatNumber(row.original.item_qtyonhand),
      row.original.item_unit,
      formatNumber(row.original.item_minlvl),
      row.original.item_cat,
      row.original.item_inactive,
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
      al_module: 'Items',
      al_action: 'Export to PDF',
      al_record: '',
      al_remark: 'Successful',
    };
    addAuditlog(auditdata);

    const tableData = rows.map(row =>
      Object.values([
        row.original.item_no,
        row.original.item_desp,
        row.original.item_pack,
        formatCurrency(row.original.item_cost),
        formatCurrency(row.original.item_price),
        formatNumber(row.original.item_qtyonhand),
        row.original.item_unit,
        formatNumber(row.original.item_minlvl),
        row.original.item_cat,
        row.original.item_inactive,
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
        width="98%"
        borderWidth={1}
        borderColor="teal.800"
        borderRadius={10}
        overflow="scroll"
      >
        <CustomReactTable
          title={title}
          columns={columns}
          data={items}
          initialState={{ sorting: [{ id: 'item_no', desc: false }] }}
          handleAdd={handleAddItem}
          handleEdit={handleEditItem}
          handleDelete={handleDeleteItem}
          handleExportPDF={handleExportPDF}
          handleExportCSV={handleExportCSV}
          handleExportExcel={handleExportExcel}
        />
      </Box>
      <Modal opened={isItemOpen} onClose={onItemClose} size="xl">
        <ItemForm
          type={type}
          state={state}
          setState={setState}
          add_Item={add_Item}
          update_Item={update_Item}
          //statustype={statustype}
          onItemClose={onItemClose}
        />
      </Modal>
      <AlertDialogBox
        onClose={onAlertDeleteClose}
        onConfirm={handleOnDeleteConfirm}
        isOpen={isAlertDeleteOpen}
        title="Delete Item"
      >
        <Heading size="md">
          Are you sure you want to delete this item {state.ic_stkno}{' '}
          {state.item_desp} ?
        </Heading>
      </AlertDialogBox>
      {/*   <AlertDialogBox
        onClose={onAlertDeleteAttachmentClose}
        onConfirm={handleOnDeleteAttachmentConfirm}
        isOpen={isAlertDeleteAttachmentOpen}
        title="Delete Item Attachment"
      >
        <Heading size="md">
          Are you sure you want to delete this item attachment{state.ia_name} ?
        </Heading>
      </AlertDialogBox> */}
    </Flex>
  );
};

export default ItemsTable;
