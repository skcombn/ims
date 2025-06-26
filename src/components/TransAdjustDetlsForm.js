import React, { useState, useEffect } from 'react';
import { MantineReactTable, useMantineReactTable } from 'mantine-react-table';
import { Controller, useForm } from 'react-hook-form';
import { useIsFetching } from '@tanstack/react-query';
import { formatPrice } from '../helpers/utils';
import { FiSave } from 'react-icons/fi';
import { AiOutlineSearch } from 'react-icons/ai';
import { ImExit } from 'react-icons/im';
import { useNavigate } from 'react-router-dom';
import { nanoid } from 'nanoid';
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
  Radio,
  RadioGroup,
  Stack,
  StackDivider,
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
import {
  IconEdit,
  IconTrash,
  IconSquareRoundedPlus,
  IconPlus,
} from '@tabler/icons-react';
import { IconDoorExit, IconSend } from '@tabler/icons-react';
import { useRecoilState } from 'recoil';
import {
  editTranadjustIdState,
  editTranadjustDetlsIdState,
  editTranadjustLotIdState,
} from '../data/atomdata';
import { useItemsExpiry } from '../react-query/itemsexpiry/useItemsExpiry';
import { useItemsSerial } from '../react-query/itemsserial/useItemsSerial';
import CustomReactTable from '../helpers/CustomReactTable';
import ItemSearchTable from './ItemSearchTable';

