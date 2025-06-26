import React, { useState, useEffect, useMemo } from 'react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import {
  MantineReactTable,
  useMantineReactTable,
  showPrintPreview,
} from 'mantine-react-table';
import { Controller, useForm } from 'react-hook-form';
import { useIsFetching } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Toast } from '../helpers/CustomToastify';
import { NumericFormat } from 'react-number-format';
import currency from 'currency.js';
import dayjs from 'dayjs';
import moment from 'moment';
import { differenceInDays, differenceInCalendarMonths } from 'date-fns';
import { format } from 'date-fns';
import {
  AspectRatio,
  Box,
  Button,
  ButtonGroup,
  Center,
  Checkbox,
  Container,
  Divider,
  //Flex,
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Grid,
  GridItem,
  Heading,
  HStack,
  Icon,
  IconButton,
  Image,
  Input,
  InputGroup,
  InputLeftAddon,
  InputLeftElement,
  SimpleGrid,
  Stack,
  StackDivider,
  Text,
  VStack,
  Wrap,
  WrapItem,
  useRadio,
  useRadioGroup,
  useDisclosure,
  useColorMode,
  useColorModeValue,
  useBreakpointValue,
} from '@chakra-ui/react';
import {
  ActionIcon,
  //Button,
  //Center,
  Flex,
  //Text,
  Group,
  Switch,
  Title,
  Tooltip,
  useMantineTheme,
} from '@mantine/core';
import {
  IconEdit,
  IconTrash,
  IconSquarePlus,
  IconDownload,
  IconFileDownload,
  IconSquare,
  IconFilterSearch,
  IconCheckbox,
  IconSquare6Filled,
  IconPrinter,
  IconSelect,
} from '@tabler/icons-react';
import { useRecoilState, useResetRecoilState } from 'recoil';
import { RptState, RptDetlsState, editRptIdState } from '../data/atomdata';
import { useCustomersActive } from '../react-query/customers/useCustomersactive';
import { useReceivable } from '../react-query/receivable/useReceivable';
import { useReceivableByMth } from '../react-query/receivable/useReceivableByMth';
import { useUpdateReceivable } from '../react-query/receivable/useUpdateReceivable';
import { useARMthView } from '../react-query/armthview/useARMthView';
import { useSetup } from '../react-query/setup/useSetup';
//import CustomReactSelectTable from '../helpers/CustomReactSelectTable';
import Export2Excel from '../helpers/Export2Excel';
import Export2PDF from '../helpers/Export2PDF';
import Export2CSV from '../helpers/Export2CSV';

const initial_item = [
  {
    ar_custno: '',
    ar_cust: '',
    ar_branch: '',
    ar_paid: '',
    ar_add1: '',
    ar_add2: '',
    ar_add3: '',
    ar_add4: '',
    ar_area: '',
    ar_bfbal: 0,
  },
];

const initial_totals = {
  lastbfbal: 0,
  unpaidbal: 0,
  totbf: 0,
  totsales: 0,
  totcredit: 0,
  totdebit: 0,
  totreceipt: 0,
  totbfbal: 0,
  totbal: 0,
  balcurr: 0,
  bal30: 0,
  bal60: 0,
  bal90: 0,
  balrept: 0,
  mthcurr: '',
  mth30: '',
  mth60: '',
  mth90: '',
};

