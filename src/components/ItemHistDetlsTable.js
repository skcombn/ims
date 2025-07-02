import { useState } from 'react';
import { useIsFetching } from '@tanstack/react-query';
import { NumericFormat } from 'react-number-format';
import { Controller, useForm } from 'react-hook-form';
import dayjs from 'dayjs';
import moment from 'moment';
import {
  Box,
  Divider,
  FormControl,
  Grid,
  GridItem,
  HStack,
  Input,
  Stack,
  Text,
  VStack,
} from '@chakra-ui/react';
import { IconPencilCancel } from '@tabler/icons-react';
import { ActionIcon, NumberInput, Radio } from '@mantine/core';
import CustomReactTable from '../helpers/CustomReactTable';

const ItemHistDetlsTable = ({
  itemno,
  itemhistdetls,
  totals,
  handleUpdQtyOnhand,
}) => {
  const isFetching = useIsFetching();

  const [doctype, setDocType] = useState('All');

  const [fromdate, setFromDate] = useState(
    dayjs().subtract(6, 'month').date(1).format('YYYY-MM-DD')
  );
  const [todate, setToDate] = useState(dayjs().format('YYYY-MM-DD'));

  const {
    control,
    // formState: {},
  } = useForm({
    defaultValues: {
      ...totals,
    },
  });

  const titles = 'Items History Transactions';

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

  return (
    <Box>
      <VStack
        w={{ base: 'auto', md: 'full' }}
        h={{ base: 'auto', md: 'full' }}
        p="2"
        spacing="10"
      >
        <Grid
          templateColumns={'repeat(7,1fr)'}
          columnGap={3}
          rowGap={3}
          px={5}
          py={2}
          w={{ base: 'auto', md: 'full', lg: 'full' }}
          border="1px solid teal"
          borderRadius="10"
        >
          <GridItem colSpan={1} w="100%" h="auto" px={1}>
            <VStack w="100%" py={1} align="left">
              <Text as="b" fontSize="sm" align="left">
                Total PO Qty
              </Text>

              <NumberInput
                name="totpoqty"
                value={totals.totpoqty || 0}
                precision={3}
                parser={value => value.replace(/\$\s?|(,*)/g, '')}
                formatter={value =>
                  !Number.isNaN(parseFloat(value))
                    ? `${value}`.replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',')
                    : '$ '
                }
                width="full"
                placeholder="total purchases qty"
                readOnly
              />
            </VStack>
          </GridItem>
          <GridItem colSpan={1} w="100%" h="auto" px={1}>
            <VStack w="100%" py={1} align="left">
              <Text as="b" fontSize="sm" align="left">
                Total PO Amt
              </Text>

              <NumberInput
                name="totpoamt"
                value={totals.totpoamt || 0}
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
                width="full"
                readOnly
              />
            </VStack>
          </GridItem>

          <GridItem colSpan={1} w="100%" h="auto" px={1}>
            <VStack w="100%" py={1} align="left">
              <Text as="b" fontSize="sm" align="left">
                Total PO Returns Qty
              </Text>

              <NumberInput
                name="totportnqty"
                value={totals.totportnqty || 0}
                precision={3}
                parser={value => value.replace(/\$\s?|(,*)/g, '')}
                formatter={value =>
                  !Number.isNaN(parseFloat(value))
                    ? `${value}`.replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',')
                    : '$ '
                }
                width="full"
                readOnly
              />
            </VStack>
          </GridItem>
          <GridItem colSpan={1} w="100%" h="auto" px={1}>
            <VStack w="100%" py={1} align="left">
              <Text as="b" fontSize="sm" align="left">
                Total PO Returns Amt
              </Text>

              <NumberInput
                name="totportnamt"
                value={totals.totportnamt || 0}
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
                readOnly
              />
            </VStack>
          </GridItem>
          <GridItem colSpan={1} w="100%" h="auto" px={1}>
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
                readOnly
              />
            </VStack>
          </GridItem>
          <GridItem colSpan={1} w="100%" h="auto" px={1}>
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
                readOnly
              />
            </VStack>
          </GridItem>
          <GridItem></GridItem>
          <GridItem colSpan={1} w="100%" h="auto" px={1}>
            <VStack w="100%" py={1} align="left">
              <Text as="b" fontSize="sm" align="left">
                Total Sales Qty
              </Text>

              <NumberInput
                name="totsalesqty"
                value={totals.totsalesqty || 0}
                precision={3}
                parser={value => value.replace(/\$\s?|(,*)/g, '')}
                formatter={value =>
                  !Number.isNaN(parseFloat(value))
                    ? `${value}`.replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',')
                    : '$ '
                }
                width="full"
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
                readOnly
              />
            </VStack>
          </GridItem>
          <GridItem colSpan={1} w="100%" h="auto" px={1}>
            <VStack w="100%" py={1} align="left">
              <Text as="b" fontSize="sm" align="left">
                Total Sales Returns Qty
              </Text>

              <NumberInput
                name="totsalesrtnqty"
                value={totals.totsalesrtnqty || 0}
                precision={3}
                parser={value => value.replace(/\$\s?|(,*)/g, '')}
                formatter={value =>
                  !Number.isNaN(parseFloat(value))
                    ? `${value}`.replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',')
                    : '$ '
                }
                width="full"
                readOnly
              />
            </VStack>
          </GridItem>
          <GridItem colSpan={1} w="100%" h="auto" px={1}>
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
                readOnly
              />
            </VStack>
          </GridItem>

          <GridItem colSpan={1} w="100%" h="auto" px={1}>
            <VStack w="100%" py={1} align="left">
              <Text as="b" fontSize="sm" align="left">
                Total Qty OnHand
              </Text>

              <NumberInput
                name="totqtyonhand"
                value={totals.totqtyonhand || 0}
                precision={3}
                parser={value => value.replace(/\$\s?|(,*)/g, '')}
                formatter={value =>
                  !Number.isNaN(parseFloat(value))
                    ? `${value}`.replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',')
                    : '$ '
                }
                width="full"
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
                  placeholder="total amount"
                  readOnly
                />
              </VStack>
              <Box pt={5}>
                <ActionIcon variant="transparent" onClick={handleUpdQtyOnhand}>
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
            </Box>
          </GridItem>
        </Grid>
      </VStack>
    </Box>
  );
};

export default ItemHistDetlsTable;
