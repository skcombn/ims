import React, { useState, useMemo } from 'react';
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
} from '@chakra-ui/react';
import dayjs from 'dayjs';
import { formatNumber, formatCurrency } from '../helpers/utils';
import { AiFillEdit, AiFillDelete } from 'react-icons/ai';
import { AlertDialogBox } from '../helpers/AlertDialogBox';
import { useCustomers } from '../react-query/customers/useCustomers';
import { useAddCustomer } from '../react-query/customers/useAddCustomer';
import { useUpdateCustomer } from '../react-query/customers/useUpdateCustomer';
import { useDeleteCustomer } from '../react-query/customers/useDeleteCustomer';
import { useAddAuditlog } from '../react-query/auditlog/useAddAuditlog';
import GetLocalUser from '../helpers/GetLocalUser';
import CustomReactTable from '../helpers/CustomReactTable';
import CustomerForm from './CustomerForm';
import Export2Excel from '../helpers/Export2Excel';
import Export2PDF from '../helpers/Export2PDF';
import Export2CSV from '../helpers/Export2CSV';

const initial_cust = {
  c_custno: '',
  c_cust: '',
  c_add1: '',
  c_add2: '',
  c_add3: '',
  c_add4: '',
  c_phone: '',
  c_fax: '',
  c_email: '',
  c_crlimit: 0,
  c_terms: 0,
  c_contact: '',
  c_post: '',
  c_glcode: '',
  c_branch: '',
  c_area: '',
  c_type: '',
};

const CustomersTable = () => {
  const { customers } = useCustomers();
  const addCustomer = useAddCustomer();
  const updateCustomer = useUpdateCustomer();
  const deleteCustomer = useDeleteCustomer();
  const addAuditlog = useAddAuditlog();
  const localuser = GetLocalUser();
  const [state, setState] = useState({});
  const [statustype, setStatusType] = useState('');
  const [filterText, setFilterText] = useState('');

  const filteredData = customers.filter(
    item =>
      item.c_cust &&
      item.c_cust.toLowerCase().includes(filterText.toLowerCase())
  );

  const {
    isOpen: isAlertDeleteOpen,
    onOpen: onAlertDeleteOpen,
    onClose: onAlertDeleteClose,
  } = useDisclosure();

  const {
    isOpen: isCustOpen,
    onOpen: onCustOpen,
    onClose: onCustClose,
  } = useDisclosure();

  const title = 'Customers';

  const columns = useMemo(
    () => [
      {
        header: 'Cust No',
        accessorFn: row => row.c_custno,
        size: 120,
        mantineTableBodyCellProps: {
          align: 'left',
        },
      },
      {
        header: 'Customer',
        accessorFn: row => row.c_cust,
        size: 200,
        mantineTableBodyCellProps: {
          align: 'left',
        },
        cell: row => (
          <div style={{ overflow: 'hidden', textAlign: 'left' }}>
            {row.c_cust}
          </div>
        ),
      },

      {
        header: 'Phone',
        accessorFn: row => row.c_phone,
        size: 120,
        mantineTableBodyCellProps: {
          align: 'left',
        },
      },
      {
        header: 'Email',
        accessorFn: row => row.c_email,
        size: 120,
        mantineTableBodyCellProps: {
          align: 'left',
        },
      },
      {
        header: 'Fax',
        accessorFn: row => row.c_fax,
        size: 120,
        mantineTableBodyCellProps: {
          align: 'left',
        },
      },
      {
        header: 'Contact',
        accessorFn: row => row.c_contact,
        size: 120,
        mantineTableBodyCellProps: {
          align: 'left',
        },
      },
    ],
    []
  );

  const handleOnDeleteConfirm = () => {
    //add to auditlog
    const auditdata = {
      al_userid: localuser.userid,
      al_user: localuser.name,
      al_date: dayjs().format('YYYY-MM-DD'),
      al_time: dayjs().format('HHmmss'),
      al_timestr: dayjs().format('HH:mm:ss'),
      al_module: 'Customers',
      al_action: 'Delete',
      al_record: state.c_custno,
      al_remark: 'Successful',
    };
    addAuditlog(auditdata);
    // delete item
    deleteCustomer(state);
  };

  const handleAddCust = () => {
    setStatusType(prev => (prev = 'add'));
    const data = { ...initial_cust };
    setState(data);
    onCustOpen();
  };

  const handleEditCust = row => {
    const { original } = row;
    setStatusType(prev => (prev = 'edit'));
    setState(prev => original);
    onCustOpen();
  };

  const handleDeleteCust = row => {
    const { original } = row;
    setState(prev => original);
    onAlertDeleteOpen();
  };

  const add_Cust = data => {
    addCustomer(data);
  };

  const update_Cust = data => {
    updateCustomer(data);
    onCustClose();
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
      row.original.c_custno,
      row.original.c_cust,
      row.original.c_phone,
      row.original.c_email,
      row.original.c_fax,
      row.original.c_contact,
    ]);
    const colWidths = [
      { wch: 15 },
      { wch: 30 },
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
      row.original.c_custno,
      row.original.c_cust,
      row.original.c_phone,
      row.original.c_email,
      row.original.c_fax,
      row.original.c_contact,
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
        row.original.c_custno,
        row.original.c_cust,
        row.original.c_phone,
        row.original.c_email,
        row.original.c_fax,
        row.original.c_contact,
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
        borderColor="teal.800"
        borderRadius={10}
        overflow="scroll"
      >
        <CustomReactTable
          title={title}
          columns={columns}
          data={customers}
          handleAdd={handleAddCust}
          handleEdit={handleEditCust}
          handleDelete={handleDeleteCust}
          handleExportPDF={handleExportPDF}
          handleExportCSV={handleExportCSV}
          handleExportExcel={handleExportExcel}
        />
      </Box>
      <Modal
        closeOnOverlayClick={false}
        isOpen={isCustOpen}
        onClose={onCustClose}
        size="4xl"
      >
        <ModalOverlay />
        <ModalContent>
          {/* <ModalHeader>Product Form</ModalHeader> */}
          <ModalCloseButton />
          <ModalBody>
            <CustomerForm
              state={state}
              setState={setState}
              add_Cust={add_Cust}
              update_Cust={update_Cust}
              statustype={statustype}
              onCustClose={onCustClose}
            />
          </ModalBody>

          {/* <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onProductClose}>
              Close
              </Button>
          </ModalFooter> */}
        </ModalContent>
      </Modal>
      <AlertDialogBox
        onClose={onAlertDeleteClose}
        onConfirm={handleOnDeleteConfirm}
        isOpen={isAlertDeleteOpen}
        title="Delete Customer"
      >
        <Heading size="md">
          Are you sure you want to delete this customer {state.c_cust}{' '}
          {state.ar_cust} ?
        </Heading>
      </AlertDialogBox>
    </Flex>
  );
};

export default CustomersTable;
