import React, { useState, useEffect, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useIsFetching } from '@tanstack/react-query';
import { round } from 'lodash';
import currency from 'currency.js';
import dayjs from 'dayjs';
import moment from 'moment';
import { differenceInDays, differenceInCalendarMonths } from 'date-fns';
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
  IconPlus,
  IconSend,
  IconSquare,
  IconSquareCheck,
} from '@tabler/icons-react';
import { Modal, NumberInput, Radio, Select, Switch, Tabs } from '@mantine/core';
import { useRecoilState } from 'recoil';
import {
  apStatementState,
  apStatementDetlsState,
  editAPStatementIdState,
} from '../data/atomdata';
import { usePayable } from '../react-query/payable/usePayable';
import { useAPMthView } from '../react-query/apmthview/useAPMthView';
import { useSuppliers } from '../react-query/suppliers/useSuppliers';
import CustomReactTable from '../helpers/CustomReactTable';
import SupplierSearchTable from './SupplierSearchTable';

const initial_item = [
  {
    s_suppno: '',
    s_supp: '',
    s_branch: '',
    s_paid: '',
  },
];

const initial_totals = {
  lastbfbal: 0,
  unpaidbal: 0,
  totbf: 0,
  totpurs: 0,
  totcredit: 0,
  totdebit: 0,
  totpayment: 0,
  totbfbal: 0,
  totbal: 0,
  balcurr: 0,
  bal30: 0,
  bal60: 0,
  bal90: 0,
  balpay: 0,
  mthcurr: '',
  mth30: '',
  mth60: '',
  mth90: '',
};

