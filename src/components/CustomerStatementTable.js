import React, { useState, useEffect, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useIsFetching } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { NumericFormat } from 'react-number-format';
import currency from 'currency.js';
import dayjs from 'dayjs';
import moment from 'moment';
import { differenceInDays, differenceInCalendarMonths } from 'date-fns';
//import _ from 'lodash';
import { format } from 'date-fns';
import { useCustomToast } from '../helpers/useCustomToast';
import {
  AspectRatio,
  Box,
  Button,
  ButtonGroup,
  Center,
  Checkbox,
  Container,
  Divider,
  Flex,
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
  IconArrowBackUp,
  IconPrinter,
  IconSearch,
  IconDeviceFloppy,
  IconDoorExit,
  IconFilterSearch,
  IconFilterExclamation,
  IconSend,
  IconSquare,
  IconSquareCheck,
} from '@tabler/icons-react';
import { Modal, NumberInput, Radio, Select, Switch, Tabs } from '@mantine/core';
import { useRecoilState } from 'recoil';
import {
  arStatementState,
  arStatementDetlsState,
  editARStatementIdState,
} from '../data/atomdata';
//import { SearchIcon } from '@chakra-ui/icons';
//import { TiArrowBack, TiPrinter } from 'react-icons/ti';
//import { ImExit } from 'react-icons/im';
//import { GrCheckbox, GrCheckboxSelected } from 'react-icons/gr';
import { useCustomers } from '../react-query/customers/useCustomers';
import { useReceivable } from '../react-query/receivable/useReceivable';
import { useUpdateReceivable } from '../react-query/receivable/useUpdateReceivable';
import { useARMthView } from '../react-query/armthview/useARMthView';
import CustomReactTable from '../helpers/CustomReactTable';
import CustomerSearchTable from './CustomerSearchTable';

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

