import React, { useState, useEffect, useMemo } from 'react';
import { MantineReactTable, useMantineReactTable } from 'mantine-react-table';
import { useIsFetching } from '@tanstack/react-query';
import { NumericFormat } from 'react-number-format';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import moment from 'moment';
import { round } from 'lodash';
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
  IconButton,
  Image,
  Input,
  InputGroup,
  InputLeftAddon,
  InputLeftElement,
  Select,
  SimpleGrid,
  Stack,
  StackDivider,
  Text,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
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
  AiFillEdit,
  AiFillDelete,
  AiOutlinePlus,
  AiOutlineSearch,
  AiOutlineForm,
  AiOutlineArrowLeft,
} from 'react-icons/ai';
import { IconPencilCancel } from '@tabler/icons-react';
import { ActionIcon, Modal, NumberInput, Radio } from '@mantine/core';
import { TiArrowBack } from 'react-icons/ti';
import { ImExit } from 'react-icons/im';
import { useRecoilState } from 'recoil';
import CustomReactTable from '../helpers/CustomReactTable';
import ItemSearchTable from './ItemSearchTable';

const initial_item = {
  item_no: '',
  item_group: '',
  item_desp: '',
  item_pack: '',
  item_unit: '',
  item_pfactor: 1,
  item_suppno: '',
  item_supp: '',
  item_minlvl: 0,
  item_qtyhand: 0,
  item_remark: '',
  item_cat: '',
  item_date: null,
  item_brand: '',
  item_dept: '',
  item_wsp: 0,
  item_qq: 0,
  item_rsp: 0,
  item_cif: 0,
  item_duty: 0,
  item_fob: 0,
  item_bal: 0,
  item_comm: 0,
  item_storea: 0,
  item_storeb: 0,
  item_storef: 0,
  item_lsqty: 0,
  item_lsprice: 0,
  item_lsdate: null,
  item_lpqty: 0,
  item_lpcost: 0,
  item_lpdate: null,
  item_extcost: 0,
  item_fc: 0,
  item_inf: 0,
  item_bc: 0,
  item_tf: 0,
  item_lc: 0,
  item_cnf: 0,
  item_tinqty: 0,
  item_tinamt: 0,
  item_toutqty: 0,
  item_toutamt: 0,
  item_phyqty: 0,
  item_phydate: null,
  item_phystor: '',
  item_mtdsamt: 0,
  item_mtdsqty: 0,
  item_mtdpamt: 0,
  item_lock: false,
  item_nonstock: false,
  item_qty: 0,
  item_inactive: false,
};

