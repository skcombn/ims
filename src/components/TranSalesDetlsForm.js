import React, { useState, useEffect } from 'react';
import { useIsFetching } from '@tanstack/react-query';
import { MantineReactTable, useMantineReactTable } from 'mantine-react-table';
import { Controller, useForm } from 'react-hook-form';
import { nanoid } from 'nanoid';
import { formatPrice } from '../helpers/utils';
import { FiSave } from 'react-icons/fi';
import { AiOutlineSearch } from 'react-icons/ai';
import { ImExit } from 'react-icons/im';
import { useNavigate } from 'react-router-dom';
import {
  AspectRatio,
  Box,
  Button,
  ButtonGroup,
  Center,
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
  Radio,
  RadioGroup,
  Select,
  SimpleGrid,
  Stack,
  StackDivider,
  //Text,
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
import { Modal, NumberInput, ActionIcon, Text, Tooltip } from '@mantine/core';
import { IconDoorExit, IconSend } from '@tabler/icons-react';
import {
  IconEdit,
  IconTrash,
  IconSquareRoundedPlus,
  IconPlus,
} from '@tabler/icons-react';
import { useItemsExpiry } from '../react-query/itemsexpiry/useItemsExpiry';
import { useItemsSerial } from '../react-query/itemsserial/useItemsSerial';
import CustomReactTable from '../helpers/CustomReactTable';
import CustomReactSelectTable from '../helpers/CustomReactSelectTable';
import ItemSearchTable from './ItemSearchTable';
import { useItems } from '../react-query/items/useItems';
import { useRecoilState } from 'recoil';
import {
  editTranIdState,
  editTranDetlsIdState,
  editTranLotsIdState,
  editTranSerialIdState,
} from '../data/atomdata';
import TranSalesLotForm from './TranSalesLotForm';

const TranSalesDetlsForm = ({
  state,
  setState,
  lotstate,
  setLotState,
  serialstate,
  setSerialState,
  //statustype,
  add_Item,
  update_Item,
  onItemClose,
  add_LotItem,
  update_LotItem,
}) => {
  const isFetching = useIsFetching();
  const navigate = useNavigate();
  const field_width = '150';
  const field_gap = '3';
  const { itemsexpiry, setItemExpId } = useItemsExpiry();
  const { itemsserial, setItemSerialId } = useItemsSerial();
  const [editBatchId, setEditBatchId] = useRecoilState(editTranIdState);
  const [editBatchdetlsId, setEditBatchdetlsId] =
    useRecoilState(editTranDetlsIdState);
  const [editBatchlotsId, setEditBatchlotsId] =
    useRecoilState(editTranLotsIdState);
  const [batchlotform, setBatchLotForm] = useState();
  const [qty, setQty] = useState(state.tl_qty);
  const [uprice, setUPrice] = useState(state.tl_uprice);
  const [isexpirydate, setIsExpiryDate] = useState(state.tl_trackexpiry);
  const [trackserial, setTrackSerial] = useState(state.tl_trackserial);

  console.log('detlsform detlsstate', state);
  console.log('detlsform lotsstate', lotstate);
  console.log('detlsform serialsstate', serialstate);

  const {
    isOpen: isSearchOpen,
    onOpen: onSearchOpen,
    onClose: onSearchClose,
  } = useDisclosure();

  const {
    isOpen: isLotFormOpen,
    onOpen: onLotFormOpen,
    onClose: onLotFormClose,
  } = useDisclosure();

  const {
    handleSubmit,
    register,
    control,
    reset,
    setValue,
    formState: { errors, isSubmitting, id },
  } = useForm({
    defaultValues: {
      ...state,
    },
  });

  const expirycolumns = [
    /* {
      header: 'ID',
      accessorKey: 'tl_id',
      enableEditing: false,
      enableHiding: true,
    }, */
    {
      header: 'PO No',
      accessorKey: 'tl_pono',
      enableEditing: false,
      size: 150,
    },
    {
      header: 'Expiry Date',
      accessorKey: 'tl_dateexpiry',
      enableEditing: false,
      size: 100,
    },
    {
      header: 'Qty Received',
      accessorKey: 'tl_qtyreceived',
      enableEditing: false,
      mantineTableBodyCellProps: {
        align: 'center',
      },
      size: 100,
    },
    {
      header: 'Qty Onhand',
      accessorKey: 'tl_qtyonhand',
      enableEditing: false,
      mantineTableBodyCellProps: {
        align: 'center',
      },
      size: 100,
    },
    {
      header: 'Location',
      accessorKey: 'tl_location',
      enableEditing: false,
      size: 100,
    },
    {
      header: 'Qty',
      accessorKey: 'tl_qty',
      enableEditing: true,
      mantineTableBodyCellProps: {
        align: 'right',
      },
      size: 100,
    },
  ];

  const serialcolumns = [
    {
      header: 'Serial No',
      accessorKey: 'ts_serialno',
      enableEditing: false,
      size: 150,
    },
    {
      header: 'PO Date',
      accessorKey: 'ts_podate',
      enableEditing: false,
      size: 100,
    },
  ];

  //CREATE action
  const handleCreateItem = ({ values, exitCreatingMode }) => {
    //console.log("create", values);
    //handleAdd({ ...values });
    exitCreatingMode();
  };

  //UPDATE action
  const handleSaveItem = ({ values, table, row }) => {
    let qtycount = 0;
    const qtyvalue =
      parseFloat(values.tl_qty) > values.tl_qtyonhand
        ? values.tl_qtyonhand
        : parseFloat(values.tl_qty);
    const { original } = row;
    const { tl_id } = original;
    console.log('lotsave', values, original);
    const newData = [{ ...original, tl_qty: qtyvalue }];
    const oldData = lotstate.filter(r => r.tl_id !== original.tl_id);
    const allqty = oldData.reduce((acc, item) => {
      const value = isNaN(item.tl_qty) ? 0 : item.tl_qty;
      return acc + value;
    }, 0);

    setLotState(prev => [...oldData, ...newData]);
    table.setEditingRow(null); //exit editing mode
    const newQty = allqty + qtyvalue;
    console.log('lotqtycalc', allqty, qtycount, newQty, oldData);
    setValue('tl_qty', newQty);
    setQty(prev => (prev = newQty));
  };

  const table = useMantineReactTable({
    title: 'Expiry Lots Table',
    columns: expirycolumns,
    data: lotstate,
    initialState: {
      columnVisibility: { tl_id: false },
      sorting: [{ id: 'tl_dateexpiry', desc: false }],
      density: 'xs',
    },
    createDisplayMode: 'row',
    editDisplayMode: 'row',
    enableEditing: true,
    enableTopToolbar: false,
    getRowId: row => row.id,
    onCreatingRowSave: handleCreateItem,
    onEditingRowSave: handleSaveItem,
    renderRowActions: ({ row, table }) => (
      <Flex gap="md">
        <Tooltip label="Edit">
          <ActionIcon onClick={() => table.setEditingRow(row)}>
            <IconEdit />
          </ActionIcon>
        </Tooltip>
        {/*  <Tooltip label="Delete">
          <ActionIcon color="red" onClick={() => openDeleteConfirmModal(row)}>
            <IconTrash />
          </ActionIcon>
        </Tooltip> */}
      </Flex>
    ),
    /*  renderTopToolbarCustomActions: ({ table }) => (
      <ActionIcon
        variant="outline"
        onClick={() => {
          table.setCreatingRow(true);
        }}
        color="teal"
      >
        <IconPlus size="40" />
      </ActionIcon>
    ), */
  });

  const onSubmit = values => {
    //console.log('status', statustype);
    if (editBatchdetlsId.type === 'edit') {
      update_Item(values);
      update_LotItem(lotstate);
    }
    if (editBatchdetlsId.type === 'add') {
      add_Item(values);
      add_LotItem(lotstate);
    }
    onItemClose();
  };

  const handleExit = () => {
    onItemClose();
  };

  const update_ItemDetls = data => {
    console.log('upditem', data);
    const {
      item_no,
      item_desp,
      item_pack,
      item_unit,
      item_cost,
      item_price,
      item_trackexpiry,
      item_trackserial,
    } = data;
    setItemExpId(prev => (prev = item_no));
    setValue('tl_itemno', item_no);
    setValue('tl_desp', item_desp);
    setValue('tl_packing', item_pack);
    setValue('tl_unit', item_unit);
    setValue('tl_ucost', item_cost);
    setValue('tl_uprice', item_price);
    setValue('tl_netucost', item_cost);
    setValue('tl_trackexpiry', item_trackexpiry);
    setValue('tl_trackserial', item_trackserial);
    setQty(prev => (prev = 0));
    setUPrice(prev => (prev = item_price));
    setIsExpiryDate(item_trackexpiry);
    setTrackSerial(item_trackserial);
    //update batchlots
    const newLotData = itemsexpiry
      .filter(r => r.ie_itemno === item_no && r.ie_post === '0')
      .map(rec => {
        return {
          tl_id: nanoid(),
          tl_tranno: editTranIdState.no,
          tl_itemno: rec.ie_itemno,
          tl_type: 'item',
          tl_lotno: rec.ie_lotno,
          tl_datereceived: rec.ie_datereceived,
          tl_location: rec.ie_location,
          tl_dateexpiry: rec.ie_dateexpiry,
          tl_pono: rec.ie_pono,
          tl_podate: rec.ie_podate,
          tl_qtyonhand: rec.ie_qtyonhand,
          tl_qtyreceived: rec.ie_qtyreceived,
          tl_ucost: rec.ie_ucost,
          tl_post: rec.ie_post,
          tl_qty: 0,
        };
      });
    console.log('lot', newLotData);
    const lotdata = [{ ...lotstate }, { ...newLotData }];
    console.log('lotstate add', lotdata);
    setLotState([...lotstate, ...newLotData]);
    //update serial
    const newSerialData = itemsserial
      .filter(r => r.is_itemno === item_no)
      .map(rec => {
        return {
          ts_itemno: rec.ts_itemno,
          ts_serialno: rec.ts_serialno,
          ts_invno: editTranIdState.no,
        };
      });
    setSerialState([...serialstate, ...newSerialData]);
  };

  const handleItemSearch = () => {
    onSearchOpen();
  };

  const handleEditLotForm = data => {
    const { original } = data;
    setBatchLotForm({ ...original });
    onLotFormOpen();
  };

  const handleQtyCalc = () => {
    console.log('lotstate handleqtycalc', lotstate);
    if (isexpirydate && setLotState.length > 0) {
      const allqty = lotstate.reduce((acc, item) => {
        const value = isNaN(item.tl_qty) ? 0 : item.tl_qty;
        return acc + item.tl_qty;
      }, 0);

      setValue('tl_qty', allqty);
      setQty(allqty);
      console.log('handleqtycalc', allqty);
    }
  };

  const handleCalc = () => {
    const amt = Math.round(qty * uprice, 2);
    setValue('tl_amount', amt);
  };

  useEffect(() => {
    handleCalc();
  }, [qty, uprice]);

  /* useEffect(() => {
    handleQtyCalc();
  }, [lotstate]); */

  return (
    <Flex
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
        //alignItems="flex-start"
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid templateColumns={'repeat(4,1fr)'} columnGap={3} pb={2}>
            <GridItem colSpan={2}>
              <VStack alignItems={'flex-start'} px={1}>
                <Heading size="lg">Details Form</Heading>
                <Divider border="2px solid teal" w={250} />
              </VStack>
            </GridItem>
            <GridItem></GridItem>
            <GridItem>
              <ButtonGroup>
                <Button
                  variant={'outline'}
                  size="lg"
                  colorScheme="teal"
                  isLoading={isSubmitting}
                  type="submit"
                  onClick={handleSubmit(onSubmit)}
                  leftIcon={<IconSend />}
                  isDisabled={isFetching}
                >
                  Submit
                </Button>
                <Button
                  variant={'outline'}
                  size="lg"
                  colorScheme="teal"
                  isLoading={isSubmitting}
                  onClick={handleExit}
                  leftIcon={<IconDoorExit />}
                >
                  Close
                </Button>
              </ButtonGroup>
            </GridItem>
          </Grid>
          <Grid
            templateColumns={'repeat(6,1fr)'}
            columnGap={3}
            rowGap={3}
            px={5}
            py={2}
            w={{ base: 'auto', md: 'full', lg: 'full' }}
            border="1px solid teal"
            borderRadius="10"
          >
            <GridItem colSpan={2} mt={field_gap}>
              <HStack>
                <FormControl>
                  <Controller
                    control={control}
                    name="tl_itemno"
                    defaultValue={state.tl_itemno}
                    render={({ field: { onChange, value, ref } }) => (
                      <InputGroup>
                        <HStack w="100%" py={1}>
                          <InputLeftAddon
                            children="Item No"
                            minWidth={field_width}
                          />
                          <Input
                            name="tl_itemno"
                            value={value || ''}
                            width="100%"
                            onChange={onChange}
                            borderColor="gray.400"
                            //textTransform="capitalize"
                            ref={ref}
                            placeholder="item no"
                          />
                        </HStack>
                      </InputGroup>
                    )}
                  />
                </FormControl>
                <Box pt={0}>
                  <IconButton
                    onClick={() => handleItemSearch()}
                    icon={<AiOutlineSearch />}
                    size="md"
                    colorScheme="teal"
                  />
                </Box>
              </HStack>
            </GridItem>
            <GridItem colSpan={3}></GridItem>
            <GridItem colSpan={3} mt={field_gap}>
              <FormControl>
                <Controller
                  control={control}
                  name="tl_desp"
                  defaultValue={state.pl_desp}
                  render={({ field: { onChange, value, ref } }) => (
                    <InputGroup>
                      <HStack w="100%" py={1}>
                        <InputLeftAddon
                          children="Description"
                          minWidth={field_width}
                        />
                        <Input
                          name="tl_desp"
                          value={value || ''}
                          width="full"
                          onChange={onChange}
                          borderColor="gray.400"
                          //textTransform="capitalize"
                          ref={ref}
                          placeholder="item description"
                          minWidth="200"
                        />
                      </HStack>
                    </InputGroup>
                  )}
                />
              </FormControl>
            </GridItem>
            <GridItem colSpan={3} mt={field_gap}>
              <FormControl>
                <Controller
                  control={control}
                  name="tl_packing"
                  defaultValue={state.tl_packing}
                  render={({ field: { onChange, value, ref } }) => (
                    <InputGroup>
                      <HStack w="100%" py={1}>
                        <InputLeftAddon
                          children="Packing"
                          minWidth={field_width}
                        />
                        <Input
                          name="tl_packing"
                          value={value || ''}
                          width="full"
                          onChange={onChange}
                          borderColor="gray.400"
                          //textTransform="capitalize"
                          ref={ref}
                          placeholder="item packing"
                          minWidth="500"
                        />
                      </HStack>
                    </InputGroup>
                  )}
                />
              </FormControl>
            </GridItem>
            <GridItem colSpan={3} mt={field_gap}>
              <FormControl>
                <Controller
                  control={control}
                  name="tl_qty"
                  defaultValue={state.tl_qty}
                  render={({ field: { onChange, value, ref } }) => (
                    <InputGroup>
                      <HStack w="100%" py={1}>
                        <InputLeftAddon children="Qty" minWidth={field_width} />
                        <NumberInput
                          name="tl_qty"
                          value={value || 0}
                          precision={2}
                          //fixedDecimalScale
                          parser={value => value.replace(/\$\s?|(,*)/g, '')}
                          formatter={value =>
                            !Number.isNaN(parseFloat(value))
                              ? ` ${value}`.replace(
                                  /\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g,
                                  ','
                                )
                              : ' '
                          }
                          width="full"
                          onChange={e => {
                            onChange(e);
                            setQty(prev => (prev = e));
                          }}
                          //borderColor="gray.400"
                          //textTransform="capitalize"
                          ref={ref}
                          //placeholder="qty"
                          readOnly={isexpirydate}
                        />
                      </HStack>
                    </InputGroup>
                  )}
                />
              </FormControl>
            </GridItem>
            <GridItem colSpan={3} mt={field_gap}>
              <FormControl>
                <Controller
                  control={control}
                  name="tl_unit"
                  defaultValue={state.tl_unit}
                  render={({ field: { onChange, value, ref } }) => (
                    <InputGroup>
                      <HStack w="100%" py={1}>
                        <InputLeftAddon
                          children="Unit"
                          minWidth={field_width}
                        />
                        <Input
                          name="tl_unit"
                          value={value || ''}
                          width="35%"
                          onChange={onChange}
                          borderColor="gray.400"
                          //textTransform="capitalize"
                          ref={ref}
                          placeholder="unit"
                        />
                      </HStack>
                    </InputGroup>
                  )}
                />
              </FormControl>
            </GridItem>
            <GridItem colSpan={3} mt={field_gap}>
              <FormControl>
                <Controller
                  control={control}
                  name="tl_uprice"
                  defaultValue={state.tl_uprice}
                  render={({ field: { onChange, value, ref } }) => (
                    <InputGroup>
                      <HStack w="100%" py={1}>
                        <InputLeftAddon
                          children="Unit Price"
                          minWidth={field_width}
                        />
                        <NumberInput
                          name="tl_uprice"
                          value={value || 0}
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
                          onChange={e => {
                            onChange(e);
                            setUPrice(prev => (prev = e));
                          }}
                          //borderColor="gray.400"
                          //textTransform="capitalize"
                          ref={ref}
                          //placeholder="unit cost"
                        />
                      </HStack>
                    </InputGroup>
                  )}
                />
              </FormControl>
            </GridItem>
            <GridItem colSpan={3} mt={field_gap}>
              <FormControl>
                <Controller
                  control={control}
                  name="tl_amount"
                  defaultValue={state.tl_amount}
                  render={({ field: { onChange, value, ref } }) => (
                    <InputGroup>
                      <HStack w="100%" py={1}>
                        <InputLeftAddon
                          children="Amount"
                          minWidth={field_width}
                        />
                        <NumberInput
                          name="tl_amount"
                          value={value || 0}
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
                          onChange={onChange}
                          //borderColor="gray.400"
                          //textTransform="capitalize"
                          ref={ref}
                          //placeholder="amount"
                        />
                      </HStack>
                    </InputGroup>
                  )}
                />
              </FormControl>
            </GridItem>
            <GridItem colSpan={6} mt={field_gap}>
              <FormControl>
                <Controller
                  control={control}
                  name="tl_remark"
                  defaultValue={state.tl_remark}
                  render={({ field: { onChange, value, ref } }) => (
                    <InputGroup>
                      <HStack w="100%" py={1}>
                        <InputLeftAddon
                          children="Remark"
                          minWidth={field_width}
                        />
                        <Input
                          name="tl_remark"
                          value={value || ''}
                          width="full"
                          onChange={onChange}
                          borderColor="gray.400"
                          //textTransform="capitalize"
                          ref={ref}
                          placeholder="remark"
                        />
                      </HStack>
                    </InputGroup>
                  )}
                />
              </FormControl>
            </GridItem>
            {isexpirydate && (
              <>
                <GridItem colSpan={6}>
                  {/* <CustomReactTable
                    title="Expiry Lots Table"
                    data={lotstate}
                    columns={expirycolumns}
                    initialState={{
                      columnVisibility: {},
                      sorting: [{ id: 'tl_dateexpiry', desc: false }],
                      density: 'xs',
                    }}
                    //disableRowActionStatus={true}
                    disableExportStatus={true}
                    disableAddStatus={true}
                    //disableUpdateStatus={false}
                    disableDeleteStatus={true}
                    handleEdit={handleEditLotForm}
                  /> */}
                  <MantineReactTable table={table} />
                </GridItem>
              </>
            )}
            {trackserial && (
              <>
                <GridItem colSpan={6}>
                  <CustomReactTable
                    title="Serial No Table"
                    data={serialstate}
                    columns={serialcolumns}
                    initialState={{
                      columnVisibility: {},
                      sorting: [{ id: 'ts_serialno', desc: false }],
                      density: 'xs',
                    }}
                    //disableRowActionStatus={true}
                    disableExportStatus={true}
                    disableAddStatus={true}
                    //disableUpdateStatus={false}
                    disableDeleteStatus={true}
                    //handleEdit={handleEditLotForm}
                  />
                </GridItem>
              </>
            )}
          </Grid>
        </form>
      </VStack>
      <Modal opened={isSearchOpen} onClose={onSearchClose} size="5xl">
        <ItemSearchTable
          state={state}
          setState={setState}
          //add_Item={add_InvDetls}
          update_Item={update_ItemDetls}
          //statustype={statustype}
          //setStatusType={setStatusType}
          onItemSearchClose={onSearchClose}
        />
      </Modal>
      <Modal opened={isLotFormOpen} onClose={onLotFormClose} size="xl">
        <TranSalesLotForm
          state={batchlotform}
          setState={setBatchLotForm}
          //add_Item={add_InvDetls}
          update_Item={update_ItemDetls}
          //statustype={statustype}
          //setStatusType={setStatusType}
          onFormClose={onLotFormClose}
        />
      </Modal>
    </Flex>
  );
};
export default TranSalesDetlsForm;