const CustomerStatementTable = () => {
  const isFetching = useIsFetching();
  const navigate = useNavigate();
  const field_width = '150';
  const field_gap = '3';
  const [batch, setBatch] = useRecoilState(arStatementState);
  const [batchdetls, setBatchdetls] = useRecoilState(arStatementDetlsState);
  const [editaridstate, setARIdState] = useRecoilState(editARStatementIdState);
  const [state, setState] = useState(initial_item);
  const [statustype, setStatusType] = useState('');
  const [filterText, setFilterText] = React.useState('');
  const [selectedcustno, setSelectedCustno] = useState('');
  const [paid, setPaid] = useState('');
  const { customers } = useCustomers();
  const { receivable, setARCustno } = useReceivable();
  const updateReceivable = useUpdateReceivable();
  const { armthview, setARMthViewCustno } = useARMthView();
  const [totals, setTotals] = useState(initial_totals);
  const [doctype, setDocType] = useState('All');
  const [fromdate, setFromDate] = useState(
    dayjs().date(1).format('YYYY-MM-DD')
  );
  const [todate, setToDate] = useState(dayjs().format('YYYY-MM-DD'));
  const [toLoad, setToLoad] = useState(false);
  const today = Date().toLocaleString();

  const daydiff = differenceInCalendarMonths(new Date(today), new Date(todate));

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

  //console.log('batch', batch);
  //console.log('date', fromdate, todate);
  //console.log('totals', totals);

  const {
    isOpen: isCustSearchOpen,
    onOpen: onCustSearchOpen,
    onClose: onCustSearchClose,
  } = useDisclosure();

  const title = 'Customer Statement';

  const columns = useMemo(
    () => [
      {
        header: 'Document No',
        accessorFn: row => row.ar_docno,
        size: 120,
        mantineTableBodyCellProps: {
          align: 'left',
        },
      },
      {
        id: 'ar_date',
        header: 'Document Date',
        accessorFn: row => {
          const tDay = new Date(row.ar_date);
          tDay.setHours(0, 0, 0, 0); // remove time from date
          return tDay;
        },
        Cell: ({ cell }) =>
          dayjs(cell.getValue().toLocaleDateString()).format('DD-MMM-YYYY'),

        //size: 100,
        mantineTableBodyCellProps: {
          align: 'left',
        },
      },
      {
        header: 'Type',
        accessorFn: row => row.ar_doctype,
        size: 120,
        mantineTableBodyCellProps: {
          align: 'left',
        },
      },
      {
        header: 'Reference',
        accessorFn: row => row.ar_refno,
        //size: 120,
        mantineTableBodyCellProps: {
          align: 'left',
        },
      },
      {
        header: 'Cust No',
        accessorFn: row => row.ar_custno,
        size: 120,
        mantineTableBodyCellProps: {
          align: 'left',
        },
      },
      /*   {
        header: 'Customer',
        accessorFn: row => row.ar_cust,
        //size: 120,
        mantineTableBodyCellProps: {
          align: 'left',
        },
      }, */

      {
        header: 'Debit',
        accessorFn: row => row.ar_total,
        size: 120,
        Cell: ({ cell }) =>
          cell.getValue()?.toLocaleString?.('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }),

        mantineTableBodyCellProps: ({ cell, row }) => ({
          sx: {
            color:
              row.original.ar_doctype === 'Receipt'
                ? 'white'
                : row.original.ar_doctype === 'Credit'
                ? 'white'
                : 'black',
          },
          align: 'right',
        }),
      },
      {
        header: 'Credit',
        accessorFn: row => row.ar_total,
        size: 120,
        Cell: ({ cell }) =>
          cell.getValue()?.toLocaleString?.('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }),
        mantineTableBodyCellProps: ({ cell, row }) => ({
          sx: {
            color:
              row.original.ar_doctype === 'Invoice'
                ? 'white'
                : row.original.ar_doctype === 'Cash'
                ? 'white'
                : row.original.ar_doctype === 'Debit'
                ? 'white'
                : 'black',
          },
          align: 'right',
        }),
      },
      /*  {
        header: 'Paid',
        accessorFn: row => {
          return row.ar_paid ? (
            <Icon as={IconSquareCheck} w={6} h={6} />
          ) : (
            <Icon as={IconSquare} w={6} h={6} />
          );
        },
        size: 120,
        mantineTableBodyCellProps: {
          align: 'left',
        },
      }, */
    ],
    []
  );

  const handleExit = () => {
    navigate(-1);
  };

  const handleCustSearch = () => {
    const no = getValues('ar_custno');
    if (no && no.length > 0) {
      const rec = customers.filter(r => r.c_custno === no);
      if (rec.length > 0) {
        update_CustDetls({ ...rec[0] });
      } else {
        setValue('ar_custno', '');
        setValue('ar_cust', '');
        setValue('ar_add1', '');
        setValue('ar_add2', '');
        setValue('ar_add3', '');
        setValue('ar_area', '');
        setValue('ar_tel', '');
        setValue('ar_bfbal', 0);
        onCustSearchOpen();
      }
    } else {
      onCustSearchOpen();
    }
  };

  const update_CustDetls = data => {
    const {
      c_custno,
      c_cust,
      c_add1,
      c_add2,
      c_add3,
      c_tel1,
      c_tel2,
      c_area,
      c_bfbal,
    } = data;
    setSelectedCustno(prev => (prev = c_custno));

    // update state values
    setValue('ar_custno', c_custno);
    setValue('ar_cust', c_cust);
    setValue('ar_add1', c_add1);
    setValue('ar_add2', c_add2);
    setValue('ar_add3', c_add3);
    setValue('ar_area', c_area);
    setValue('ar_tel', c_tel2 ? c_tel1 + ' / ' + c_tel2 : c_tel1);
    setValue('ar_bfbal', c_bfbal);
  };

  const handlePrint = () => {
    const data = getValues();
    //console.log('print', data);
    //console.log('print detls', receivable)
    setBatch(prev => (prev = { ...data }));
    setBatchdetls(
      prev =>
        (prev = receivable.filter(
          r =>
            r.ar_custno === selectedcustno &&
            r.ar_date >= moment(fromdate).format('YYYY-MM-DD') &&
            r.ar_date <= moment(todate).format('YYYY-MM-DD')
        ))
    );
    setARIdState(
      prev =>
        (prev = {
          ...editaridstate,
          no: selectedcustno,
          totals: totals,
          fromdate: fromdate,
          todate: todate,
        })
    );
    navigate('/customerstatementprint');
  };

  const handleCalc = () => {
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
      bal120 = 0,
      balrept = 0,
      balreptcur = 0,
      lastbfbal = 0,
      unpaidbal = 0;

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
    const mth120 = dayjs()
      .subtract(
        differenceInCalendarMonths(new Date(today), new Date(todate)) + 4,
        'month'
      )
      .format('YYYY-MM');

    const custbfbal = getValues('ar_bfbal') || 0;

    console.log('custbfbal', custbfbal);
    console.log('totals mth', mthcurr, mth30, mth60, mth90);

    /*   armthview
      .filter(
        r => r.ar_custno === selectedcustno && r.ar_yearmonth <= totals.mth90
      )
      .forEach(rec => {
        switch (rec.ar_doctype) {
          case 'Cash':
            totsales = totsales + rec.ar_totalamt;
            return null;
          case 'Invoice':
            totsales = totsales + rec.ar_totalamt;
            return null;
          case 'Credit':
            totcredit = totsales + rec.ar_totalamt;
            return null;
          case 'Debit':
            totdebit = totsales + rec.ar_totalamt;
            return null;
          case 'Receipt':
            totreceipt = totsales + rec.ar_totalamt;
            return null;

          default:
            return null;
        }
      }); */
    balcurr = receivable
      .filter(
        r =>
          r.ar_custno === selectedcustno &&
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

    const balcurtmp = receivable.filter(
      r =>
        r.ar_custno === selectedcustno &&
        r.ar_date >= moment(newFromDate).format('YYYY-MM-DD') &&
        r.ar_date <= moment(todate).format('YYYY-MM-DD')
    );

    console.log('balcurtmp', balcurtmp);

    bal30 = armthview
      .filter(r => r.ar_custno === selectedcustno && r.ar_yearmonth === mth30)
      .reduce((acc, rec) => {
        switch (rec.ar_doctype) {
          case 'Cash':
            return acc + rec.ar_totalamt;
          case 'Invoice':
            return acc + rec.ar_totalamt;
          /*       case 'Credit':
            return acc - rec.ar_totalamt; */
          case 'Debit':
            return acc + rec.ar_totalamt;
          /*   case 'Receipt':
            return acc - rec.ar_totalamt; */
          default:
            return acc;
        }
      }, 0);
    bal60 = armthview
      .filter(r => r.ar_custno === selectedcustno && r.ar_yearmonth === mth60)
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
          /*    case 'Receipt':
            return acc - rec.ar_totalamt; */
          default:
            return acc;
        }
      }, 0);
    bal90 = armthview
      .filter(r => r.ar_custno === selectedcustno && r.ar_yearmonth <= mth90)
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
          case 'Receipt':
            return acc - rec.ar_totalamt;
          default:
            return acc;
        }
      }, 0);

    balrept = armthview
      .filter(
        r =>
          r.ar_custno === selectedcustno &&
          r.ar_yearmonth > mth90 &&
          r.ar_yearmonth < mthcurr &&
          r.ar_doctype !== 'Invoice' &&
          r.ar_doctype !== 'Cash' &&
          r.ar_doctype !== 'Debit'
      )
      .reduce((acc, rec) => {
        return acc + rec.ar_totalamt;
      }, 0);

    /* const balrepttmp = armthview.filter(
      r =>
        r.ar_custno === selectedcustno &&
        r.ar_yearmonth > mth90 &&
        r.ar_yearmonth < mthcurr &&
        r.ar_doctype !== 'Invoice' &&
        r.ar_doctype !== 'Cash' &&
        r.ar_doctype !== 'Debit'
    );

    console.log('balrept tmp', balrepttmp); */

    balreptcur = receivable
      .filter(
        r =>
          r.ar_custno === selectedcustno &&
          r.ar_agedate >= moment(newFromDate).format('YYYY-MM-DD') &&
          r.ar_agedate <= moment(todate).format('YYYY-MM-DD') &&
          r.ar_doctype !== 'Invoice' &&
          r.ar_doctype !== 'Cash' &&
          r.ar_doctype !== 'Debit'
      )
      .reduce((acc, rec) => {
        return acc + rec.ar_total;
      }, 0);

    /*  unpaidbal = receivable
      .filter(
        r =>
          r.ar_custno === selectedcustno &&
          r.ar_doctype !== 'Receipt' &&
          r.ar_doctype !== 'Credit' &&
          r.ar_paid === false
      )
      .reduce((acc, rec) => {
        return acc + rec.ar_balance;
      }, 0); */

    /*  const unpaidrec = receivable
      .filter(
        r =>
          r.ar_custno === selectedcustno &&
          r.ar_doctype !== 'Receipt' &&
          r.ar_doctype !== 'Credit' &&
          r.ar_paid === false
      )
      .map((acc, rec) => {
        return { ...acc };
      }); */

    //console.log('unpaidrec', unpaidbal);

    //apply receipt
    //console.log('bal', bal30, bal60, bal90);
    // bal90 = bal90 + custbfbal;
    // if (balcurr < 0) {
    //   bal30 = bal30 + balcurr;
    //   balcurr = 0;
    // }
    // if (bal30 < 0) {
    //   bal60 = bal60 + bal30;
    //   bal30 = 0;
    //   console.log('bal30', bal30, bal60);
    // }
    // if (bal60 < 0) {
    //   bal90 = bal90 + bal60;
    //   bal60 = 0;

    //   console.log('bal60', bal60, bal90);
    // }
    console.log(
      'bal90',
      balcurr,
      bal30,
      bal60,
      bal90,
      balrept,
      balreptcur,
      custbfbal
    );

    let rept = balrept;
    bal90 = bal90 + custbfbal;
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
    totbfbal = totsales + totdebit - totcredit - totreceipt;
    lastbfbal = bal90 + bal60 + bal30;
    totbal = lastbfbal + balcurr - balreptcur;
    console.log(
      'bal totals',
      balcurr,
      bal30,
      bal60,
      bal90,
      balrept,
      balreptcur,
      custbfbal
    );

    console.log(
      'bal',
      balcurr,
      bal30,
      bal60,
      bal90,
      balrept,
      balreptcur,
      custbfbal
    );
    console.log('totbfbal, totbal, lastbfbal', totbfbal, totbal, lastbfbal);
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
    setValue('totsales', totsales);
    setValue('totcredit', totcredit);
    setValue('totdebit', totdebit);
    setValue('totreceipt', totreceipt);
    setValue('totbfbal', totbfbal);
    setValue('balcurr', balcurr);
    setValue('bal30', bal30);
    setValue('bal60', bal60);
    setValue('bal90', bal90);
    setValue('totbal', totbal);
    setValue('balrept', balrept);
    setValue('balreptcur', balreptcur);
    setValue('lastbfbal', lastbfbal);
    setValue('unpaidbal', unpaidbal);
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
    const mth120 = dayjs()
      .subtract(
        differenceInCalendarMonths(new Date(today), new Date(todate)) + 4,
        'month'
      )
      .format('YYYY-MM');

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

  const handleFilter = () => {
    var BreakException = {};
    var totreptamt = totals.totreceipt + totals.totcredit;
    const newData = receivable
      .filter(r => r.ar_custno === selectedcustno)
      .sort((a, b) => (a.ar_date > b.ar_date ? 1 : -1))
      .map(rec => {
        let bal = 0,
          paidbal = 0,
          paid = false;
        const { ar_doctype, ar_balance, ar_paid_amt, ar_paid } = rec;
        if (
          ar_doctype === 'Cash' ||
          ar_doctype === 'Invoice' ||
          ar_doctype === 'Debit'
        ) {
          if (totreptamt > 0) {
            if (ar_balance < totreptamt) {
              bal = 0;
              paidbal = ar_balance;
              paid = true;
              totreptamt = totreptamt - ar_balance;
            } else {
              bal = ar_balance - totreptamt;
              paidbal = ar_paid_amt + totreptamt;
              paid = false;
              totreptamt = 0;
            }
            return {
              ...rec,
              ar_balance: bal,
              ar_paid_amt: paidbal,
              ar_paid: paid,
            };
          } else {
            return null;
          }
        } else {
          return {
            ...rec,
            ar_paid: true,
          };
        }
      });
    //update receivable
    newData.forEach(rec => {
      updateReceivable({ ...rec });
    });
  };

  const handleDateFilter = () => {
    setToLoad(true);
  };

  useEffect(() => {
    setARCustno(selectedcustno);
    setARMthViewCustno(selectedcustno);
  }, [selectedcustno]);

  useEffect(() => {
    handleCalc();
  }, [!isFetching]);

  useEffect(() => {
    handleMthPeriod();
    handleCalc();
    setToLoad(false);
  }, [toLoad]);

  useEffect(() => {
    handleMthPeriod();
  }, []);

  return (
    <Box
      h={{ base: 'auto', md: 'auto' }}
      py={[0, 0, 0]}
      direction={{ base: 'column-reverse', md: 'row' }}
      overflowY="scroll"
    >
      <VStack
        w={{ base: 'auto', md: 'full' }}
        h={{ base: 'auto', md: 'full' }}
        p="2"
        spacing="10"
        //align="left"
        //alignItems="flex-start"
      >
        <form>
          <HStack py={2} spacing="3">
            <Grid templateColumns={'repeat(12,1fr)'} columnGap={3}>
              <GridItem colSpan={1}>
                <Button
                  leftIcon={<IconArrowBackUp size={30} />}
                  onClick={() => navigate(-1)}
                  colorScheme="teal"
                  variant={'outline'}
                  size="lg"
                >
                  Back
                </Button>
              </GridItem>

              <GridItem colSpan={3}>
                <VStack alignItems={'flex-start'} px={1}>
                  <Heading size="lg">Customer Statement</Heading>
                  <Divider border="2px solid teal" />
                </VStack>
              </GridItem>
              <GridItem colSpan={5}></GridItem>
              <GridItem colSpan={2}>
                <Flex>
                  <HStack mr={5}>
                    <ButtonGroup spacing={8}>
                      <Button
                        leftIcon={<IconPrinter />}
                        colorScheme="teal"
                        onClick={handlePrint}
                        disabled={isFetching}
                        variant={'outline'}
                        size="lg"
                      >
                        Print
                      </Button>
                      <Button
                        leftIcon={<IconDoorExit />}
                        colorScheme="teal"
                        onClick={handleExit}
                        variant={'outline'}
                        size="lg"
                      >
                        Exit
                      </Button>
                    </ButtonGroup>
                    <IconButton
                      icon={<IconFilterExclamation />}
                      onClick={handleFilter}
                      variant={'outline'}
                    />
                  </HStack>
                </Flex>
              </GridItem>
            </Grid>
          </HStack>
          <Grid
            templateColumns={'repeat(12,1fr)'}
            //templateRows="7"
            columnGap={3}
            rowGap={3}
            px={5}
            py={2}
            w={{ base: 'auto', md: 'full', lg: 'full' }}
            border="1px solid teal"
            borderRadius="10"
          >
            <GridItem colSpan={2} mt={field_gap} w="100%">
              <HStack>
                <FormControl>
                  <Controller
                    control={control}
                    name="ar_custno"
                    //defaultValue={invoice.sls_no || ''}
                    render={({ field: { onChange, value, ref } }) => (
                      <VStack align="left">
                        <Text as="b" fontSize="sm" textAlign="left">
                          Customer No
                        </Text>
                        <Input
                          name="ar_custno"
                          value={value || ''}
                          width="full"
                          onChange={onChange}
                          borderColor="gray.400"
                          //textTransform="capitalize"
                          ref={ref}
                          placeholder="customer no"
                          minWidth="100"
                          //readOnly
                        />
                      </VStack>
                    )}
                  />
                </FormControl>
                <Box pt={7}>
                  <IconButton
                    onClick={() => handleCustSearch()}
                    icon={<IconSearch />}
                    size="md"
                    colorScheme="teal"
                  />
                </Box>
              </HStack>
            </GridItem>
            <GridItem colSpan={6} mt={field_gap}>
              <FormControl>
                <Controller
                  control={control}
                  name="ar_cust"
                  defaultValue={state.ar_cust}
                  render={({ field: { onChange, value, ref } }) => (
                    <VStack align="left">
                      {/* <FormLabel>Description</FormLabel> */}
                      <Text as="b" fontSize="sm" textAlign="left">
                        Customer
                      </Text>
                      <Input
                        name="ar_cust"
                        value={value || ''}
                        width="full"
                        onChange={onChange}
                        borderColor="gray.400"
                        //textTransform="capitalize"
                        ref={ref}
                        placeholder="customer name"
                        readOnly
                        //minWidth="100"
                      />
                    </VStack>
                  )}
                />
              </FormControl>
            </GridItem>
            <GridItem colSpan={4}></GridItem>

            {/*  <GridItem colSpan={2}>
              <FormControl>
                <Controller
                  control={control}
                  name="totbf"
                  defaultValue={totals.totbf}
                  render={({ field: { onChange, value, ref } }) => (
                    <VStack w="100%" py={0} align="left" textAlign="left">
                      <Text as="b" fontSize="sm">
                        Balance B/F
                      </Text>
                      <NumberInput
                        name="totbf"
                        value={value || 0}
                        precision={2}
                        parser={value => value.replace(/\$\s?|(,*)/g, '')}
                        formatter={value =>
                          !Number.isNaN(parseFloat(value))
                            ? `$ ${value}`.replace(
                                /\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g,
                                ','
                              )
                            : '$ '
                        }
                        size="md"
                        width="full"
                        onChange={onChange}
                        //borderColor="gray.400"
                        //textTransform="capitalize"
                        ref={ref}
                        //placeholder="store a"
                      />
                    </VStack>
                  )}
                />
              </FormControl>
            </GridItem> */}
            {/*   <GridItem colSpan={2}>
              <FormControl>
                <Controller
                  control={control}
                  name="totsales"
                  defaultValue={totals.totsales}
                  render={({ field: { onChange, value, ref } }) => (
                    <VStack w="100%" py={0} align="left" textAlign="left">
                      <Text as="b" fontSize="sm">
                        Total Sales
                      </Text>
                      <NumberInput
                        name="totsales"
                        value={value || 0}
                        precision={2}
                        parser={value => value.replace(/\$\s?|(,*)/g, '')}
                        formatter={value =>
                          !Number.isNaN(parseFloat(value))
                            ? `$ ${value}`.replace(
                                /\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g,
                                ','
                              )
                            : '$ '
                        }
                        size="md"
                        width="full"
                        onChange={onChange}
                        //borderColor="gray.400"
                        //textTransform="capitalize"
                        ref={ref}
                        //placeholder="store a"
                      />
                    </VStack>
                  )}
                />
              </FormControl>
            </GridItem> */}
            {/*   <GridItem colSpan={2}>
              <FormControl>
                <Controller
                  control={control}
                  name="totcredit"
                  defaultValue={totals.totcredit}
                  render={({ field: { onChange, value, ref } }) => (
                    <VStack w="100%" py={0} align="left" textAlign="left">
                      <Text as="b" fontSize="sm">
                        Total Credit
                      </Text>
                      <NumberInput
                        name="totcredit"
                        value={value || 0}
                        precision={2}
                        parser={value => value.replace(/\$\s?|(,*)/g, '')}
                        formatter={value =>
                          !Number.isNaN(parseFloat(value))
                            ? `$ ${value}`.replace(
                                /\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g,
                                ','
                              )
                            : '$ '
                        }
                        size="md"
                        width="full"
                        onChange={onChange}
                        //borderColor="gray.400"
                        //textTransform="capitalize"
                        ref={ref}
                        //placeholder="store a"
                      />
                    </VStack>
                  )}
                />
              </FormControl>
            </GridItem> */}
            {/*  <GridItem colSpan={2}>
              <FormControl>
                <Controller
                  control={control}
                  name="totdebit"
                  defaultValue={totals.totdebit}
                  render={({ field: { onChange, value, ref } }) => (
                    <VStack w="100%" py={0} align="left" textAlign="left">
                      <Text as="b" fontSize="sm">
                        Total Debit
                      </Text>
                      <NumberInput
                        name="totcash"
                        value={value || 0}
                        precision={2}
                        parser={value => value.replace(/\$\s?|(,*)/g, '')}
                        formatter={value =>
                          !Number.isNaN(parseFloat(value))
                            ? `$ ${value}`.replace(
                                /\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g,
                                ','
                              )
                            : '$ '
                        }
                        size="md"
                        width="full"
                        onChange={onChange}
                        //borderColor="gray.400"
                        //textTransform="capitalize"
                        ref={ref}
                        //placeholder="store a"
                      />
                    </VStack>
                  )}
                />
              </FormControl>
            </GridItem> */}
            {/* <GridItem colSpan={2}>
              <FormControl>
                <Controller
                  control={control}
                  name="balrept"
                  defaultValue={totals.balrept}
                  render={({ field: { onChange, value, ref } }) => (
                    <VStack w="100%" py={0} align="left" textAlign="left">
                      <Text as="b" fontSize="sm">
                        Total Receipt
                      </Text>
                      <NumberInput
                        name="balrept"
                        value={value || 0}
                        precision={2}
                        parser={value => value.replace(/\$\s?|(,*)/g, '')}
                        formatter={value =>
                          !Number.isNaN(parseFloat(value))
                            ? `$ ${value}`.replace(
                                /\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g,
                                ','
                              )
                            : '$ '
                        }
                        size="md"
                        width="full"
                        onChange={onChange}
                        //borderColor="gray.400"
                        //textTransform="capitalize"
                        ref={ref}
                        //placeholder="store a"
                      />
                    </VStack>
                  )}
                />
              </FormControl>
            </GridItem> */}
            {/*
            <GridItem colSpan={2}>
              <FormControl>
                <Controller
                  control={control}
                  name="balreptcur"
                  defaultValue={totals.balreptcur}
                  render={({ field: { onChange, value, ref } }) => (
                    <VStack w="100%" py={0} align="left" textAlign="left">
                      <Text as="b" fontSize="sm">
                        Total Current Receipt
                      </Text>
                      <NumberInput
                        name="balreptcur"
                        value={value || 0}
                        precision={2}
                        parser={value => value.replace(/\$\s?|(,*)/g, '')}
                        formatter={value =>
                          !Number.isNaN(parseFloat(value))
                            ? `$ ${value}`.replace(
                                /\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g,
                                ','
                              )
                            : '$ '
                        }
                        size="md"
                        width="full"
                        onChange={onChange}
                        //borderColor="gray.400"
                        //textTransform="capitalize"
                        ref={ref}
                        //placeholder="store a"
                      />
                    </VStack>
                  )}
                />
              </FormControl>
            </GridItem> */}
            {/*   <GridItem colSpan={2}>
              <FormControl>
                <Controller
                  control={control}
                  name="totbfbal"
                  defaultValue={totals.totbfbal}
                  render={({ field: { onChange, value, ref } }) => (
                    <VStack w="100%" py={0} align="left" textAlign="left">
                      <Text as="b" fontSize="sm">
                        Total B/F Balance
                      </Text>
                      <NumberInput
                        name="totbfbal"
                        value={value || 0}
                        precision={2}
                        parser={value => value.replace(/\$\s?|(,*)/g, '')}
                        formatter={value =>
                          !Number.isNaN(parseFloat(value))
                            ? `$ ${value}`.replace(
                                /\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g,
                                ','
                              )
                            : '$ '
                        }
                        size="md"
                        width="full"
                        onChange={onChange}
                        //borderColor="gray.400"
                        //textTransform="capitalize"
                        ref={ref}
                        //placeholder="store a"
                      />
                    </VStack>
                  )}
                />
              </FormControl>
            </GridItem> */}
            <GridItem colSpan={2}>
              <FormControl>
                <Controller
                  control={control}
                  name="lastbfbal"
                  defaultValue={totals.lastbfbal}
                  render={({ field: { onChange, value, ref } }) => (
                    <VStack w="100%" py={0} align="left" textAlign="left">
                      <Text as="b" fontSize="sm">
                        Last Balance B/F
                      </Text>
                      <NumberInput
                        name="lastbfbal"
                        value={value || 0}
                        precision={2}
                        parser={value => value.replace(/\$\s?|(,*)/g, '')}
                        formatter={value =>
                          !Number.isNaN(parseFloat(value))
                            ? `$ ${value}`.replace(
                                /\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g,
                                ','
                              )
                            : '$ '
                        }
                        size="md"
                        width="full"
                        onChange={onChange}
                        //borderColor="gray.400"
                        //textTransform="capitalize"
                        ref={ref}
                        //placeholder="store a"
                      />
                    </VStack>
                  )}
                />
              </FormControl>
            </GridItem>
            <GridItem colSpan={2}>
              <FormControl>
                <Controller
                  control={control}
                  name="balcurr"
                  defaultValue={totals.balcurr}
                  render={({ field: { onChange, value, ref } }) => (
                    <VStack w="100%" py={0} align="left" textAlign="left">
                      <Text as="b" fontSize="sm">
                        Current Balance
                      </Text>
                      <NumberInput
                        name="balcurr"
                        value={value || 0}
                        precision={2}
                        parser={value => value.replace(/\$\s?|(,*)/g, '')}
                        formatter={value =>
                          !Number.isNaN(parseFloat(value))
                            ? `$ ${value}`.replace(
                                /\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g,
                                ','
                              )
                            : '$ '
                        }
                        size="md"
                        width="full"
                        onChange={onChange}
                        //borderColor="gray.400"
                        //textTransform="capitalize"
                        ref={ref}
                        //placeholder="store a"
                      />
                    </VStack>
                  )}
                />
              </FormControl>
            </GridItem>
            <GridItem colSpan={2}>
              <FormControl>
                <Controller
                  control={control}
                  name="bal30"
                  defaultValue={totals.bal30}
                  render={({ field: { onChange, value, ref } }) => (
                    <VStack w="100%" py={0} align="left" textAlign="left">
                      <Text as="b" fontSize="sm">
                        31 to 60 Days Balance
                      </Text>
                      <NumberInput
                        name="bal30"
                        value={value || 0}
                        precision={2}
                        parser={value => value.replace(/\$\s?|(,*)/g, '')}
                        formatter={value =>
                          !Number.isNaN(parseFloat(value))
                            ? `$ ${value}`.replace(
                                /\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g,
                                ','
                              )
                            : '$ '
                        }
                        size="md"
                        width="full"
                        onChange={onChange}
                        //borderColor="gray.400"
                        //textTransform="capitalize"
                        ref={ref}
                        //placeholder="store a"
                      />
                    </VStack>
                  )}
                />
              </FormControl>
            </GridItem>
            <GridItem colSpan={2}>
              <FormControl>
                <Controller
                  control={control}
                  name="bal60"
                  defaultValue={totals.bal60}
                  render={({ field: { onChange, value, ref } }) => (
                    <VStack w="100%" py={0} align="left" textAlign="left">
                      <Text as="b" fontSize="sm">
                        61 to 90 Days Balance
                      </Text>
                      <NumberInput
                        name="bal60"
                        value={value || 0}
                        precision={2}
                        parser={value => value.replace(/\$\s?|(,*)/g, '')}
                        formatter={value =>
                          !Number.isNaN(parseFloat(value))
                            ? `$ ${value}`.replace(
                                /\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g,
                                ','
                              )
                            : '$ '
                        }
                        size="md"
                        width="full"
                        onChange={onChange}
                        //borderColor="gray.400"
                        //textTransform="capitalize"
                        ref={ref}
                        //placeholder="store a"
                      />
                    </VStack>
                  )}
                />
              </FormControl>
            </GridItem>
            <GridItem colSpan={2}>
              <FormControl>
                <Controller
                  control={control}
                  name="bal90"
                  defaultValue={totals.bal90}
                  render={({ field: { onChange, value, ref } }) => (
                    <VStack w="100%" py={0} align="left" textAlign="left">
                      <Text as="b" fontSize="sm">
                        Over 90 Days Balance
                      </Text>
                      <NumberInput
                        name="bal90"
                        value={value || 0}
                        precision={2}
                        parser={value => value.replace(/\$\s?|(,*)/g, '')}
                        formatter={value =>
                          !Number.isNaN(parseFloat(value))
                            ? `$ ${value}`.replace(
                                /\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g,
                                ','
                              )
                            : '$ '
                        }
                        size="md"
                        width="full"
                        onChange={onChange}
                        //borderColor="gray.400"
                        //textTransform="capitalize"
                        ref={ref}
                        //placeholder="store a"
                      />
                    </VStack>
                  )}
                />
              </FormControl>
            </GridItem>
            <GridItem colSpan={2}>
              <FormControl>
                <Controller
                  control={control}
                  name="totbal"
                  defaultValue={totals.totbal}
                  render={({ field: { onChange, value, ref } }) => (
                    <VStack w="100%" py={0} align="left" textAlign="left">
                      <Text as="b" fontSize="sm">
                        Total Balance
                      </Text>
                      <NumberInput
                        name="totbal"
                        value={value || 0}
                        precision={2}
                        parser={value => value.replace(/\$\s?|(,*)/g, '')}
                        formatter={value =>
                          !Number.isNaN(parseFloat(value))
                            ? `$ ${value}`.replace(
                                /\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g,
                                ','
                              )
                            : '$ '
                        }
                        size="md"
                        width="full"
                        onChange={onChange}
                        //borderColor="gray.400"
                        //textTransform="capitalize"
                        ref={ref}
                        //placeholder="store a"
                      />
                    </VStack>
                  )}
                />
              </FormControl>
            </GridItem>
            {/*   <GridItem colSpan={2}>
              <FormControl>
                <Controller
                  control={control}
                  name="balrept"
                  defaultValue={totals.balrept}
                  render={({ field: { onChange, value, ref } }) => (
                    <VStack w="100%" py={0} align="left" textAlign="left">
                      <Text as="b" fontSize="sm">
                        Total Receipt
                      </Text>
                      <NumberInput
                        name="balrept"
                        value={value || 0}
                        precision={2}
                        parser={value => value.replace(/\$\s?|(,*)/g, '')}
                        formatter={value =>
                          !Number.isNaN(parseFloat(value))
                            ? `$ ${value}`.replace(
                                /\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g,
                                ','
                              )
                            : '$ '
                        }
                        size="md"
                        width="full"
                        onChange={onChange}
                        //borderColor="gray.400"
                        //textTransform="capitalize"
                        ref={ref}
                        //placeholder="store a"
                      />
                    </VStack>
                  )}
                />
              </FormControl>
            </GridItem> */}
            {/*   <GridItem colSpan={2}>
              <FormControl>
                <Controller
                  control={control}
                  name="unpaidbal"
                  defaultValue={totals.unpaidbal}
                  render={({ field: { onChange, value, ref } }) => (
                    <VStack w="100%" py={0} align="left" textAlign="left">
                      <Text as="b" fontSize="sm">
                        Unpaid Balance
                      </Text>
                      <NumberInput
                        name="unpaidbal"
                        value={value || 0}
                        precision={2}
                        parser={value => value.replace(/\$\s?|(,*)/g, '')}
                        formatter={value =>
                          !Number.isNaN(parseFloat(value))
                            ? `$ ${value}`.replace(
                                /\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g,
                                ','
                              )
                            : '$ '
                        }
                        size="md"
                        width="full"
                        onChange={onChange}
                        //borderColor="gray.400"
                        //textTransform="capitalize"
                        ref={ref}
                        //placeholder="store a"
                      />
                    </VStack>
                  )}
                />
              </FormControl>
            </GridItem> */}
            <GridItem colSpan={8}></GridItem>
            <GridItem colSpan={12}>
              <Grid
                templateColumns={'repeat(12,1fr)'}
                //templateRows="7"
                columnGap={3}
                rowGap={3}
                px={5}
                py={2}
                w={{ base: 'auto', md: 'full', lg: 'full' }}
                border="1px solid teal"
                borderRadius="10"
              >
                {/* <GridItem colSpan={2} mt={field_gap}>
                  <FormControl>
                    <Controller
                      control={control}
                      name="fromdate"
                      defaultValue={fromdate}
                      render={({ field: { onChange, value, ref } }) => (
                        <VStack align="left">
                          <Text as="b" fontSize="sm" textAlign="left">
                            From Date
                          </Text>
                          <Input
                            name="fromdate"
                            value={value}
                            type="date"
                            width="full"
                            onChange={e => {
                              onChange(e.target.value);
                              setFromDate(e.target.value);
                            }}
                            borderColor="gray.400"
                            ref={ref}
                            readOnly
                          />
                        </VStack>
                      )}
                    />
                  </FormControl>
                </GridItem> */}
                <GridItem colSpan={2} mt={field_gap}>
                  <FormControl>
                    <Controller
                      control={control}
                      name="todate"
                      defaultValue={todate}
                      render={({ field: { onChange, value, ref } }) => (
                        <VStack align="left">
                          {/* <FormLabel>Description</FormLabel> */}
                          <Text as="b" fontSize="sm" textAlign="left">
                            Statement Date
                          </Text>
                          <Input
                            name="todate"
                            value={value}
                            type="date"
                            width="full"
                            onChange={e => {
                              onChange(e.target.value);
                              setToDate(e.target.value);
                            }}
                            borderColor="gray.400"
                            //textTransform="capitalize"
                            ref={ref}
                            //placeholder="customer name"
                            //minWidth="100"
                          />
                        </VStack>
                      )}
                    />
                  </FormControl>
                </GridItem>
                <GridItem colSpan={1}>
                  <VStack align="left" pt={10}>
                    <IconButton
                      colorScheme="teal"
                      size="md"
                      icon={<IconFilterSearch />}
                      onClick={handleDateFilter}
                      variant={'outline'}
                      //h={35}
                      w={35}
                    />
                  </VStack>
                </GridItem>
                {/*  <GridItem colSpan={2} mt={field_gap}>
                  <FormControl>
                    <Controller
                      control={control}
                      name="doctype"
                      render={({ field: { onChange, value, ref } }) => (
                        <VStack align="left" pt={1}>
                          <Text as="b" fontSize="sm" textAlign="left">
                            Filter by Document Type
                          </Text>
                          <Radio.Group
                            name="doctype"
                            value={value}
                            defaultValue="All"
                            label=""
                            width="full"
                            height="10"
                            padding="1"
                            onChange={setDocType}
                            //borderColor="gray.400"
                            //borderWidth="1px"
                            //textTransform="capitalize"
                            ref={ref}
                          >
                            <Stack direction="row">
                              <Radio value="All" label="All" size="md" />
                              <Radio value="Cash" label="Cash" size="md" />
                              <Radio
                                value="Invoice"
                                label="Invoice"
                                size="md"
                              />
                              <Radio value="Debit" label="Debit" size="md" />
                              <Radio value="Credit" label="Credit" size="md" />
                              <Radio
                                value="Receipt"
                                label="Receipt"
                                size="md"
                              />
                            </Stack>
                          </Radio.Group>
                        </VStack>
                      )}
                    />
                  </FormControl>
                </GridItem> */}
                <GridItem colSpan={5}></GridItem>
              </Grid>
            </GridItem>
          </Grid>
          <Box
            width="100%"
            borderWidth={1}
            borderColor="teal.800"
            borderRadius={10}
            border="1px solid teal"
            overflow="scroll"
            backgroundColor="white"
            px={5}
            mt={5}
          >
            <CustomReactTable
              title={` Balance B/F: ${currency(totals.lastbfbal).format()}`}
              columns={columns}
              // data={selectedcustno ? receivable : []}
              data={
                selectedcustno
                  ? receivable.filter(item => {
                      switch (doctype) {
                        case 'All':
                          return (
                            item.ar_custno === selectedcustno &&
                            item.ar_date >=
                              moment(fromdate).format('YYYY-MM-DD') &&
                            item.ar_date <= moment(todate).format('YYYY-MM-DD')
                          );
                        case 'Cash':
                          return (
                            item.ar_doctype === 'Cash' &&
                            item.ar_date >=
                              moment(fromdate).format('YYYY-MM-DD') &&
                            item.ar_date <= moment(todate).format('YYYY-MM-DD')
                          );
                        case 'Invoice':
                          return (
                            item.ar_doctype === 'Invoice' &&
                            item.ar_date >=
                              moment(fromdate).format('YYYY-MM-DD') &&
                            item.ar_date <= moment(todate).format('YYYY-MM-DD')
                          );
                        case 'Debit':
                          return (
                            item.ar_doctype === 'Debit' &&
                            item.ar_date >=
                              moment(fromdate).format('YYYY-MM-DD') &&
                            item.ar_date <= moment(todate).format('YYYY-MM-DD')
                          );
                        case 'Credit':
                          return (
                            item.ar_doctype === 'Credit' &&
                            item.ar_date >=
                              moment(fromdate).format('YYYY-MM-DD') &&
                            item.ar_date <= moment(todate).format('YYYY-MM-DD')
                          );
                        case 'Receipt':
                          return (
                            item.ar_doctype === 'Receipt' &&
                            item.ar_date >=
                              moment(fromdate).format('YYYY-MM-DD') &&
                            item.ar_date <= moment(todate).format('YYYY-MM-DD')
                          );
                        default:
                          return (
                            item.ar_custno === selectedcustno &&
                            item.ar_date >=
                              moment(fromdate).format('YYYY-MM-DD') &&
                            item.ar_date <= moment(todate).format('YYYY-MM-DD')
                          );
                      }
                    })
                  : []
              }
              initialState={{ sorting: [{ id: 'ar_date', desc: false }] }}
              disableExportStatus={true}
              disableRowActionStatus={true}
              disableAddStatus={true}
              disableEditStatus={true}
              //handleAdd={handleAddEquip}
              //handleEdit={handleEditEquip}
              //handleDelete={handleDeleteEquip}
            />
          </Box>
        </form>
      </VStack>
      <Modal opened={isCustSearchOpen} onClose={onCustSearchClose} size="5xl">
        <CustomerSearchTable
          state={state}
          setState={setState}
          //add_Item={add_InvDetls}
          update_Item={update_CustDetls}
          statustype={statustype}
          setStatusType={setStatusType}
          onCustomerSearchClose={onCustSearchClose}
        />
      </Modal>
    </Box>
  );
};

export default CustomerStatementTable;