const CustomerStatementReport = () => {
  const isFetching = useIsFetching();
  const navigate = useNavigate();
  const { colorScheme } = useMantineTheme();
  const field_width = '150';
  const field_gap = '3';
  const [batch, setBatch] = useState([]);
  const [batchdetls, setBatchdetls] = useState([]);
  const [rptbatch, setRptBatch] = useRecoilState(RptState);
  const [rptbatchdetls, setRptBatchdetls] = useRecoilState(RptDetlsState);
  const [editarrptidstate, setARRptIdState] = useRecoilState(editRptIdState);
  const [state, setState] = useState(initial_item);
  const [statustype, setStatusType] = useState('');
  const [filterText, setFilterText] = React.useState('');
  //const [selectedcustno, setSelectedCustno] = useState('');
  const [paid, setPaid] = useState('');
  const { setup } = useSetup();
  const { customersactive } = useCustomersActive();
  const { receivable, setARCustno } = useReceivable();
  const { receivablebymth, setARPeriod } = useReceivableByMth();
  const updateReceivable = useUpdateReceivable();
  const { armthview, setARMthViewCustno } = useARMthView();
  const [totals, setTotals] = useState(initial_totals);
  const [doctype, setDocType] = useState('All');
  const [rowSelection, setRowSelection] = useState({});
  const [showzerobal, setShowZeroBal] = useState(true);
  const [fromdate, setFromDate] = useState(
    dayjs().date(1).format('YYYY-MM-DD')
  );
  const [todate, setToDate] = useState(dayjs().format('YYYY-MM-DD'));
  const today = Date().toLocaleString();

  // console.log('fromdata', fromdate);
  // console.log('todata', todate);
  // console.log('showzerobal', showzerobal);
  // console.log('rowselectedrow', rowSelection);

  const {
    handleSubmit,
    register,
    control,
    reset,
    setValue,
    getValues,
    formState: { errors, isSubmitting, id },
  } = useForm({
    defaultValues: {
      ...state,
      ...totals,
    },
  });

  console.log('batch', batch);
  //console.log('date', fromdate, todate);
  console.log('totals', totals);

  const {
    isOpen: isCustSearchOpen,
    onOpen: onCustSearchOpen,
    onClose: onCustSearchClose,
  } = useDisclosure();

  const title = 'Customer Statement';
  const comp = setup
    .filter(r => r.s_code === 'company')
    .map(rec => {
      return rec.s_value;
    });
  const add1 = setup
    .filter(r => r.s_code === 'address1')
    .map(rec => {
      return rec.s_value;
    });
  const add2 = setup
    .filter(r => r.s_code === 'address2')
    .map(rec => {
      return rec.s_value;
    });
  const add3 = setup
    .filter(r => r.s_code === 'address3')
    .map(rec => {
      return rec.s_value;
    });
  const columns = useMemo(
    () => [
      {
        header: 'Cust No',
        accessorKey: 'c_custno',
        size: 100,
        mantineTableBodyCellProps: {
          align: 'left',
        },
      },
      {
        header: 'Customer',
        accessorKey: 'c_cust',
        //size: 200,
        mantineTableBodyCellProps: {
          align: 'left',
        },
      },
      {
        header: 'B/F Balance',
        accessorFn: row => row.c_bfbal,
        size: 100,
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
        header: 'Current',
        accessorFn: row => row.c_balcurr,
        size: 100,
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
        header: '31 to 60 Days',
        accessorFn: row => row.c_bal30,
        size: 100,
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
        header: '61 to 90 Days',
        accessorFn: row => row.c_bal60,
        size: 100,
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
        header: 'Over 90 Days',
        accessorFn: row => row.c_bal90,
        size: 100,
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
        header: 'Total Balance',
        accessorFn: row => row.c_totbal,
        size: 100,
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
        header: 'YTD Sales',
        accessorFn: row => row.c_totsales,
        size: 100,
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
    ],
    []
  );

  const mantinetable = useMantineReactTable({
    columns,
    data: batch,
    enableTableHead: true,
    enableRowSelection: true,
    enablePagination: true,
    paginationDisplayMode: 'pages',
    enableSorting: true,
    enableStickyHeader: true,
    enableMultiRowSelection: true,
    enableSelectAll: true,
    onRowSelectionChange: setRowSelection,
    state: { rowSelection },
    getRowId: originalRow => originalRow.c_custno,
    enableTopToolbar: true,

    initialState: { sorting: [{ id: 'c_cust', desc: false, density: 'xs' }] },
    mantineTableHeadCellProps: {
      sx: {
        backgroundColor: 'rgba(52, 210, 235, 0.1)',
        borderRight: '1px solid rgba(224,224,224,1)',
        color: '#fff',
      },
    },
    mantineTableProps: {
      highlightOnHover: true,
      withColumnBorders: true,
      withBorder: colorScheme === 'light',
      sx: {
        'thead > tr': {
          backgroundColor: 'inherit',
        },
        'thead > tr > th': {
          backgroundColor: 'inherit', //#75D6A5
        },
        'tbody > tr > td': {
          backgroundColor: 'inherit',
        },
      },
    },
    renderTopToolbarCustomActions: ({ row, table }) => (
      <Flex gap="md">
        <>
          <Tooltip label="Select All">
            <ActionIcon
              disabled={table.getPrePaginationRowModel().rows.length === 0}
              color="teal"
              onClick={() => handleSelectAllRows(true)}
            >
              <IconCheckbox />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="UnSelect All">
            <ActionIcon
              disabled={table.getPrePaginationRowModel().rows.length === 0}
              color="teal"
              onClick={() => handleSelectAllRows(false)}
            >
              <IconSquare />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="Export CSV">
            <ActionIcon
              disabled={table.getPrePaginationRowModel().rows.length === 0}
              color="teal"
              onClick={() =>
                handleExportCSV(table.getPrePaginationRowModel().rows)
              }
            >
              <IconDownload />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="Export PDF">
            <ActionIcon
              disabled={table.getPrePaginationRowModel().rows.length === 0}
              color="teal"
              onClick={() =>
                handleExportPDF(table.getPrePaginationRowModel().rows)
              }
            >
              <IconFileDownload />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="Export Excel">
            <ActionIcon
              disabled={table.getPrePaginationRowModel().rows.length === 0}
              color="teal"
              onClick={() =>
                handleExportExcel(table.getPrePaginationRowModel().rows)
              }
            >
              <IconFileDownload />
            </ActionIcon>
          </Tooltip>
        </>

        <Center>
          <Title size="md">{title}</Title>
        </Center>
      </Flex>
    ),
    renderEmptyRowsFallback: () => <Text>No data shown</Text>,
  });

  const handleSelectAllRows = state => {
    state
      ? batch.map(rec => {
          setRowSelection(prev => ({
            ...prev,
            [rec.c_custno]: state,
          }));
          return null;
        })
      : setRowSelection([]);
  };

  const handleDateFilter = () => {
    const newFromDate = dayjs(todate).date(1).format('YYYY-MM-DD');
    setFromDate(prev => (prev = newFromDate));
    setValue('fromdate', newFromDate);
    setBatch(prev => (prev = []));
    setBatchdetls(prev => (prev = []));
    handleCalc();
    /*  customers.forEach(rec => {
      handleCalc({
        custno: rec.c_custno,
        cust: rec.c_cust,
        bfbal: rec.c_bfbal,
      });
    }); */
  };

  const handleExit = () => {
    navigate(-1);
  };

  const handleCalc = () => {
    const year = dayjs(todate).year();
    const newFromDate = dayjs(todate).date(1).format('YYYY-MM-DD');
    const yearmth = year + '-01';
    //console.log('year', year, yearmth);
    const mthcurr = dayjs()
      .subtract(
        differenceInCalendarMonths(new Date(today), new Date(todate)),
        'month'
      )
      .format('YYYY-MM');
    const mth30 = dayjs()
      .subtract(
        differenceInCalendarMonths(new Date(today), new Date(todate)) + 1,
        'month'
      )
      .format('YYYY-MM');
    const mth60 = dayjs()
      .subtract(
        differenceInCalendarMonths(new Date(today), new Date(todate)) + 2,
        'month'
      )
      .format('YYYY-MM');
    const mth90 = dayjs()
      .subtract(
        differenceInCalendarMonths(new Date(today), new Date(todate)) + 3,
        'month'
      )
      .format('YYYY-MM');

    console.log('mth', mthcurr, mth30, mth60, mth90);
    //setARPeriod(mthcurr);

    setBatch([]);
    var batchrec = [];
    var batchdetlsrec = [];

    customersactive
      .filter(filter => filter.c_inactive === false)
      .forEach((item, index) => {
        const custno = item.c_custno;
        const cust = item.c_cust;
        const bfbal = item.c_bfbal;

        var totsales = 0,
          totcredit = 0,
          totdebit = 0,
          totreceipt = 0,
          totbal = 0,
          totbf = 0,
          totbfbal = 0,
          balcurr = 0,
          bal30 = 0,
          bal60 = 0,
          bal90 = 0,
          balrept = 0,
          balreptcur = 0,
          lastbfbal = 0,
          unpaidbal = 0;

        balcurr = receivablebymth
          .filter(
            r =>
              r.ar_custno === custno &&
              r.ar_agedate >= moment(newFromDate).format('YYYY-MM-DD') &&
              r.ar_agedate <= moment(todate).format('YYYY-MM-DD')
          )
          .reduce((acc, rec) => {
            switch (rec.ar_doctype) {
              case 'Cash':
                return acc + rec.ar_total;
              case 'Invoice':
                return acc + rec.ar_total;
              /*    case 'Credit':
                   return acc - rec.ar_totalamt; */
              case 'Debit':
                return acc + rec.ar_total;
              /*      case 'Receipt':
                   return acc - rec.ar_totalamt; */
              default:
                return acc;
            }
          }, 0);

        const balcurtmp = receivablebymth.filter(
          r =>
            r.ar_custno === custno &&
            r.ar_agedate >= moment(newFromDate).format('YYYY-MM-DD') &&
            r.ar_agedate <= moment(todate).format('YYYY-MM-DD')
        );

        console.log('mthcurr', custno, newFromDate, todate, balcurtmp);

        bal30 = armthview
          .filter(r => r.ar_custno === custno && r.ar_yearmonth === mth30)
          .reduce((acc, rec) => {
            switch (rec.ar_doctype) {
              case 'Cash':
                return acc + rec.ar_totalamt;
              case 'Invoice':
                return acc + rec.ar_totalamt;
              /*   case 'Credit':
                return acc - rec.ar_totalamt; */
              case 'Debit':
                return acc + rec.ar_totalamt;
              /*    case 'Receipt':
                return acc - rec.ar_totalamt; */
              default:
                return acc;
            }
          }, 0);
        bal60 = armthview
          .filter(r => r.ar_custno === custno && r.ar_yearmonth === mth60)
          .reduce((acc, rec) => {
            switch (rec.ar_doctype) {
              case 'Cash':
                return acc + rec.ar_totalamt;
              case 'Invoice':
                return acc + rec.ar_totalamt;
              /*     case 'Credit':
                return acc - rec.ar_totalamt; */
              case 'Debit':
                return acc + rec.ar_totalamt;
              /*   case 'Receipt':
                return acc - rec.ar_totalamt; */
              default:
                return acc;
            }
          }, 0);
        bal90 = armthview
          .filter(r => r.ar_custno === custno && r.ar_yearmonth <= mth90)
          .reduce((acc, rec) => {
            //console.log('mth90', rec.ar_doctype, rec.ar_totalamt);
            switch (rec.ar_doctype) {
              case 'Cash':
                return acc + rec.ar_totalamt;
              case 'Invoice':
                return acc + rec.ar_totalamt;
              case 'Credit':
                return acc - rec.ar_totalamt;
              case 'Debit':
                return acc + rec.ar_totalamt;
              case 'Receipt':
                return acc - rec.ar_totalamt;
              default:
                return acc;
            }
          }, 0);

        balrept = armthview
          .filter(
            r =>
              r.ar_custno === custno &&
              r.ar_yearmonth > mth90 &&
              r.ar_yearmonth < mthcurr &&
              r.ar_doctype !== 'Invoice' &&
              r.ar_doctype !== 'Cash' &&
              r.ar_doctype !== 'Debit'
          )
          .reduce((acc, rec) => {
            return acc + rec.ar_totalamt;
          }, 0);

        balreptcur = receivable
          .filter(
            r =>
              r.ar_custno === custno &&
              r.ar_agedate >= moment(newFromDate).format('YYYY-MM-DD') &&
              r.ar_agedate <= moment(todate).format('YYYY-MM-DD') &&
              r.ar_doctype !== 'Invoice' &&
              r.ar_doctype !== 'Cash' &&
              r.ar_doctype !== 'Debit'
          )
          .reduce((acc, rec) => {
            return acc + rec.ar_total;
          }, 0);
        /* 
        totsales = armthview
          .filter(
            r =>
              r.ar_custno === custno &&
              r.ar_doctype !== 'Receipt' &&
              r.ar_doctype !== 'Credit' &&
              r.ar_yearmonth >= yearmth &&
              r.ar_yearmonth <= mthcurr
          )
          .reduce((acc, rec) => {
            return acc + rec.ar_totalamt;
          }, 0); */

        totsales = armthview
          .filter(
            r =>
              r.ar_custno === custno &&
              r.ar_yearmonth >= yearmth &&
              r.ar_yearmonth <= mthcurr
          )
          .reduce((acc, rec) => {
            switch (rec.ar_doctype) {
              case 'Cash':
                return acc + rec.ar_totalamt;
              case 'Invoice':
                return acc + rec.ar_totalamt;
              case 'Credit':
                return acc - rec.ar_totalamt;
              case 'Debit':
                return acc + rec.ar_totalamt;
              /*   case 'Receipt':
                return acc - rec.ar_totalamt; */
              default:
                return acc;
            }
          }, 0);

        //console.log('totsales', totsales);
        //apply receipt
        //console.log('bal', bal30, bal60, bal90);
        let rept = balrept;
        bal90 = bal90 + bfbal;
        if (bal90 >= rept) {
          bal90 = bal90 - rept;
        } else {
          rept = rept - bal90;
          bal90 = 0;
          console.log('bal90 rept', bal90, rept);
          if (bal60 >= rept) {
            bal60 = bal60 - rept;
          } else {
            rept = rept - bal60;
            bal60 = 0;
            console.log('bal60 rept', bal60, rept);
            if (bal30 >= rept) {
              bal30 = bal30 - rept;
            } else {
              rept = rept - bal30;
              bal30 = 0;
              console.log('bal30 rept', bal30, rept);
              balcurr = balcurr - rept;
            }
          }
        }
        //console.log('bal90', bal30, bal60, bal90);

        totbfbal = totsales + totdebit - totcredit - totreceipt;
        lastbfbal = bal90 + bal60 + bal30;
        totbal = lastbfbal + balcurr - balreptcur;

        setTotals(
          prev =>
            (prev = {
              ...prev,
              totbf: totbf,
              totbfbal: totbfbal,
              totsales: totsales,
              totcredit: totcredit,
              totdebit: totdebit,
              totreceipt: totreceipt,
              balcurr: balcurr,
              bal30: bal30,
              bal60: bal60,
              bal90: bal90,
              totbal: totbal,
              balrept: balrept,
              balreptcur: balreptcur,
              lastbfbal: lastbfbal,
              unpaidbal: unpaidbal,
            })
        );
        const newRec = {
          c_custno: custno,
          c_cust: cust,
          c_bfbal: bfbal,
          c_balcurr: balcurr,
          c_bal30: bal30,
          c_bal60: bal60,
          c_bal90: bal90,
          c_totbal: totbal,
          c_totsales: totsales,
        };

        batchrec.push(newRec);
        //batchdetls
        const newRecDetls = receivablebymth.filter(item => {
          return (
            item.ar_custno === custno &&
            item.ar_date >= moment(newFromDate).format('YYYY-MM-DD') &&
            item.ar_date <= moment(todate).format('YYYY-MM-DD')
          );
        });
        if (newRecDetls.length > 0) {
          batchdetlsrec.push(newRecDetls);
        }
      });
    console.log('batchrec', batchrec);
    console.log('batchdetlsrec', batchdetlsrec);
    setBatch(batchrec);
    setBatchdetls(batchdetlsrec);
  };

  const handleMthPeriod = () => {
    const newFromDate = dayjs(todate).date(1).format('YYYY-MM-DD');
    setFromDate(prev => (prev = newFromDate));
    setValue('fromdate', newFromDate);
    const mthcurr = dayjs()
      .subtract(
        differenceInCalendarMonths(new Date(today), new Date(todate)),
        'month'
      )
      .format('YYYY-MM');
    const mth30 = dayjs()
      .subtract(
        differenceInCalendarMonths(new Date(today), new Date(todate)) + 1,
        'month'
      )
      .format('YYYY-MM');
    const mth60 = dayjs()
      .subtract(
        differenceInCalendarMonths(new Date(today), new Date(todate)) + 2,
        'month'
      )
      .format('YYYY-MM');
    const mth90 = dayjs()
      .subtract(
        differenceInCalendarMonths(new Date(today), new Date(todate)) + 3,
        'month'
      )
      .format('YYYY-MM');

    setARPeriod(mthcurr);

    setTotals(
      prev =>
        (prev = {
          ...prev,
          mthcurr: mthcurr,
          mth30: mth30,
          mth60: mth60,
          mth90: mth90,
        })
    );
  };

  const handleStatement = () => {
    let count = Object.keys(rowSelection).length;
    console.log('submit', rowSelection, count);
    //console.log("count", count);
    if (count === 0) {
      Toast({
        title: `No customer being selected!`,
        status: 'warning',
      });
      return null;
    }
    const batchdata = batch.filter(r =>
      Object.keys(rowSelection).find(key => key === r.c_custno)
    );
    const batchdetlsdata = receivablebymth.filter(r =>
      Object.keys(rowSelection).find(key => key === r.ar_custno)
    );
    console.log('new data', batchdata);
    setRptBatch(batchdata);
    setRptBatchdetls(batchdetlsdata);
    setARRptIdState(
      prev =>
        (prev = {
          ...editarrptidstate,
          no: '',
          totals: 0,
          fromdate: fromdate,
          todate: todate,
        })
    );
    navigate('/customerstatementrptprint');
  };

  const handleSummary = () => {
    let count = Object.keys(rowSelection).length;
    console.log('submit', rowSelection, count);
    //console.log("count", count);
    if (count === 0) {
      Toast({
        title: `No customer being selected!`,
        status: 'warning',
      });
      return null;
    }
    const batchdata = batch.filter(r =>
      Object.keys(rowSelection).find(key => key === r.c_custno)
    );
    const totals = batchdata.reduce((acc, rec) => {
      return acc + rec.c_totsales;
    }, 0);
    const baltotals = batchdata.reduce((acc, rec) => {
      return acc + rec.c_totbal;
    }, 0);

    console.log('grand totals', totals, baltotals);
    setRptBatch(batchdata);
    setARRptIdState(
      prev =>
        (prev = {
          ...editarrptidstate,
          no: '',
          baltotals: baltotals,
          totals: totals,
          fromdate: fromdate,
          todate: todate,
        })
    );
    navigate('/customerstatementsummaryprint');
  };

  const handleSelectNonZero = state => {
    state
      ? batch.map(rec => {
          if (rec.c_totbal > 0) {
            setRowSelection(prev => ({
              ...prev,
              [rec.c_custno]: state,
            }));
          }

          return null;
        })
      : setRowSelection([]);
  };

  const handleExportExcel = rows => {
    const heading = [columns.map(c => c.header)];
    //const heading = [header];
    const rowData = rows.map(row => [
      row.original.c_custno,
      row.original.c_cust,
      row.original.c_bfbal,
      row.original.c_balcurr,
      row.original.c_bal30,
      row.original.c_bal60,
      row.original.c_bal90,
      row.original.c_totbal,
      row.original.c_totsales,
    ]);
    const colWidths = [
      { wch: 15 },
      { wch: 30 },
      { wch: 25 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
    ];
    Export2Excel({ heading, rowData, colWidths, title });
  };

  const handleExportCSV = rows => {
    const tableHeaders = columns.map(c => c.header);
    //const rowData = rows.map(row => row.original);
    const rowData = rows.map(row => [
      row.original.c_custno,
      row.original.c_cust,
      row.original.c_bfbal,
      row.original.c_balcurr,
      row.original.c_bal30,
      row.original.c_bal60,
      row.original.c_bal90,
      row.original.c_totbal,
      row.original.c_totsales,
    ]);
    Export2CSV({ rowData, title });
  };

  const handleExportPDF = rows => {
    const tableData = rows.map(row =>
      Object.values([
        row.original.c_custno,
        row.original.c_cust,
        row.original.c_bfbal,
        row.original.c_balcurr,
        row.original.c_bal30,
        row.original.c_bal60,
        row.original.c_bal90,
        row.original.c_totbal,
        row.original.c_totsales,
      ])
    );

    //console.log('tabledata', tableData);
    const tableHeaders = columns.map(c => c.header);

    Export2PDF({
      tableHeaders: tableHeaders,
      tableData: tableData,
      title: title,
      layout: 'l',
    });
  };

  useEffect(() => {
    //handleMthPeriod();
    setARPeriod(dayjs(todate).format('YYYY-MM'));
  }, [todate]);

  return (
    <Flex p={5}>
      <Box
        width="100%"
        borderWidth={1}
        borderRadius={15}
        borderColor="teal.800"
        overflow="auto"
      >
        <Grid
          templateColumns={'repeat(12,1fr)'}
          //templateRows="7"
          columnGap={3}
          rowGap={3}
          px={5}
          py={2}
          w={{ base: 'auto', md: 'full', lg: 'full' }}
          border="1px solid teal.100"
          borderRadius="5"
        >
          {/* <HStack> */}
          <GridItem colSpan={2} mt={17}>
            <Center>
              <Heading size="md">Customer Statements Report</Heading>
            </Center>
          </GridItem>
          {/*  <GridItem colSpan={1}>
            <VStack align="left">
              <Text as="b" fontSize="sm" textAlign="left">
                From Date
              </Text>
              <Input
                name="fromdate"
                value={fromdate}
                type="date"
                //width="full"
                onChange={e => {
                  setFromDate(e.target.value);
                }}
                borderColor="gray.400"
              />
            </VStack>
          </GridItem> */}
          <GridItem colSpan={2}>
            <VStack align="left">
              {/* <FormLabel>Description</FormLabel> */}
              <Text as="b" fontSize="sm" textAlign="left" w={200}>
                Statement Date
              </Text>
              <HStack>
                <Input
                  name="todate"
                  value={todate}
                  type="date"
                  //width="full"
                  onChange={e => {
                    setToDate(e.target.value);
                  }}
                  borderColor="gray.400"
                  //textTransform="capitalize"
                  //ref={ref}
                  //placeholder="customer name"
                  //minWidth="100"
                />
                <IconButton
                  colorScheme="teal"
                  size="md"
                  icon={<IconFilterSearch />}
                  onClick={handleDateFilter}
                  variant={'outline'}
                  isDisabled={isFetching}
                  h={35}
                  w={35}
                />
              </HStack>
            </VStack>
          </GridItem>
          <GridItem colSpan={6}>
            <HStack pt={6} align="center">
              <Group align="center">
                {/* <Box>
                  <Switch
                    name="showzerobal"
                    value={showzerobal || false}
                    label={
                      <Heading size="sm" pt={2}>
                        Show Zero Balance
                      </Heading>
                    }
                    onLabel="ON"
                    offLabel="OFF"
                    size="xl"
                    precision={2}
                    checked={showzerobal}
                    width="full"
                    onChange={e => {
                      setShowZeroBal(e.target.checked);
                    }}
                    //borderColor="gray.400"
                    //textTransform="capitalize"
                    //ref={ref}
                    //placeholder="price"
                    //disabled={editSampleId.status === 'edit'}
                  />
                </Box> */}
                <Button
                  leftIcon={<IconSelect />}
                  colorScheme="teal"
                  onClick={handleSelectNonZero}
                  variant={'outline'}
                  isDisabled={isFetching}
                  size="lg"
                >
                  Select Non-zero Balance
                </Button>
                <Button
                  leftIcon={<IconPrinter />}
                  colorScheme="teal"
                  onClick={handleStatement}
                  variant={'outline'}
                  isDisabled={isFetching}
                  size="lg"
                >
                  Statement
                </Button>
                <Button
                  leftIcon={<IconPrinter />}
                  colorScheme="teal"
                  onClick={handleSummary}
                  variant={'outline'}
                  isDisabled={isFetching}
                  size="lg"
                >
                  Summary
                </Button>
              </Group>
            </HStack>
          </GridItem>
          {/* </HStack> */}
          <GridItem colSpan={12}>
            <Divider border="2px solid teal" />
          </GridItem>
          <GridItem colSpan={12}>
            <MantineReactTable table={mantinetable} />
            {/*  <CustomReactSelectTable
              title={title}
              columns={columns}
              data={batch}
              rowSelection={rowSelection}
              setRowSelection={setRowSelection}
              handleSelectAllRows={handleSelectAllRows}
              handleExportPDF={handleExportPDF}
              handleExportCSV={handleExportCSV}
              handleExportExcel={handleExportExcel}
            /> */}
          </GridItem>
        </Grid>
      </Box>
    </Flex>
  );
};

export default CustomerStatementReport;