const SupplierStatementTable = () => {
  const isFetching = useIsFetching();
  const navigate = useNavigate();
  const field_width = '150';
  const field_gap = '3';
  const [batch, setBatch] = useRecoilState(apStatementState);
  const [batchdetls, setBatchdetls] = useRecoilState(apStatementDetlsState);
  const [editapidstate, setAPIdState] = useRecoilState(editAPStatementIdState);
  const [state, setState] = useState(initial_item);
  const [statustype, setStatusType] = useState('');
  const [filterText, setFilterText] = React.useState('');
  const [selectedsuppno, setSelectedSuppno] = useState('');
  const [paid, setPaid] = useState('');
  const { suppliers } = useSuppliers();
  const { payable, setAPSuppno } = usePayable();
  const { apmthview, setAPMthViewSuppno } = useAPMthView();
  const [totals, setTotals] = useState(initial_totals);
  const [doctype, setDocType] = useState('');
  const [fromdate, setFromDate] = useState(
    dayjs().date(1).format('YYYY-MM-DD')
  );
  const [todate, setToDate] = useState(dayjs().format('YYYY-MM-DD'));
  const today = Date().toLocaleString();

  const daydiff = differenceInCalendarMonths(new Date(today), new Date(todate));
  console.log('diffday', daydiff);

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

  console.log('ap', payable);

  const {
    isOpen: isSuppSearchOpen,
    onOpen: onSuppSearchOpen,
    onClose: onSuppSearchClose,
  } = useDisclosure();

  const title = 'Supplier Statement';

  const columns = useMemo(
    () => [
      {
        header: 'Invoice No',
        accessorFn: row => row.ap_invno,
        //size: 200,
        mantineTableBodyCellProps: {
          align: 'left',
        },
      },
      {
        header: 'PO No',
        accessorFn: row => row.ap_pono,
        //size: 200,
        mantineTableBodyCellProps: {
          align: 'left',
        },
      },
      {
        id: 'apdate',
        header: 'Inv Date',
        accessorFn: row => {
          const tDay = new Date(row.ap_invdate);
          tDay.setHours(0, 0, 0, 0); // remove time from date
          return tDay;
        },
        Cell: ({ cell }) =>
          dayjs(cell.getValue().toLocaleDateString()).format('DD-MMM-YYYY'),
        mantineTableBodyCellProps: {
          align: 'left',
        },
      },
      /*  {
        id: 'ap_podate',
        header: 'PO Date',
        accessorFn: row => {
          const tDay = new Date(row.ap_podate);
          tDay.setHours(0, 0, 0, 0); // remove time from date
          return tDay;
        },
        Cell: ({ cell }) =>
          dayjs(cell.getValue().toLocaleDateString()).format('DD-MMM-YYYY'),
        //size: 200,

        mantineTableBodyCellProps: {
          align: 'left',
        },
      }, */
      {
        header: 'Doc Type',
        accessorFn: row => row.ap_doctype,
        //size: 200,
        mantineTableBodyCellProps: {
          align: 'left',
        },
      },
      {
        header: 'Supp No',
        accessorFn: row => row.ap_suppno,
        //size: 200,
        mantineTableBodyCellProps: {
          align: 'left',
        },
      },
      /*  {
        header: 'Supplier',
        accessorFn: row => row.ap_supplier,
        //size: 200,
        mantineTableBodyCellProps: {
          align: 'left',
        },
      }, */
      {
        header: 'Debit',
        accessorFn: row => row.ap_nettotal,
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
              row.original.ap_doctype === 'Payment'
                ? 'white'
                : row.original.ap_doctype === 'Credit'
                ? 'white'
                : 'black',
          },
          align: 'right',
        }),
      },
      {
        header: 'Credit',
        accessorFn: row => row.ap_nettotal,
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
              row.original.ap_doctype === 'Invoice'
                ? 'white'
                : row.original.ap_doctype === 'Cash'
                ? 'white'
                : row.original.ap_doctype === 'Debit'
                ? 'white'
                : 'black',
          },
          align: 'right',
        }),
      },
    ],
    []
  );

  const handleExit = () => {
    navigate(-1);
  };

  const handleSuppSearch = () => {
    const no = getValues('ap_suppno');
    //console.log('search itemno', itemno);
    if (no.length > 0) {
      const rec = suppliers.filter(r => r.s_suppno === no);
      if (rec.length > 0) {
        update_SuppDetls({ ...rec[0] });
      } else {
        setValue('ap_suppno', '');
        setValue('ap_supplier', '');
        setValue('ap_add1', '');
        setValue('ap_add2', '');
        setValue('ap_add3', '');
        setValue('ap_area', '');
        setValue('ap_tel', '');
        setValue('ap_bfbal', 0);
        onSuppSearchOpen();
      }
    } else {
      onSuppSearchOpen();
    }
  };

  const update_SuppDetls = data => {
    const {
      s_suppno,
      s_supp,
      s_add1,
      s_add2,
      s_add3,
      s_tel1,
      s_tel2,
      s_area,
      s_bfbal,
    } = data;
    setSelectedSuppno(prev => (prev = s_suppno));

    // update state values
    setValue('ap_suppno', s_suppno);
    setValue('ap_supplier', s_supp);
    setValue('ap_add1', s_add1);
    setValue('ap_add2', s_add2);
    setValue('ap_add3', s_add3);
    setValue('ap_area', s_area);
    setValue('ap_tel', s_tel2 ? s_tel1 + ' / ' + s_tel2 : s_tel1);
    setValue('ap_bfbal', s_bfbal);
  };

  const handlePrint = () => {
    const data = getValues();
    //console.log('print', data);
    //console.log('print detls', receivable)
    setBatch(prev => (prev = { ...data }));
    setBatchdetls(
      prev =>
        (prev = payable.filter(
          r =>
            r.ap_suppno === selectedsuppno &&
            r.ap_podate >= moment(fromdate).format('YYYY-MM-DD') &&
            r.ap_podate <= moment(todate).format('YYYY-MM-DD')
        ))
    );
    setAPIdState(
      prev =>
        (prev = {
          ...editapidstate,
          no: selectedsuppno,
          totals: totals,
          fromdate: fromdate,
          todate: todate,
        })
    );
    navigate('/customerstatementprint');
  };

  const handleCalc = () => {
    var totpurs = 0,
      totcredit = 0,
      totdebit = 0,
      totpayment = 0,
      totbal = 0,
      totbf = 0,
      totbfbal = 0,
      balcurr = 0,
      bal30 = 0,
      bal60 = 0,
      bal90 = 0,
      balpay = 0,
      lastbfbal = 0,
      unpaidbal = 0;
    const suppbfbal = getValues('ap_bfbal') ? getValues('ap_bfbal') : 0;

    console.log('suppbfbal', suppbfbal);

    apmthview
      .filter(
        r => r.ap_suppno === selectedsuppno && r.ap_yearmonth <= totals.mth90
      )
      .forEach(rec => {
        switch (rec.ap_doctype) {
          case 'Cash':
            totpurs = totpurs + rec.ap_totalamt;
            return null;
          case 'Invoice':
            totpurs = totpurs + rec.ap_totalamt;
            return null;
          case 'Credit':
            totcredit = totpurs + rec.ap_totalamt;
            return null;
          case 'Debit':
            totdebit = totpurs + rec.ap_totalamt;
            return null;
          case 'Payment':
            totpayment = totpurs + rec.ap_totalamt;
            return null;

          default:
            return null;
        }
      });
    balcurr = apmthview
      .filter(
        r => r.ap_suppno === selectedsuppno && r.ap_yearmonth === totals.mthcurr
      )
      .reduce((acc, rec) => {
        switch (rec.ap_doctype) {
          case 'Cash':
            return acc + rec.ap_totalamt;
          case 'Invoice':
            return acc + rec.ap_totalamt;
          case 'Credit':
            return acc - rec.ap_totalamt;
          case 'Debit':
            return acc + rec.ap_totalamt;
          case 'Payment':
            return acc - rec.ap_totalamt;
          default:
            return acc;
        }
      }, 0);
    bal30 = apmthview
      .filter(
        r => r.ap_suppno === selectedsuppno && r.ap_yearmonth === totals.mth30
      )
      .reduce((acc, rec) => {
        switch (rec.ap_doctype) {
          case 'Cash':
            return acc + rec.ap_totalamt;
          case 'Invoice':
            return acc + rec.ap_totalamt;
          case 'Credit':
            return acc - rec.ap_totalamt;
          case 'Debit':
            return acc + rec.ap_totalamt;
          case 'Payment':
            return acc - rec.ap_totalamt;
          default:
            return acc;
        }
      }, 0);
    bal60 = apmthview
      .filter(
        r => r.ap_suppno === selectedsuppno && r.ap_yearmonth === totals.mth60
      )
      .reduce((acc, rec) => {
        switch (rec.ap_doctype) {
          case 'Cash':
            return acc + rec.ap_totalamt;
          case 'Invoice':
            return acc + rec.ap_totalamt;
          case 'Credit':
            return acc - rec.ap_totalamt;
          case 'Debit':
            return acc + rec.ap_totalamt;
          case 'Payment':
            return acc - rec.ap_totalamt;
          default:
            return acc;
        }
      }, 0);
    bal90 = apmthview
      .filter(
        r => r.ap_suppno === selectedsuppno && r.ap_yearmonth <= totals.mth90
      )
      .reduce((acc, rec) => {
        switch (rec.ap_doctype) {
          case 'Cash':
            return acc + rec.ap_totalamt;
          case 'Invoice':
            return acc + rec.ap_totalamt;
          case 'Credit':
            return acc - rec.ap_totalamt;
          case 'Debit':
            return acc + rec.ap_totalamt;
          case 'Payment':
            return acc - rec.ap_totalamt;
          default:
            return acc;
        }
      }, 0);

    balpay = apmthview
      .filter(r => r.ap_yearmonth > totals.mth90 && r.ap_doctype === 'Receipt')
      .reduce((acc, rec) => {
        return acc + rec.ap_totalamt;
      }, 0);

    unpaidbal = payable
      .filter(
        r =>
          r.ap_suppno === selectedsuppno &&
          r.ap_doctype !== 'Payment' &&
          r.ap_doctype !== 'Credit' &&
          r.ap_paid === false
      )
      .reduce((acc, rec) => {
        return acc + rec.ap_balance;
      }, 0);

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

    console.log('unpaidrec', unpaidbal);

    //apply receipt
    console.log('bal', bal30, bal60, bal90);
    bal90 = bal90 + suppbfbal;
    if (balcurr < 0) {
      bal30 = bal30 + balcurr;
      balcurr = 0;
    }
    if (bal30 < 0) {
      bal60 = bal60 + bal30;
      bal30 = 0;
      console.log('bal30', bal30, bal60);
    }
    if (bal60 < 0) {
      bal90 = bal90 + bal60;
      bal60 = 0;

      console.log('bal60', bal60, bal90);
    }
    console.log('bal90', bal30, bal60, bal90);
    /* let rept = balrept;
    if (bal90 >= balrept) {
      bal90 = bal90 + balrept;
    } else {
      bal90 = 0;
      rept = balrept + bal90;
      if (bal60 >= rept) {
        bal60 = bal60 + rept;
      } else {
        bal60 = 0;
        rept = rept + bal60;
        if (bal30 >= rept) {
          bal30 = bal30 + rept;
        } else {
          bal30 = bal30 - rept;
        }
      }
    } */

    totbfbal = totpurs + totdebit - totcredit - totpayment;
    totbal = balcurr + bal30 + bal60 + bal90;
    lastbfbal = bal90 + bal60 + bal30;
    setTotals(
      prev =>
        (prev = {
          ...prev,
          totbf: totbf,
          totbfbal: totbfbal,
          totpurs: totpurs,
          totcredit: totcredit,
          totdebit: totdebit,
          totreceipt: totpayment,
          balcurr: balcurr,
          bal30: bal30,
          bal60: bal60,
          bal90: bal90,
          totbal: totbal,
          balpay: balpay,
          lastbfbal: lastbfbal,
          unpaidbal: unpaidbal,
        })
    );
    setValue('totpurs', totpurs);
    setValue('totcredit', totcredit);
    setValue('totdebit', totdebit);
    setValue('totpayment', totpayment);
    setValue('totbfbal', totbfbal);
    setValue('balcurr', balcurr);
    setValue('bal30', bal30);
    setValue('bal60', bal60);
    setValue('bal90', bal90);
    setValue('totbal', totbal);
    setValue('balpay', balpay);
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

  useEffect(() => {
    setAPSuppno(selectedsuppno);
    setAPMthViewSuppno(selectedsuppno);
  }, [selectedsuppno]);

  useEffect(() => {
    handleCalc();
  }, [!isFetching]);

  useEffect(() => {
    handleMthPeriod();
    setAPSuppno(selectedsuppno);
  }, [todate]);

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
                  <Heading size="lg">Supplier Statement</Heading>
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
                        disabled={!selectedsuppno}
                        variant={'outline'}
                        size="lg"
                        isDisabled={isFetching}
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
                    name="ap_suppno"
                    //defaultValue={invoice.sls_no || ''}
                    render={({ field: { onChange, value, ref } }) => (
                      <VStack align="left">
                        <Text as="b" fontSize="sm" textAlign="left">
                          Supplier No
                        </Text>
                        <Input
                          name="ap_suppno"
                          value={value}
                          width="full"
                          onChange={onChange}
                          borderColor="gray.400"
                          //textTransform="capitalize"
                          ref={ref}
                          placeholder="supplier no"
                          minWidth="100"
                          //readOnly
                        />
                      </VStack>
                    )}
                  />
                </FormControl>
                <Box pt={7}>
                  <IconButton
                    onClick={() => handleSuppSearch()}
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
                  name="ap_supplier"
                  defaultValue={state.ap_supplier}
                  render={({ field: { onChange, value, ref } }) => (
                    <VStack align="left">
                      {/* <FormLabel>Description</FormLabel> */}
                      <Text as="b" fontSize="sm" textAlign="left">
                        Supplier
                      </Text>
                      <Input
                        name="ap_supplier"
                        value={value}
                        width="full"
                        onChange={onChange}
                        borderColor="gray.400"
                        //textTransform="capitalize"
                        ref={ref}
                        placeholder="supplier name"
                        readOnly
                        //minWidth="100"
                      />
                    </VStack>
                  )}
                />
              </FormControl>
            </GridItem>
            {/*  <GridItem colSpan={2} mt={field_gap}>
              <FormControl>
                <Controller
                  control={control}
                  name="ap_doctype"
                  render={({ field: { onChange, value, ref } }) => (
                    <VStack align="left">
                      <Text as="b" fontSize="sm" textAlign="left">
                        Document Type
                      </Text>
                      <Radio.Group
                        name="ap_doctype"
                        value={value}
                        defaultValue="0"
                        width="full"
                        height="10"
                        padding="1"
                        onChange={setDocType}
                        borderColor="gray.400"
                        borderWidth="1px"
                        ref={ref}
                      >
                        <Stack direction="row">
                          <Radio value="All" label="All" size="md" />
                          <Radio value="Purchase" label="Purchase" size="md" />
                          <Radio value="Debit" label="Debit" size="md" />
                          <Radio value="Credit" label="Credit" size="md" />
                          <Radio value="Payment" label="Payment" size="md" />
                        </Stack>
                      </Radio.Group>
                    </VStack>
                  )}
                />
              </FormControl>
            </GridItem> */}
            <GridItem colSpan={4}></GridItem>
            <GridItem colSpan={2}>
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
            </GridItem>
            <GridItem colSpan={2}>
              <FormControl>
                <Controller
                  control={control}
                  name="totpurs"
                  defaultValue={totals.totpurs}
                  render={({ field: { onChange, value, ref } }) => (
                    <VStack w="100%" py={0} align="left" textAlign="left">
                      <Text as="b" fontSize="sm">
                        Total Purchases
                      </Text>
                      <NumberInput
                        name="totpurs"
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
                  name="totdebit"
                  defaultValue={totals.totdebit}
                  render={({ field: { onChange, value, ref } }) => (
                    <VStack w="100%" py={0} align="left" textAlign="left">
                      <Text as="b" fontSize="sm">
                        Total Debits
                      </Text>
                      <NumberInput
                        name="totdebits"
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
            </GridItem>
            <GridItem colSpan={2}>
              <FormControl>
                <Controller
                  control={control}
                  name="totpayment"
                  defaultValue={totals.totpayment}
                  render={({ field: { onChange, value, ref } }) => (
                    <VStack w="100%" py={0} align="left" textAlign="left">
                      <Text as="b" fontSize="sm">
                        Total Payments
                      </Text>
                      <NumberInput
                        name="totpayment"
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
            </GridItem>
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
            <GridItem colSpan={2}>
              <FormControl>
                <Controller
                  control={control}
                  name="balpay"
                  defaultValue={totals.balpay}
                  render={({ field: { onChange, value, ref } }) => (
                    <VStack w="100%" py={0} align="left" textAlign="left">
                      <Text as="b" fontSize="sm">
                        Total Payment
                      </Text>
                      <NumberInput
                        name="balpay"
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
            </GridItem>
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
                <GridItem colSpan={2} mt={field_gap}>
                  <FormControl>
                    <Controller
                      control={control}
                      name="fromdate"
                      defaultValue={fromdate}
                      render={({ field: { onChange, value, ref } }) => (
                        <VStack align="left">
                          {/* <FormLabel>Description</FormLabel> */}
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
                            To Date
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
                <GridItem></GridItem>
                <GridItem colSpan={2} mt={field_gap}>
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
                </GridItem>
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
            backgroundColor="white"
            overflow="scroll"
            px={5}
            mt={5}
          >
            <CustomReactTable
              title={title}
              columns={columns}
              //data={selectedsuppno ? payable : []}
              data={
                selectedsuppno
                  ? payable.filter(item => {
                      switch (doctype) {
                        case 'All':
                          return (
                            item.ap_suppno === selectedsuppno &&
                            item.ap_podate >=
                              moment(fromdate).format('YYYY-MM-DD') &&
                            item.ap_podate <=
                              moment(todate).format('YYYY-MM-DD')
                          );
                        case 'Cash':
                          return (
                            item.ap_doctype === 'Cash' &&
                            item.ap_podate >=
                              moment(fromdate).format('YYYY-MM-DD') &&
                            item.ap_podate <=
                              moment(todate).format('YYYY-MM-DD')
                          );
                        case 'Invoice':
                          return (
                            item.ap_doctype === 'Invoice' &&
                            item.ap_podate >=
                              moment(fromdate).format('YYYY-MM-DD') &&
                            item.ap_podate <=
                              moment(todate).format('YYYY-MM-DD')
                          );
                        case 'Debit':
                          return (
                            item.ap_doctype === 'Debit' &&
                            item.ap_podate >=
                              moment(fromdate).format('YYYY-MM-DD') &&
                            item.ap_podate <=
                              moment(todate).format('YYYY-MM-DD')
                          );
                        case 'Credit':
                          return (
                            item.ap_doctype === 'Credit' &&
                            item.ap_podate >=
                              moment(fromdate).format('YYYY-MM-DD') &&
                            item.ap_podate <=
                              moment(todate).format('YYYY-MM-DD')
                          );
                        case 'Receipt':
                          return (
                            item.ap_doctype === 'Receipt' &&
                            item.ap_podate >=
                              moment(fromdate).format('YYYY-MM-DD') &&
                            item.ap_podate <=
                              moment(todate).format('YYYY-MM-DD')
                          );
                        default:
                          return (
                            item.ap_suppno === selectedsuppno &&
                            item.ap_podate >=
                              moment(fromdate).format('YYYY-MM-DD') &&
                            item.ap_podate <=
                              moment(todate).format('YYYY-MM-DD')
                          );
                      }
                    })
                  : []
              }
              initialState={{ sorting: [{ id: 'ap_podate', desc: true }] }}
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
      <Modal opened={isSuppSearchOpen} onClose={onSuppSearchClose} size="5xl">
        <SupplierSearchTable
          state={state}
          setState={setState}
          //add_Item={add_InvDetls}
          update_Item={update_SuppDetls}
          statustype={statustype}
          setStatusType={setStatusType}
          onSupplierSearchClose={onSuppSearchClose}
        />
      </Modal>
    </Box>
  );
};

export default SupplierStatementTable;