const ItemHistDetlsTable = ({
  itemno,
  itemhistdetls,
  totals,
  handleUpdQtyOnhand,
}) => {
  const isFetching = useIsFetching();
  const navigate = useNavigate();
  const field_width = '150';
  const field_gap = '3';
  const [doctype, setDocType] = useState('All');
  const [state, setState] = useState(initial_item);
  const [statustype, setStatusType] = useState('');
  const [filterText, setFilterText] = React.useState('');
  const [selecteditemno, setSelectedItemno] = useState('');
  const [fromdate, setFromDate] = useState(
    dayjs().subtract(6, 'month').date(1).format('YYYY-MM-DD')
  );
  const [todate, setToDate] = useState(dayjs().format('YYYY-MM-DD'));
  // const [totals, setTotals] = useState(initial_totals);
  //const { itemshistory, setItemhistItemno } = useItemsHistory();
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
      ...totals,
    },
  });

  console.log('doctype', doctype);

  const {
    isOpen: isItemSearchOpen,
    onOpen: onItemSearchOpen,
    onClose: onItemSearchClose,
  } = useDisclosure();

  const titles = 'Items History Transactions';

  const initialReactTableState = {
    sorting: [{ id: 'batchno', desc: true }],
  };
  const columns = [
    {
      header: 'Document No',
      accessorKey: 'it_transno',
      size: 100,
    },
    {
      id: 'date',
      header: 'Doc Date',
      size: 100,
      accessorFn: row => {
        const tDay = new Date(row.it_transdate);
        tDay.setHours(0, 0, 0, 0); // remove time from date
        return tDay;
      },
      Cell: ({ cell }) =>
        dayjs(cell.getValue().toLocaleDateString()).format('DD-MMM-YYYY'),

      size: 120,
    },
    {
      header: 'Doc Type',
      accessorKey: 'it_transtype',
      size: 120,
    },
    {
      header: 'Source',
      accessorKey: 'it_scno',
      mantineTableBodyCellProps: {
        align: 'left',
      },
    },
    {
      header: 'Qty',
      accessorKey: 'it_qty',
      size: 100,
      Cell: ({ row }) => (
        <NumericFormat
          value={row.original.it_qty}
          decimalScale={3}
          fixedDecimalScale
          thousandSeparator=","
          displayType="text"
        />
      ),
      mantineTableBodyCellProps: ({ cell, row }) => ({
        sx: {
          color:
            row.original.it_transtype === 'Purchase' ||
            row.original.it_transtype === 'PO Debit' ||
            row.original.it_transtype === 'PO Credit' ||
            row.original.it_transtype === 'Sales Returns'
              ? 'black'
              : row.original.it_transtype === 'Sales' ||
                row.original.it_transtype === 'Invoice' ||
                row.original.it_transtype === 'Cash' ||
                row.original.it_transtype === 'Debit' ||
                row.original.it_transtype === 'PO Returns'
              ? 'red'
              : row.original.it_transtype === 'Adjustment'
              ? 'green'
              : 'black',
          fontWeight: 'bold',
        },
        align: 'right',
      }),
    },
    {
      header: 'Unit Value',
      accessorFn: row => row.it_netvalue,
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
      header: 'Amount',
      accessorFn: row => row.it_extvalue,
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
      header: 'Lot No',
      accessorKey: 'it_lotno',
      //size: 30,
    },
    {
      header: 'Remark',
      accessorKey: 'it_remark',
    },
  ];

  /* const mantinetable = useMantineReactTable({
    columns,
    data: itemshistory,
    enableTableHead: true,
    enableRowSelection: true,
    enableMultiRowSelection: true,
    enableTopToolbar: false,
    initialState: {
      sorting: [{ id: 'it_transdate', desc: false, density: 'xs' }],
    },
  }); */

  const handleExit = () => {
    navigate(-1);
  };

  const handleItemSearch = () => {
    onItemSearchOpen();
  };

  /*  useEffect(() => {
    setItemhistItemno(itemno);
    if (itemshistory.length > 1) {
      handleCalcTotals(selecteditemno);
    }
  }, [itemno]); */

  return (
    <Box>
      <VStack
        w={{ base: 'auto', md: 'full' }}
        h={{ base: 'auto', md: 'full' }}
        p="2"
        spacing="10"
        //align="left"
        //alignItems="flex-start"
      >
        <Grid
          templateColumns={'repeat(7,1fr)'}
          //templateRows="7"
          columnGap={3}
          rowGap={3}
          px={5}
          py={2}
          w={{ base: 'auto', md: 'full', lg: 'full' }}
          border="1px solid teal"
          borderRadius="10"
        >
          <GridItem
            colSpan={1}
            w="100%"
            h="auto"
            px={1}
            //border="1px solid"
          >
            <VStack w="100%" py={1} align="left">
              <Text as="b" fontSize="sm" align="left">
                Total PO Qty
              </Text>

              <NumberInput
                name="totpoqty"
                value={totals.totpoqty || 0}
                precision={3}
                //fixedDecimalScale
                parser={value => value.replace(/\$\s?|(,*)/g, '')}
                formatter={value =>
                  !Number.isNaN(parseFloat(value))
                    ? `${value}`.replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',')
                    : '$ '
                }
                width="full"
                //onChange={onChange}
                //borderColor="gray.400"
                //textTransform="capitalize"
                //ref={ref}
                placeholder="total purchases qty"
                readOnly
              />
            </VStack>
          </GridItem>
          <GridItem
            colSpan={1}
            w="100%"
            h="auto"
            px={1}
            //border="1px solid"
          >
            <VStack w="100%" py={1} align="left">
              <Text as="b" fontSize="sm" align="left">
                Total PO Amt
              </Text>

              <NumberInput
                name="totpoamt"
                value={totals.totpoamt || 0}
                precision={2}
                //fixedDecimalScale
                parser={value => value.replace(/\$\s?|(,*)/g, '')}
                formatter={value =>
                  !Number.isNaN(parseFloat(value))
                    ? `$ ${value}`.replace(
                        /\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g,
                        ','
                      )
                    : '$ '
                }
                width="full"
                //onChange={onChange}
                //borderColor="gray.400"
                //textTransform="capitalize"
                //ref={ref}
                //placeholder="total purchases qty"
                readOnly
              />
            </VStack>
          </GridItem>

          <GridItem
            colSpan={1}
            w="100%"
            h="auto"
            px={1}
            //border="1px solid"
          >
            <VStack w="100%" py={1} align="left">
              <Text as="b" fontSize="sm" align="left">
                Total PO Returns Qty
              </Text>

              <NumberInput
                name="totportnqty"
                value={totals.totportnqty || 0}
                precision={3}
                //fixedDecimalScale
                parser={value => value.replace(/\$\s?|(,*)/g, '')}
                formatter={value =>
                  !Number.isNaN(parseFloat(value))
                    ? `${value}`.replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',')
                    : '$ '
                }
                width="full"
                //onChange={onChange}
                //borderColor="gray.400"
                //textTransform="capitalize"
                //ref={ref}
                //placeholder=""
                readOnly
              />
            </VStack>
          </GridItem>
          <GridItem
            colSpan={1}
            w="100%"
            h="auto"
            px={1}
            //border="1px solid"
          >
            <VStack w="100%" py={1} align="left">
              <Text as="b" fontSize="sm" align="left">
                Total PO Returns Amt
              </Text>

              <NumberInput
                name="totportnamt"
                value={totals.totportnamt || 0}
                precision={2}
                // fixedDecimalScale
                parser={value => value.replace(/\$\s?|(,*)/g, '')}
                formatter={value =>
                  !Number.isNaN(parseFloat(value))
                    ? `$ ${value}`.replace(
                        /\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g,
                        ','
                      )
                    : '$ '
                }
                //onChange={onChange}
                //borderColor="gray.400"
                //textTransform="capitalize"
                //ref={ref}
                //placeholder="total despatch amt"
                readOnly
              />
            </VStack>
          </GridItem>
          <GridItem
            colSpan={1}
            w="100%"
            h="auto"
            px={1}
            //border="1px solid"
          >
            <VStack w="100%" py={1} align="left">
              <Text as="b" fontSize="sm" align="left">
                Total Adjust Qty
              </Text>

              <NumberInput
                name="totadjustqty"
                value={totals.totadjustqty || 0}
                precision={3}
                //fixedDecimalScale
                parser={value => value.replace(/\$\s?|(,*)/g, '')}
                formatter={value =>
                  !Number.isNaN(parseFloat(value))
                    ? `${value}`.replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',')
                    : '$ '
                }
                width="full"
                //onChange={onChange}
                //borderColor="gray.400"
                //textTransform="capitalize"
                //ref={ref}
                //placeholder="total adjust qty"
                readOnly
              />
            </VStack>
          </GridItem>
          <GridItem
            colSpan={1}
            w="100%"
            h="auto"
            px={1}
            //border="1px solid"
          >
            <VStack w="100%" py={1} align="left">
              <Text as="b" fontSize="sm" align="left">
                Total Adjust Amt
              </Text>

              <NumberInput
                name="totadjustamt"
                value={totals.totadjustamt || 0}
                precision={2}
                //fixedDecimalScale
                parser={value => value.replace(/\$\s?|(,*)/g, '')}
                formatter={value =>
                  !Number.isNaN(parseFloat(value))
                    ? `$ ${value}`.replace(
                        /\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g,
                        ','
                      )
                    : '$ '
                }
                width="full"
                //onChange={onChange}
                //borderColor="gray.400"
                //textTransform="capitalize"
                //ref={ref}
                //placeholder="total adjust amt"
                readOnly
              />
            </VStack>
          </GridItem>
          <GridItem></GridItem>
          <GridItem
            colSpan={1}
            w="100%"
            h="auto"
            px={1}
            //border="1px solid"
          >
            <VStack w="100%" py={1} align="left">
              <Text as="b" fontSize="sm" align="left">
                Total Sales Qty
              </Text>

              <NumberInput
                name="totsalesqty"
                value={totals.totsalesqty || 0}
                precision={3}
                //fixedDecimalScale
                parser={value => value.replace(/\$\s?|(,*)/g, '')}
                formatter={value =>
                  !Number.isNaN(parseFloat(value))
                    ? `${value}`.replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',')
                    : '$ '
                }
                width="full"
                //onChange={onChange}
                //borderColor="gray.400"
                //textTransform="capitalize"
                //ref={ref}
                //placeholder=""
                readOnly
              />
            </VStack>
          </GridItem>
          <GridItem
            colSpan={1}
            w="100%"
            h="auto"
            px={1}
            //border="1px solid"
          >
            <VStack w="100%" py={1} align="left">
              <Text as="b" fontSize="sm" align="left">
                Total Sales Amt
              </Text>

              <NumberInput
                name="totsalesamt"
                value={totals.totsalesamt || 0}
                precision={2}
                //fixedDecimalScale
                parser={value => value.replace(/\$\s?|(,*)/g, '')}
                formatter={value =>
                  !Number.isNaN(parseFloat(value))
                    ? `$ ${value}`.replace(
                        /\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g,
                        ','
                      )
                    : '$ '
                }
                width="full"
                //onChange={onChange}
                //borderColor="gray.400"
                //textTransform="capitalize"
                //ref={ref}
                //placeholder="total despatch amt"
                readOnly
              />
            </VStack>
          </GridItem>
          <GridItem
            colSpan={1}
            w="100%"
            h="auto"
            px={1}
            //border="1px solid"
          >
            <VStack w="100%" py={1} align="left">
              <Text as="b" fontSize="sm" align="left">
                Total Sales Returns Qty
              </Text>

              <NumberInput
                name="totsalesrtnqty"
                value={totals.totsalesrtnqty || 0}
                precision={3}
                //fixedDecimalScale
                parser={value => value.replace(/\$\s?|(,*)/g, '')}
                formatter={value =>
                  !Number.isNaN(parseFloat(value))
                    ? `${value}`.replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',')
                    : '$ '
                }
                width="full"
                //onChange={onChange}
                //borderColor="gray.400"
                //textTransform="capitalize"
                //ref={ref}
                //placeholder=""
                readOnly
              />
            </VStack>
          </GridItem>
          <GridItem
            colSpan={1}
            w="100%"
            h="auto"
            px={1}
            //border="1px solid"
          >
            <VStack w="100%" py={1} align="left">
              <Text as="b" fontSize="sm" align="left">
                Total Sales Returns Amt
              </Text>

              <NumberInput
                name="totsalesrtnamt"
                value={totals.totsalesrtnamt || 0}
                precision={2}
                //fixedDecimalScale
                parser={value => value.replace(/\$\s?|(,*)/g, '')}
                formatter={value =>
                  !Number.isNaN(parseFloat(value))
                    ? `$ ${value}`.replace(
                        /\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g,
                        ','
                      )
                    : '$ '
                }
                width="full"
                //onChange={onChange}
                //borderColor="gray.400"
                //textTransform="capitalize"
                //ref={ref}
                //placeholder="total despatch amt"
                readOnly
              />
            </VStack>
          </GridItem>
          {/*  <GridItem
            colSpan={1}
            w="100%"
            h="auto"
            px={1}
            //border="1px solid"
          >
            <VStack w="100%" py={1} align="left">
              <Text as="b" fontSize="sm" align="left">
                Total Sales Debit Qty
              </Text>

              <NumberInput
                name="totsalesdebitqty"
                value={totals.totsalesdebitqty || 0}
                precision={3}
                //fixedDecimalScale
                parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                formatter={(value) =>
                  !Number.isNaN(parseFloat(value))
                    ? `${value}`.replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")
                    : "$ "
                }
                width="full"
                //onChange={onChange}
                //borderColor="gray.400"
                //textTransform="capitalize"
                //ref={ref}
                //placeholder=""
                readOnly
              />
            </VStack>
          </GridItem> */}
          {/*   <GridItem
            colSpan={1}
            w="100%"
            h="auto"
            px={1}
            //border="1px solid"
          >
            <VStack w="100%" py={1} align="left">
              <Text as="b" fontSize="sm" align="left">
                Total Sales Debit Amt
              </Text>

              <NumberInput
                name="totsalesdebitamt"
                value={totals.totpocreditamt || 0}
                precision={2}
                //fixedDecimalScale
                parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                formatter={(value) =>
                  !Number.isNaN(parseFloat(value))
                    ? `$ ${value}`.replace(
                        /\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g,
                        ","
                      )
                    : "$ "
                }
                width="full"
                //onChange={onChange}
                //borderColor="gray.400"
                //textTransform="capitalize"
                //ref={ref}
                //placeholder="total despatch amt"
                readOnly
              />
            </VStack>
          </GridItem> */}

          <GridItem
            colSpan={1}
            w="100%"
            h="auto"
            px={1}
            //border="1px solid"
          >
            <VStack w="100%" py={1} align="left">
              <Text as="b" fontSize="sm" align="left">
                Total Qty OnHand
              </Text>

              <NumberInput
                name="totqtyonhand"
                value={totals.totqtyonhand || 0}
                precision={3}
                //fixedDecimalScale
                parser={value => value.replace(/\$\s?|(,*)/g, '')}
                formatter={value =>
                  !Number.isNaN(parseFloat(value))
                    ? `${value}`.replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',')
                    : '$ '
                }
                width="full"
                //onChange={onChange}
                //borderColor="gray.400"
                //textTransform="capitalize"
                //ref={ref}
                placeholder="total qty onhand"
                readOnly
              />
            </VStack>
          </GridItem>
          <GridItem
            colSpan={1}
            w="100%"
            h="auto"
            px={1}
            //border="1px solid"
          >
            <HStack>
              <VStack w="100%" py={1} align="left">
                <Text as="b" fontSize="sm" align="left">
                  Total Amount
                </Text>

                <NumberInput
                  name="totamount"
                  value={totals.totamount || 0}
                  precision={2}
                  //fixedDecimalScale
                  parser={value => value.replace(/\$\s?|(,*)/g, '')}
                  formatter={value =>
                    !Number.isNaN(parseFloat(value))
                      ? `$ ${value}`.replace(
                          /\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g,
                          ','
                        )
                      : '$ '
                  }
                  width="full"
                  //onChange={onChange}
                  //borderColor="gray.400"
                  //textTransform="capitalize"
                  //ref={ref}
                  placeholder="total amount"
                  readOnly
                />
              </VStack>
              <Box pt={5}>
                <ActionIcon
                  variant="transparent"
                  //pt={8}
                  //alignItems={'right'}
                  onClick={handleUpdQtyOnhand}
                >
                  <IconPencilCancel />
                </ActionIcon>
              </Box>
            </HStack>
          </GridItem>
          <GridItem colSpan={7}>
            <Divider border="2px solid teal" />
          </GridItem>
          <GridItem colSpan={1}>
            <VStack align="left">
              <Text as="b" fontSize="sm" textAlign="left">
                From Date
              </Text>
              <Input
                name="fromdate"
                value={fromdate}
                type="date"
                isDisabled={isFetching}
                onChange={e => {
                  setFromDate(e.target.value);
                }}
                borderColor="gray.400"
              />
            </VStack>
          </GridItem>
          <GridItem colSpan={1}>
            <VStack align="left">
              <Text as="b" fontSize="sm" textAlign="left" w={100}>
                To Date
              </Text>
              <Input
                name="todate"
                value={todate}
                type="date"
                //width="full"
                onChange={e => {
                  setToDate(e.target.value);
                }}
                borderColor="gray.400"
                isDisabled={isFetching}
              />
            </VStack>
          </GridItem>
          <GridItem colSpan={5} ml={1}>
            <FormControl>
              <Controller
                control={control}
                name="doctype"
                render={({ field: { onChange, value, ref } }) => (
                  <VStack align="left" pt={0}>
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
                      padding="2"
                      mt={3}
                      onChange={setDocType}
                      //borderColor="gray.400"
                      //borderWidth="1px"
                      //textTransform="capitalize"
                      ref={ref}
                    >
                      <Stack direction="row" gap={10}>
                        <Radio value="All" label="All" size="md" />
                        <Radio value="Purchase" label="Purchase" size="md" />
                        <Radio
                          value="PO Returns"
                          label="PO Returns"
                          size="md"
                        />
                        <Radio value="Sales" label="Sales" size="md" />
                        <Radio
                          value="Sales Return"
                          label="Sales Return"
                          size="md"
                        />
                        <Radio
                          value="Adjustment"
                          label="Adjustment"
                          size="md"
                        />
                      </Stack>
                    </Radio.Group>
                  </VStack>
                )}
              />
            </FormControl>
          </GridItem>
          <GridItem colSpan={7}>
            <Box
              width="100%"
              borderWidth={1}
              borderColor="teal.800"
              borderRadius={10}
              border="1px solid teal"
              overflow="scroll"
              px={5}
              mt={5}
            >
              <CustomReactTable
                title={titles}
                columns={columns}
                data={itemhistdetls.filter(item =>
                  //r.it_itemno === itemno
                  {
                    switch (doctype) {
                      case 'All':
                        return (
                          item.it_itemno === itemno &&
                          item.it_transdate >=
                            moment(fromdate).format('YYYY-MM-DD') &&
                          item.it_transdate <=
                            moment(todate).format('YYYY-MM-DD')
                        );
                      case 'Sales':
                        return (
                          item.it_itemno === itemno &&
                          item.it_transtype === 'Sales' &&
                          item.it_transdate >=
                            moment(fromdate).format('YYYY-MM-DD') &&
                          item.it_transdate <=
                            moment(todate).format('YYYY-MM-DD')
                        );
                      case 'Sales Return':
                        return (
                          item.it_itemno === itemno &&
                          item.it_transtype === 'Sales Return' &&
                          item.it_transdate >=
                            moment(fromdate).format('YYYY-MM-DD') &&
                          item.it_transdate <=
                            moment(todate).format('YYYY-MM-DD')
                        );
                      case 'Purchase':
                        return (
                          item.it_itemno === itemno &&
                          item.it_transtype === 'Purchase' &&
                          item.it_transdate >=
                            moment(fromdate).format('YYYY-MM-DD') &&
                          item.it_transdate <=
                            moment(todate).format('YYYY-MM-DD')
                        );
                      case 'PO Returns':
                        return (
                          item.it_itemno === itemno &&
                          item.it_transtype === 'PO Returns' &&
                          item.it_transdate >=
                            moment(fromdate).format('YYYY-MM-DD') &&
                          item.it_transdate <=
                            moment(todate).format('YYYY-MM-DD')
                        );

                      case 'Adjustment':
                        return (
                          item.it_itemno === itemno &&
                          item.it_transtype === 'Adjustment' &&
                          item.it_transdate >=
                            moment(fromdate).format('YYYY-MM-DD') &&
                          item.it_transdate <=
                            moment(todate).format('YYYY-MM-DD')
                        );
                      default:
                        return item.it_itemno === itemno;
                    }
                  }
                )}
                initialState={{
                  sorting: [
                    { id: 'date', desc: true },
                    { id: 'it_transno', desc: true },
                  ],
                }}
                disableRowActionStatus={true}
                disableExportStatus={true}
                disableAddStatus={true}
                disableEditStatus={true}
              />
              {/*  <MantineReactTable table={mantinetable} /> */}
            </Box>
          </GridItem>
        </Grid>
      </VStack>
    </Box>
  );
};

export default ItemHistDetlsTable;