const TransAdjustDetlsForm = ({
  state,
  setState,
  lotsstate,
  setLotsState,
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
  //const [qtyonhand, setQtyOnhand] = useState(state.tad_qtyonhand);
  const [qtycount, setQtyCount] = useState(state.tad_qtycount);
  const [qtyadjust, setQtyAdjust] = useState(state.tad_qtyadjust);
  const [isexpirydate, setIsExpiryDate] = useState(state.tad_trackexpiry);
  const [batchlotform, setBatchLotForm] = useState();
  const [editBatchId, setEditBatchId] = useRecoilState(editTranadjustIdState);
  const [editBatchdetlsId, setEditBatchdetlsId] = useRecoilState(
    editTranadjustDetlsIdState
  );
  const [editBatchlotId, setEditBatchlotId] = useRecoilState(
    editTranadjustLotIdState
  );
  //const [ucost, setUCost] = useState(state.tad_netucost);
  //const [qty, setQty] = useState(state.tl_qty);
  //const [trackserial, setTrackSerial] = useState(state.tl_trackserial);

  console.log('batch detls form state', state);
  console.log('batch lot form state', lotsstate);
  const {
    isOpen: isSearchOpen,
    onOpen: onSearchOpen,
    onClose: onSearchClose,
  } = useDisclosure();

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
    },
  });

  const expirycolumns = [
    {
      header: 'PO No',
      accessorKey: 'tal_pono',
      enableEditing: false,
      size: 150,
    },
    {
      header: 'Expiry Date',
      accessorKey: 'tal_dateexpiry',
      enableEditing: false,
      size: 100,
    },
    {
      header: 'Qty Onhand',
      accessorKey: 'tal_qtyonhand',
      enableEditing: false,
      mantineTableBodyCellProps: {
        align: 'right',
      },
      size: 100,
    },
    {
      header: 'Qty Count',
      accessorKey: 'tal_qtycount',
      enableEditing: true,
      mantineTableBodyCellProps: {
        align: 'right',
      },
      size: 100,
    },
    {
      header: 'Qty Adjust',
      accessorKey: 'tal_qtyadjust',
      enableEditing: false,
      mantineTableBodyCellProps: {
        align: 'right',
      },
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
      parseFloat(values.tal_qtycount) > values.tal_qtyonhand
        ? values.tal_qtyonhand
        : parseFloat(values.tal_qtycount);
    const { original } = row;
    const { tal_id } = original;
    console.log('lotsave', values, original);
    const qtyadj = Math.round(qtyvalue - values.tal_qtyonhand, 2);
    const newData = [
      {
        ...original,
        tal_qtycount: qtyvalue,
        tal_qtyadjust: qtyadj,
      },
    ];
    const oldData = lotsstate.filter(r => r.tal_id !== original.tal_id);
    const allqty = oldData.reduce((acc, item) => {
      const value = isNaN(item.tal_qtycount) ? 0 : item.tal_qtycount;
      return acc + value;
    }, 0);

    setLotsState(prev => [...oldData, ...newData]);
    table.setEditingRow(null); //exit editing mode
    const newQty = allqty + qtyvalue;
    console.log('lotqtycalc', allqty, qtycount, newQty, oldData);
    setValue('tad_qtycount', newQty);
    setQtyCount(prev => (prev = newQty));
  };

  const table = useMantineReactTable({
    title: 'Expiry Lots Table',
    columns: expirycolumns,
    data: lotsstate,
    initialState: {
      columnVisibility: { tal_id: false },
      sorting: [{ id: 'tal_dateexpiry', desc: false }],
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
      </Flex>
    ),
  });

  const onSubmit = values => {
    //console.log('status', statustype);
    if (editBatchdetlsId.type === 'edit') {
      update_Item(values);
      update_LotItem(lotsstate);
    }
    if (editBatchdetlsId.type === 'add') {
      add_Item(values);
      add_LotItem(lotsstate);
    }
    onItemClose();
  };

  const handleExit = () => {
    onItemClose();
  };

  const update_ItemDetls = data => {
    console.log('upditem', data);
    const { item_no, item_desp, item_unit, item_qtyonhand, item_trackexpiry } =
      data;
    setValue('tad_itemno', item_no);
    setValue('tad_desp', item_desp);
    setValue('tad_unit', item_unit);
    setValue('tad_unit', item_unit);
    setValue('tad_qtyonhand', item_qtyonhand);
    setValue('tad_qtycount', item_qtyonhand);
    setValue('tad_trackexpiry', item_trackexpiry);
    //setValue('tl_ucost', item_ucost_pc);
    //setValue('tl_netucost', item_ucost_pc);
    setQtyCount(prev => (prev = 0));
    setQtyAdjust(prev => (prev = 0));
    setIsExpiryDate(item_trackexpiry);
    //setUCost(prev => (prev = item_cost));
    //update batchlots
    const newLotData = itemsexpiry
      .filter(r => r.ie_itemno === item_no && r.ie_post === '0')
      .map(rec => {
        return {
          tal_id: nanoid(),
          tal_batchno: editTranadjustIdState.no,
          tal_itemno: rec.ie_itemno,
          tal_lotno: rec.ie_lotno,
          tal_pono: rec.ie_pono,
          tal_dateexpiry: rec.ie_dateexpiry,
          tal_qtyonhand: rec.ie_qtyonhand,
          tal_qtycount: rec.ie_qtyonhand,
          tal_qtyadjust: 0,
        };
      });
    console.log('lot', newLotData);
    const lotdata = [{ ...lotsstate }, { ...newLotData }];
    console.log('lotstate add', lotdata);
    setLotsState([...lotsstate, ...newLotData]);
  };

  const calcQty = data => {
    const qtyqoh = getValues('tad_qtyonhand');
    const qtycnt = getValues('tad_qtycount');
    const qty = Math.round(qtycnt - qtyqoh, 2);
    setQtyAdjust(prev => (prev = qty));
    setValue('tad_qtyadjust', qty);
  };

  const handleItemSearch = () => {
    onSearchOpen();
  };

  useEffect(() => {
    calcQty();
  }, [qtycount]);

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
        p="0"
        spacing="10"
        //alignItems="flex-start"
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid
            templateColumns={{ base: 'none', md: 'repeat(4,1fr)' }}
            columnGap={{ base: 1, md: 3 }}
            pb={2}
          >
            <GridItem>
              <VStack alignItems={'flex-start'} px={1}>
                <Heading size="lg">Details Form</Heading>
                <Divider border="2px solid teal" w={250} />
              </VStack>
            </GridItem>
            <GridItem colSpan={2}></GridItem>
            <GridItem>
              <ButtonGroup gap={2}>
                <Button
                  variant={'outline'}
                  size="lg"
                  colorScheme="teal"
                  isLoading={isSubmitting}
                  type="submit"
                  onClick={handleSubmit(onSubmit)}
                  isDisabled={isFetching}
                  leftIcon={<IconSend />}
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
            templateColumns="9"
            templateRows="7"
            columnGap={3}
            rowGap={3}
            px={5}
            py={2}
            w={{ base: 'auto', md: 'full' }}
            border="1px solid teal"
            borderRadius="20"
          >
            <GridItem colSpan={3} mt={field_gap}>
              <HStack>
                <FormControl>
                  <Controller
                    control={control}
                    name="tad_itemno"
                    defaultValue={state.tad_itemno}
                    render={({ field: { onChange, value, ref } }) => (
                      <InputGroup>
                        <HStack w="100%" py={1}>
                          <InputLeftAddon
                            children="Item No"
                            minWidth={field_width}
                          />
                          <Input
                            name="tad_itemno"
                            value={value || ''}
                            width="full"
                            onChange={onChange}
                            borderColor="gray.400"
                            //textTransform="capitalize"
                            ref={ref}
                            placeholder="item no"
                            minWidth="100"
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
            <GridItem colSpan={9} mt={field_gap}>
              <FormControl>
                <Controller
                  control={control}
                  name="tad_desp"
                  defaultValue={state.tad_desp}
                  render={({ field: { onChange, value, ref } }) => (
                    <InputGroup>
                      <HStack w="100%" py={1}>
                        <InputLeftAddon
                          children="Description"
                          minWidth={field_width}
                        />
                        <Input
                          name="tad_desp"
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
            {/*  <GridItem colSpan={9} mt={field_gap}>
              <FormControl>
                <Controller
                  control={control}
                  name="tad_packing"
                  defaultValue={state.tad_packing}
                  render={({ field: { onChange, value, ref } }) => (
                    <InputGroup>
                      <HStack w="100%" py={1}>
                        <InputLeftAddon
                          children="Packing"
                          minWidth={field_width}
                        />
                        <Input
                          name="tad_packing"
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
            </GridItem> */}

            <GridItem colSpan={9} mt={field_gap}>
              <FormControl>
                <Controller
                  control={control}
                  name="tad_qtyonhand"
                  defaultValue={state.tad_qtyonhand}
                  render={({ field: { onChange, value, ref } }) => (
                    <InputGroup>
                      <HStack w="100%" py={1}>
                        <InputLeftAddon
                          children="Qty Onhand"
                          minWidth={field_width}
                        />
                        <NumberInput
                          name="tad_qtyonhand"
                          value={value || 0}
                          width="full"
                          precision={2}
                          parser={value => value.replace(/\$\s?|(,*)/g, '')}
                          formatter={value =>
                            !Number.isNaN(parseFloat(value))
                              ? ` ${value}`.replace(
                                  /\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g,
                                  ','
                                )
                              : ' '
                          }
                          onChange={e => {
                            onChange(e);
                          }}
                          //borderColor="gray.400"
                          //textTransform="capitalize"
                          ref={ref}
                          //placeholder="qty"
                          readOnly
                        />
                      </HStack>
                    </InputGroup>
                  )}
                />
              </FormControl>
            </GridItem>
            <GridItem colSpan={9} mt={field_gap}>
              <FormControl>
                <Controller
                  control={control}
                  name="tad_unit"
                  defaultValue={state.tad_unit}
                  render={({ field: { onChange, value, ref } }) => (
                    <InputGroup>
                      <HStack w="100%" py={1}>
                        <InputLeftAddon
                          children="Unit"
                          minWidth={field_width}
                        />
                        <Input
                          name="tad_unit"
                          value={value || ''}
                          width="full"
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
            <GridItem colSpan={9} mt={field_gap}>
              <FormControl>
                <Controller
                  control={control}
                  name="tad_qtycount"
                  defaultValue={state.tad_qtycount}
                  render={({ field: { onChange, value, ref } }) => (
                    <InputGroup>
                      <HStack w="100%" py={1}>
                        <InputLeftAddon
                          children="Qty Count"
                          minWidth={field_width}
                        />
                        <NumberInput
                          name="tad_qtycount"
                          value={value || 0}
                          width="full"
                          precision={2}
                          parser={value => value.replace(/\$\s?|(,*)/g, '')}
                          formatter={value =>
                            !Number.isNaN(parseFloat(value))
                              ? ` ${value}`.replace(
                                  /\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g,
                                  ','
                                )
                              : ' '
                          }
                          onChange={e => {
                            onChange(e);
                            setQtyCount(prev => (prev = e));
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
            <GridItem colSpan={9} mt={field_gap}>
              <FormControl>
                <Controller
                  control={control}
                  name="tad_qtyadjust"
                  defaultValue={state.tad_qtyadjust}
                  render={({ field: { onChange, value, ref } }) => (
                    <InputGroup>
                      <HStack w="100%" py={1}>
                        <InputLeftAddon
                          children="Qty Adjust"
                          minWidth={field_width}
                        />
                        <NumberInput
                          name="tad_qtyadjust"
                          value={value || 0}
                          width="full"
                          precision={2}
                          parser={value => value.replace(/\$\s?|(,*)/g, '')}
                          formatter={value =>
                            !Number.isNaN(parseFloat(value))
                              ? ` ${value}`.replace(
                                  /\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g,
                                  ','
                                )
                              : ' '
                          }
                          onChange={e => {
                            onChange(e);
                          }}
                          //borderColor="gray.400"
                          //textTransform="capitalize"
                          ref={ref}
                          //placeholder="qty"
                          readOnly
                        />
                      </HStack>
                    </InputGroup>
                  )}
                />
              </FormControl>
            </GridItem>

            <GridItem colSpan={9} mt={field_gap}>
              <FormControl>
                <Controller
                  control={control}
                  name="tad_remark"
                  defaultValue={state.tad_remark}
                  render={({ field: { onChange, value, ref } }) => (
                    <InputGroup>
                      <HStack w="100%" py={1}>
                        <InputLeftAddon
                          children="Remark"
                          minWidth={field_width}
                        />
                        <Input
                          name="tad_remark"
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
                  <MantineReactTable table={table} />
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
    </Flex>
  );
};

export default TransAdjustDetlsForm;
