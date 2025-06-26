import React, { useState, useEffect } from 'react';
import { useIsFetching } from '@tanstack/react-query';
import { Controller, useForm } from 'react-hook-form';
import { round } from 'lodash';
import { Toast } from '../helpers/CustomToastify';
import { ImExit } from 'react-icons/im';
import { AddIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';
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
  Text,
  VStack,
  ScaleFade,
  Wrap,
  WrapItem,
  useRadio,
  useRadioGroup,
  useDisclosure,
  useColorMode,
  useColorModeValue,
  useBreakpointValue,
} from '@chakra-ui/react';
import { Modal, NumberInput, Select, Switch, Tabs } from '@mantine/core';
import { useRecoilState } from 'recoil';
import { itemState, editItemIdState } from '../data/atomdata';
import { IconDoorExit, IconSend } from '@tabler/icons-react';
import { useItems } from '../react-query/items/useItems';
import { useItemsHistory } from '../react-query/itemshistory/useItemsHistory';
import { useItemsHistMthView } from '../react-query/itemshistmthview/useItemsHistMthView';
import { useItemsHistoryGroupByItemno } from '../react-query/itemshistory/useItemsHistoryGroupByItemno';
import { useAddItem } from '../react-query/items/useAddItem';
import { useUpdateItem } from '../react-query/items/useUpdateItem';
import { useItemGroups } from '../react-query/itemgroup/useItemGroups';
import { useGroups } from '../react-query/groups/useGroups';
import ItemHistDetlsTable from './ItemHistDetlsTable';
import GroupForm from './GroupForm';

const initial_item = [
  {
    item_no: '',
    item_desp: '',
    item_unit: '',
    item_packing: '',
    item_category: '',
    item_brand: '',
    item_location: '',
    item_dept: '',
    item_uprice_pc: 0,
    item_uprice_ctn: 0,
    item_pfactor: 1,
    item_qtyhand: 0,
    item_nonstock: false,
    item_type: '',
    item_smcode: '',
  },
];

const initial_group = {
  group_desp: '',
  group_category: '',
};

const initial_totals = {
  totpoqty: 0,
  totpoamt: 0,
  totpoinvoiceqty: 0,
  totpoinvoiceamt: 0,
  totpocashqty: 0,
  totpocashamt: 0,
  totpocreditqty: 0,
  totpocreditamt: 0,
  totpodebitqty: 0,
  totpodebitamt: 0,
  totsalesqty: 0,
  totsalesamt: 0,
  totsalescashqty: 0,
  totsalescashamt: 0,
  totsalesinvoiceqty: 0,
  totsalesinvoiceamt: 0,
  totsalescreditqty: 0,
  totsalescreditamt: 0,
  totsalesdebitqty: 0,
  totsalesdebitamt: 0,
  totadjustqty: 0,
  totadjustamt: 0,
  totqtyonhand: 0,
  totamount: 0,
};

const ItemForm = () => {
  const isFetching = useIsFetching();
  const navigate = useNavigate();
  const field_width = '150';
  const field_gap = '3';
  const [itemstate, setItemState] = useRecoilState(itemState);
  const [editItemId, setEditItemId] = useRecoilState(editItemIdState);
  const { items } = useItems();
  const addItem = useAddItem();
  const updateItem = useUpdateItem();
  const { itemshistory, setItemhistItemno } = useItemsHistory();
  const { itemshistmthview, setHistMthViewItemno } = useItemsHistMthView();
  const { itemsgroups } = useItemGroups();
  const { groups } = useGroups();
  const [groupstate, setGroupState] = useState('');
  const [grouptype, setGrouptype] = useState('');
  const [groupstatustype, setGroupStatusType] = useState('');
  const [isnonstock, setIsnonstock] = useState(false);
  const [isinactive, setIsInactive] = useState(false);
  const [itemtype, setItemtype] = useState(false);
  const [storea, setStorea] = useState(itemstate.item_storea);
  const [storeb, setStoreb] = useState(itemstate.item_storeb);
  const [storef, setStoref] = useState(itemstate.item_storef);
  const [activeTab, setActiveTab] = useState('first');
  const [isCalc, setIsCalc] = useState(false);
  const [totals, setTotals] = useState(initial_totals);
  const {
    isOpen: isGroupOpen,
    onOpen: onGroupOpen,
    onClose: onGroupClose,
  } = useDisclosure();

  const histdata = itemshistory
    .filter(r => r.it_itemno === editItemId.no)
    .map(rec => {
      return { ...rec };
    });

  const histmthdata = itemshistmthview
    .filter(r => r.it_itemno === editItemId.no)
    .map(rec => {
      return { ...rec };
    });

  console.log('totals', totals);
  //console.log('itemshistory', itemshistory);
  console.log('itemhistmthview', itemshistmthview);

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
      ...itemstate,
    },
  });

  const onSubmit = values => {
    const { item_no } = values;
    const found = items.some(el => el.item_no === item_no);

    //const newData = { ...values, item_inactive: isinactive };
    if (editItemId.status === 'edit') {
      update_Item(values);
      navigate(-1);
    }
    if (editItemId.status === 'add') {
      if (found) {
        Toast({
          title: `This item no ${item_no} is existed!`,
          status: 'warning',
          customId: 'itemupdAdd',
        });
      } else {
        add_Item(values);
        navigate(-1);
      }
    }
  };

  const handleClose = () => {
    navigate(-1);
  };

  const handleAddGroup = grouptype => {
    setGrouptype(grouptype);
    setGroupStatusType(prev => (prev = 'add'));
    const data = { ...initial_group };
    setGroupState(data);
    onGroupOpen();
  };

  const add_Item = data => {
    //console.log('add', data);
    addItem(data);
  };

  const update_Item = data => {
    updateItem(data);
  };

  const handleUpdQtyOnhand = () => {
    setValue('item_qtyhand', totals.totqtyonhand);
    setValue('item_storea', totals.totqtyonhand);
  };

  const handleCalcTotals = () => {
    console.log('calc here', editItemId.no);

    var totpoinvoiceqty = 0,
      totpoinvoiceamt = 0,
      totpocashqty = 0,
      totpocashamt = 0,
      totpocreditqty = 0,
      totpocreditamt = 0,
      totpodebitqty = 0,
      totpodebitamt = 0,
      totsalescashqty = 0,
      totsalescashamt = 0,
      totsalesinvoiceqty = 0,
      totsalesinvoiceamt = 0,
      totsalescreditqty = 0,
      totsalescreditamt = 0,
      totsalesdebitqty = 0,
      totsalesdebitamt = 0,
      totadjustqty = 0,
      totadjustamt = 0,
      totpoqty = 0,
      totpoamt = 0,
      totsalesqty = 0,
      totsalesamt = 0,
      totqtyonhand = 0,
      totstorea = 0,
      totstoreb = 0,
      totstoref = 0,
      totamount = 0;

    const ucost = getValues('item_cost');

    histmthdata
      .filter(r => r.it_itemno === editItemId.no)
      .forEach(rec => {
        //console.log('ittype', rec.it_type);
        switch (rec.it_type) {
          case 'POInvoice':
            console.log('poinvoice');
            totpoinvoiceqty = round(totpoinvoiceqty + rec.it_totalqty, 3);
            totpoinvoiceamt = round(totpoinvoiceamt + rec.it_totalamt, 2);
            return null;
          case 'POCash':
            totpocashqty = round(totpocashqty + rec.rec.it_totalqty, 3);
            totpocashamt = round(totpocashamt + rec.it_totalamt, 2);
            return null;
          case 'POCredit':
            console.log('pocredit');
            totpocreditqty = round(totpocreditqty + rec.it_totalqty, 3);
            totpocreditamt = round(totpocreditamt + rec.it_totalamt, 2);
            return null;
          case 'PODebit':
            totpodebitqty = round(totpodebitqty + rec.it_totalqty, 3);
            totpodebitamt = round(totpodebitamt + rec.it_totalamt, 2);
            return null;
          case 'Invoice':
            totsalesinvoiceqty = round(totsalesinvoiceqty + rec.it_totalqty, 3);
            totsalesinvoiceamt = round(totsalesinvoiceamt + rec.it_totalamt, 2);
            return null;
          case 'Cash':
            totsalescashqty = round(totsalescashqty + rec.it_totalqty, 3);
            totsalescashamt = round(totsalescashamt + rec.it_totalamt, 2);
            return null;
          case 'Debit':
            totsalesdebitqty = round(totsalesdebitqty + rec.it_totalqty, 3);
            totsalesdebitamt = round(totsalesdebitamt + rec.it_totalamt, 2);
            return null;
          case 'Credit':
            totsalescreditqty = round(totsalescreditqty + rec.it_totalqty, 3);
            totsalescreditamt = round(totsalescreditamt + rec.it_totalamt, 2);
            return null;
          case 'Adjustment':
            totadjustqty = round(totadjustqty + rec.it_totalqty, 3);
            totadjustamt = round(totadjustamt + rec.it_totalamt, 2);
            return null;
          default:
            return null;
        }
      });

    totpoqty = totpoinvoiceqty + totpocashqty;
    totpoamt = totpoinvoiceamt + totpocashamt;
    totqtyonhand =
      totpoinvoiceqty +
      totpocashqty +
      totpodebitqty -
      totpocreditqty -
      totsalesinvoiceqty -
      totsalescashqty -
      totsalesdebitqty +
      totsalescreditqty;
    totamount = round(totqtyonhand * ucost, 2);
    // const totpoqty = itemshistory
    //   .filter(r => r.it_itemno === item_no && r.it_transtype === 'Purchase')
    //   .reduce((acc, item) => {
    //     return acc + item.it_qty;
    //   }, 0);
    // const totpoamt = itemshistory
    //   .filter(r => r.it_itemno === item_no && r.it_transtype === 'Purchase')
    //   .reduce((acc, item) => {
    //     return acc + item.it_extvalue;
    //   }, 0);

    setTotals(
      prev =>
        (prev = {
          ...prev,
          totpoqty: totpoinvoiceqty,
          totpoamt: totpoinvoiceamt,
          totpoinvoiceqty: totpoinvoiceqty,
          totpoinvoiceamt: totpoinvoiceamt,
          totpocashqty: totpocashqty,
          totpocashamt: totpocashamt,
          totpocreditqty: totpocreditqty,
          totpocreditamt: totpocreditamt,
          totpodebitqty: totpodebitqty,
          totpodebitamt: totpodebitamt,
          totsalesqty: totsalesinvoiceqty + totsalescashqty,
          totsalesamt: totsalesinvoiceamt + totsalescashamt,
          totsalesinvoiceqty: totsalesinvoiceqty,
          totsalesinvoiceamt: totsalesinvoiceamt,
          totsalescashqty: totsalescashqty,
          totsalescashamt: totsalescashamt,
          totsalesdebitqty: totsalesdebitqty,
          totsalesdebitamt: totsalesdebitamt,
          totsalescreditqty: totsalescreditqty,
          totsalescreditamt: totsalescreditamt,
          totadjustqty: totadjustqty,
          totadjustamt: totadjustamt,
          totqtyonhand: totqtyonhand,
          totamount: totamount,
        })
    );
    //setIsCalc(false);
  };

  /* useEffect(() => {
    const amt = storea + storeb + storef;
    setValue('item_qtyhand', amt);
  }, [storea, storeb, storef]); */

  useEffect(() => {
    //console.log('useeffect here');
    setItemhistItemno(editItemId.no);
    setHistMthViewItemno(editItemId.no);
    setIsnonstock(itemstate.item_nonstock);
    setIsInactive(itemstate.item_inactive);
    //setItemtype(editItemId.type);
    //setIsCalc(true);
  }, []);

  useEffect(() => {
    console.log('use effect calc here', isCalc);
    handleCalcTotals();
  }, [!isFetching]);

  return (
    <Box
      h={{ base: 'auto', md: 'auto' }}
      py={[0, 0, 0]}
      direction={{ base: 'column-reverse', md: 'row' }}
      overflowY="scroll"
      mx={5}
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
          <VStack
            w={{ base: 'auto', md: 'full' }}
            h={{ base: 'auto', md: 'full' }}
            spacing="2"
            alignItems="flex-start"
          >
            <Grid templateColumns="repeat(12, 1fr)" gap={1}>
              <GridItem colSpan={2}>
                <VStack alignItems={'flex-start'} px={1}>
                  <Heading size="lg">Item Update</Heading>
                  <Divider border="2px solid teal" />
                </VStack>
              </GridItem>
              <GridItem colSpan={4}></GridItem>
              <GridItem colSpan={4}></GridItem>
              <GridItem colSpan={2}>
                <HStack>
                  <ButtonGroup>
                    <Button
                      // mt={4}
                      // ml={4}
                      colorScheme="teal"
                      isLoading={isSubmitting}
                      //type="submit"
                      variant="outline"
                      size="lg"
                      leftIcon={<IconSend />}
                      onClick={handleSubmit(onSubmit)}
                      isDisabled={isFetching}
                    >
                      Submit
                    </Button>
                    <Button
                      // mt={4}
                      // ml={10}
                      colorScheme="teal"
                      isLoading={isSubmitting}
                      onClick={handleClose}
                      variant="outline"
                      size="lg"
                      leftIcon={<IconDoorExit />}
                    >
                      Exit
                    </Button>
                  </ButtonGroup>
                </HStack>
              </GridItem>
            </Grid>

            {/*   <Divider border="2px solid teal" /> */}
            <Box>
              <Grid templateColumns="repeat(12, 1fr)" gap={1}>
                <GridItem
                  colSpan={12}
                  w="100%"
                  h="auto"
                  border="1px solid teal"
                  borderRadius={10}
                  gap={0}
                  p={5}
                >
                  <Grid templateColumns="repeat(12, 1fr)" gap={1}>
                    <GridItem colSpan={2}>
                      <FormControl>
                        <Controller
                          control={control}
                          name="item_no"
                          defaultValue={itemstate.item_no}
                          render={({ field: { onChange, value, ref } }) => (
                            <VStack align="left" textAlign="left">
                              <Text as="b" fontSize="sm">
                                Item No
                              </Text>
                              <Input
                                name="item_no"
                                value={value || ''}
                                width="full"
                                onChange={onChange}
                                borderColor="gray.400"
                                //textTransform="capitalize"
                                ref={ref}
                                placeholder="item no"
                                //minWidth="100"
                              />
                            </VStack>
                          )}
                        />
                      </FormControl>
                    </GridItem>
                    {/*   <GridItem colSpan={2} mt={field_gap} pt={5} pl={2}>
                    <FormControl>
                    <Controller
                    control={control}
                    name="item_nonstock"
                    defaultValue={isnonstock}
                    render={({ field: { onChange, value, ref } }) => (
                      <HStack>
                      <Checkbox
                      name="item_nonstock"
                      value={value || ''}
                      width="full"
                      onChange={e => {
                                onChange(e.target.checked);
                                setIsnonstock(e.target.checked);
                                }}
                                borderColor="gray.400"
                                //textTransform="capitalize"
                                ref={ref}
                                >
                                <Text as="b">Non-Stock</Text>
                                </Checkbox>
                                </HStack>
                                )}
                                />
                                </FormControl>
                                </GridItem> */}
                    {/*  <GridItem colSpan={2} mt={field_gap} pt={5} pl={2}>
                      <FormControl>
                        <Controller
                          control={control}
                          name="item_inactive"
                          defaultValue={isinactive}
                          render={({ field: { onChange, value, ref } }) => (
                            <HStack>
                              <Checkbox
                                name="item_inactive"
                                value={value}
                                width="full"
                                isChecked={isinactive}
                                onChange={e => {
                                  onChange(e.target.checked);
                                  setIsInactive(e.target.checked);
                                }}
                                borderColor="gray.400"
                                //textTransform="capitalize"
                                ref={ref}
                              >
                                <Text as="b">Inactive</Text>
                              </Checkbox>
                            </HStack>
                          )}
                        />
                      </FormControl>
                    </GridItem> */}
                    <GridItem
                      colSpan={2}
                      w="100%"
                      h="auto"
                      px={1}
                      //border="1px solid"
                    >
                      <HStack>
                        <FormControl>
                          <Controller
                            control={control}
                            name="item_inactive"
                            defaultValue={isinactive}
                            render={({ field: { onChange, value, ref } }) => (
                              <VStack w="100%" pt={7} align="center">
                                {/*  <Text as="b" fontSize="sm" textAlign="left" p={1}>
                            Unit Price
                            </Text> */}
                                <Switch
                                  name="item_inactive"
                                  value={value || 0}
                                  label={
                                    <Heading size="sm" pt={2}>
                                      Inactive
                                    </Heading>
                                  }
                                  onLabel="ON"
                                  offLabel="OFF"
                                  size="xl"
                                  precision={2}
                                  checked={isinactive}
                                  width="full"
                                  onChange={e => {
                                    onChange(e.target.checked);
                                    setIsInactive(e.target.checked);
                                  }}
                                  //borderColor="gray.400"
                                  //textTransform="capitalize"
                                  ref={ref}
                                  //placeholder="price"
                                />
                              </VStack>
                            )}
                          />
                        </FormControl>
                      </HStack>
                    </GridItem>
                    <GridItem colSpan={4}>
                      <FormControl>
                        <Controller
                          control={control}
                          name="item_desp"
                          defaultValue={itemstate.item_desp}
                          render={({ field: { onChange, value, ref } }) => (
                            <VStack align="left" textAlign="left">
                              {/* <FormLabel>Description</FormLabel> */}
                              <Text as="b" fontSize="sm">
                                Description
                              </Text>
                              <Input
                                name="item_desp"
                                value={value || ''}
                                width="full"
                                onChange={onChange}
                                borderColor="gray.400"
                                //textTransform="capitalize"
                                ref={ref}
                                placeholder="description"

                                //minWidth="100"
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
                          name="item_pack"
                          defaultValue={itemstate.item_pack}
                          render={({ field: { onChange, value, ref } }) => (
                            <VStack align="left" py={0} textAlign="left">
                              <Text as="b" fontSize="sm">
                                Packing
                              </Text>
                              <Input
                                name="item_pack"
                                value={value || ''}
                                width="full"
                                onChange={onChange}
                                borderColor="gray.400"
                                //textTransform="capitalize"
                                ref={ref}
                                placeholder="packing"
                                //minWidth="100"
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
                          name="item_unit"
                          defaultValue={itemstate.item_unit}
                          render={({ field: { onChange, value, ref } }) => (
                            <VStack
                              w="100%"
                              py={0}
                              align="left"
                              textAlign="left"
                            >
                              <Text as="b" fontSize="sm">
                                Unit
                              </Text>
                              <Input
                                name="item_unit"
                                value={value || ''}
                                width="full"
                                onChange={onChange}
                                borderColor="gray.400"
                                //textTransform="capitalize"
                                ref={ref}
                                placeholder="unit"
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
                          name="item_phydate"
                          defaultValue={itemstate.item_phydate}
                          render={({ field: { onChange, value, ref } }) => (
                            <VStack
                              w="100%"
                              py={0}
                              align="left"
                              textAlign="left"
                            >
                              <Text as="b" fontSize="sm">
                                Physical Date
                              </Text>
                              <Input
                                name="item_phydate"
                                value={value || ''}
                                width="full"
                                type="date"
                                onChange={onChange}
                                borderColor="gray.400"
                                //textTransform="capitalize"
                                ref={ref}
                                placeholder="physical date"
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
                          name="item_cost"
                          defaultValue={itemstate.item_cost}
                          render={({ field: { onChange, value, ref } }) => (
                            <VStack
                              w="100%"
                              py={0}
                              align="left"
                              textAlign="left"
                            >
                              <Text as="b" fontSize="sm">
                                Unit Cost
                              </Text>
                              <NumberInput
                                name="item_cost"
                                value={value || 0}
                                precision={2}
                                //fixedDecimalScale
                                parser={value =>
                                  value.replace(/\$\s?|(,*)/g, '')
                                }
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
                                // borderColor="gray.400"
                                //textTransform="capitalize"
                                ref={ref}
                                //placeholder="ws price"
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
                          name="item_qtyhand"
                          defaultValue={itemstate.item_qtyhand}
                          render={({ field: { onChange, value, ref } }) => (
                            <VStack
                              w="100%"
                              py={0}
                              align="left"
                              textAlign="left"
                            >
                              <Text as="b" fontSize="sm">
                                Qty Onhand
                              </Text>
                              <NumberInput
                                name="item_qtyhand"
                                value={value || 0}
                                precision={3}
                                parser={value =>
                                  value.replace(/\$\s?|(,*)/g, '')
                                }
                                formatter={value =>
                                  !Number.isNaN(parseFloat(value))
                                    ? `${value}`.replace(
                                        /\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g,
                                        ','
                                      )
                                    : ''
                                }
                                size="md"
                                width="full"
                                onChange={onChange}
                                //borderColor="gray.400"
                                //textTransform="capitalize"
                                ref={ref}
                                placeholder="qty onhand"
                                readOnly
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
                          name="item_storea"
                          defaultValue={itemstate.item_storea}
                          render={({ field: { onChange, value, ref } }) => (
                            <VStack
                              w="100%"
                              py={0}
                              align="left"
                              textAlign="left"
                            >
                              <Text as="b" fontSize="sm">
                                Store A
                              </Text>
                              <NumberInput
                                name="item_storea"
                                value={value || 0}
                                precision={3}
                                parser={value =>
                                  value.replace(/\$\s?|(,*)/g, '')
                                }
                                formatter={value =>
                                  !Number.isNaN(parseFloat(value))
                                    ? `${value}`.replace(
                                        /\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g,
                                        ','
                                      )
                                    : ''
                                }
                                size="md"
                                width="full"
                                onChange={onChange}
                                //borderColor="gray.400"
                                //textTransform="capitalize"
                                ref={ref}
                                placeholder="store a"
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
                          name="item_storeb"
                          defaultValue={itemstate.item_storeb}
                          render={({ field: { onChange, value, ref } }) => (
                            <VStack
                              w="100%"
                              py={0}
                              align="left"
                              textAlign="left"
                            >
                              <Text as="b" fontSize="sm">
                                Store B
                              </Text>
                              <NumberInput
                                name="item_storeb"
                                value={value || 0}
                                precision={3}
                                parser={value =>
                                  value.replace(/\$\s?|(,*)/g, '')
                                }
                                formatter={value =>
                                  !Number.isNaN(parseFloat(value))
                                    ? `${value}`.replace(
                                        /\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g,
                                        ','
                                      )
                                    : ''
                                }
                                size="md"
                                width="full"
                                onChange={onChange}
                                //borderColor="gray.400"
                                //textTransform="capitalize"
                                ref={ref}
                                placeholder="store b"
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
                          name="item_storef"
                          defaultValue={itemstate.item_storef}
                          render={({ field: { onChange, value, ref } }) => (
                            <VStack
                              w="100%"
                              py={0}
                              align="left"
                              textAlign="left"
                            >
                              <Text as="b" fontSize="sm">
                                Store F
                              </Text>
                              <NumberInput
                                name="item_storef"
                                value={value || 0}
                                precision={3}
                                parser={value =>
                                  value.replace(/\$\s?|(,*)/g, '')
                                }
                                formatter={value =>
                                  !Number.isNaN(parseFloat(value))
                                    ? `${value}`.replace(
                                        /\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g,
                                        ','
                                      )
                                    : ''
                                }
                                size="md"
                                width="full"
                                onChange={onChange}
                                //borderColor="gray.400"
                                //textTransform="capitalize"
                                ref={ref}
                                placeholder="store f"
                              />
                            </VStack>
                          )}
                        />
                      </FormControl>
                    </GridItem>

                    <GridItem colSpan={12}>
                      <Divider border="2px solid teal" />
                    </GridItem>
                    <GridItem colSpan={12}>
                      <Box>
                        <Tabs value={activeTab} onTabChange={setActiveTab}>
                          <Tabs.List>
                            <Tabs.Tab value="first">
                              <VStack alignItems={'flex-start'} p={1}>
                                <Heading size="md">Details</Heading>
                              </VStack>
                            </Tabs.Tab>
                            <Tabs.Tab value="second">
                              <VStack alignItems={'flex-start'} p={1}>
                                <Heading size="md">History</Heading>
                              </VStack>
                            </Tabs.Tab>
                          </Tabs.List>

                          <Tabs.Panel value="first">
                            <Stack pt={1}>
                              <Grid templateColumns="repeat(12, 1fr)" gap={1}>
                                <GridItem colSpan={2}>
                                  <FormControl>
                                    <Controller
                                      control={control}
                                      name="item_qq"
                                      defaultValue={itemstate.item_qq}
                                      render={({
                                        field: { onChange, value, ref },
                                      }) => (
                                        <VStack
                                          w="100%"
                                          py={1}
                                          align="left"
                                          textAlign="left"
                                        >
                                          <Text as="b" fontSize="sm">
                                            Packing Factor
                                          </Text>
                                          <NumberInput
                                            name="item_qq"
                                            value={value || 0}
                                            precision={2}
                                            parser={value =>
                                              value.replace(/\$\s?|(,*)/g, '')
                                            }
                                            formatter={value =>
                                              !Number.isNaN(parseFloat(value))
                                                ? `${value}`.replace(
                                                    /\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g,
                                                    ','
                                                  )
                                                : ''
                                            }
                                            size="md"
                                            width="full"
                                            onChange={onChange}
                                            //borderColor="gray.400"
                                            //textTransform="capitalize"
                                            ref={ref}
                                            placeholder="packing factor"
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
                                      name="item_minlvl"
                                      defaultValue={itemstate.item_minlgl}
                                      render={({
                                        field: { onChange, value, ref },
                                      }) => (
                                        <VStack
                                          align="left"
                                          py={1}
                                          textAlign="left"
                                        >
                                          {/* <FormLabel>Description</FormLabel> */}
                                          <Text as="b" fontSize="sm">
                                            Min Level
                                          </Text>
                                          <NumberInput
                                            name="item_minlvl"
                                            value={value || 0}
                                            precision={3}
                                            parser={value =>
                                              value.replace(/\$\s?|(,*)/g, '')
                                            }
                                            formatter={value =>
                                              !Number.isNaN(parseFloat(value))
                                                ? `${value}`.replace(
                                                    /\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g,
                                                    ','
                                                  )
                                                : ''
                                            }
                                            size="md"
                                            width="full"
                                            onChange={onChange}
                                            //borderColor="gray.400"
                                            //textTransform="capitalize"
                                            ref={ref}
                                            placeholder="minimum level"

                                            //minWidth="100"
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
                                      name="item_wsp"
                                      defaultValue={itemstate.item_wsp}
                                      render={({
                                        field: { onChange, value, ref },
                                      }) => (
                                        <VStack
                                          w="100%"
                                          py={1}
                                          align="left"
                                          textAlign="left"
                                        >
                                          <Text as="b" fontSize="sm">
                                            WS. Price
                                          </Text>
                                          <NumberInput
                                            name="item_wsp"
                                            value={value || 0}
                                            precision={2}
                                            //fixedDecimalScale
                                            parser={value =>
                                              value.replace(/\$\s?|(,*)/g, '')
                                            }
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
                                            // borderColor="gray.400"
                                            //textTransform="capitalize"
                                            ref={ref}
                                            placeholder="ws price"
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
                                      name="item_comm"
                                      defaultValue={itemstate.item_comm}
                                      render={({
                                        field: { onChange, value, ref },
                                      }) => (
                                        <VStack
                                          w="100%"
                                          py={1}
                                          align="left"
                                          textAlign="left"
                                        >
                                          <Text as="b" fontSize="sm">
                                            Comm
                                          </Text>
                                          <NumberInput
                                            name="item_comm"
                                            value={value || 0}
                                            precision={2}
                                            //fixedDecimalScale
                                            parser={value =>
                                              value.replace(/\$\s?|(,*)/g, '')
                                            }
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
                                            placeholder="comm"
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
                                      name="item_rsp"
                                      defaultValue={itemstate.item_rsp}
                                      render={({
                                        field: { onChange, value, ref },
                                      }) => (
                                        <VStack
                                          w="100%"
                                          py={1}
                                          align="left"
                                          textAlign="left"
                                        >
                                          <Text as="b" fontSize="sm">
                                            Retail Price
                                          </Text>
                                          <NumberInput
                                            name="item_rsp"
                                            value={value || 0}
                                            precision={2}
                                            // fixedDecimalScale
                                            parser={value =>
                                              value.replace(/\$\s?|(,*)/g, '')
                                            }
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
                                            placeholder="retail price"
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
                                      name="item_cif"
                                      defaultValue={itemstate.item_cif}
                                      render={({
                                        field: { onChange, value, ref },
                                      }) => (
                                        <VStack
                                          w="100%"
                                          py={1}
                                          align="left"
                                          textAlign="left"
                                        >
                                          <Text as="b" fontSize="sm">
                                            CIF
                                          </Text>
                                          <NumberInput
                                            name="item_cif"
                                            value={value || 0}
                                            precision={2}
                                            //fixedDecimalScale
                                            parser={value =>
                                              value.replace(/\$\s?|(,*)/g, '')
                                            }
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
                                            // borderColor="gray.400"
                                            //textTransform="capitalize"
                                            ref={ref}
                                            placeholder="cif"
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
                                      name="item_inf"
                                      defaultValue={itemstate.item_inf}
                                      render={({
                                        field: { onChange, value, ref },
                                      }) => (
                                        <VStack
                                          w="100%"
                                          py={1}
                                          align="left"
                                          textAlign="left"
                                        >
                                          <Text as="b" fontSize="sm">
                                            Insurance Fee
                                          </Text>
                                          <NumberInput
                                            name="item_inf"
                                            value={value || 0}
                                            precision={2}
                                            //fixedDecimalScale
                                            parser={value =>
                                              value.replace(/\$\s?|(,*)/g, '')
                                            }
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
                                            placeholder="insurance fee"
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
                                      name="item_duty"
                                      defaultValue={itemstate.item_duty}
                                      render={({
                                        field: { onChange, value, ref },
                                      }) => (
                                        <VStack
                                          w="100%"
                                          py={1}
                                          align="left"
                                          textAlign="left"
                                        >
                                          <Text as="b" fontSize="sm">
                                            Duty
                                          </Text>
                                          <NumberInput
                                            name="item_duty"
                                            value={value || 0}
                                            precision={2}
                                            //fixedDecimalScale
                                            parser={value =>
                                              value.replace(/\$\s?|(,*)/g, '')
                                            }
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
                                            placeholder="duty"
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
                                      name="item_fob"
                                      defaultValue={itemstate.item_fob}
                                      render={({
                                        field: { onChange, value, ref },
                                      }) => (
                                        <VStack
                                          w="100%"
                                          py={1}
                                          align="left"
                                          textAlign="left"
                                        >
                                          <Text as="b" fontSize="sm">
                                            FOB
                                          </Text>
                                          <NumberInput
                                            name="item_fob"
                                            value={value || 0}
                                            precision={2}
                                            parser={value =>
                                              value.replace(/\$\s?|(,*)/g, '')
                                            }
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
                                            placeholder="fob"
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
                                      name="item_fc"
                                      defaultValue={itemstate.item_fc}
                                      render={({
                                        field: { onChange, value, ref },
                                      }) => (
                                        <VStack
                                          w="100%"
                                          py={1}
                                          align="left"
                                          textAlign="left"
                                        >
                                          <Text as="b" fontSize="sm">
                                            Freight
                                          </Text>
                                          <NumberInput
                                            name="item_fc"
                                            value={value || 0}
                                            precision={2}
                                            //fixedDecimalScale
                                            parser={value =>
                                              value.replace(/\$\s?|(,*)/g, '')
                                            }
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
                                            placeholder="freight"
                                            size="md"
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
                                      name="item_bc"
                                      defaultValue={itemstate.item_bc}
                                      render={({
                                        field: { onChange, value, ref },
                                      }) => (
                                        <VStack
                                          w="100%"
                                          py={1}
                                          align="left"
                                          textAlign="left"
                                        >
                                          <Text as="b" fontSize="sm">
                                            Bank Charges
                                          </Text>
                                          <NumberInput
                                            name="item_bc"
                                            value={value || 0}
                                            precision={2}
                                            // fixedDecimalScale
                                            parser={value =>
                                              value.replace(/\$\s?|(,*)/g, '')
                                            }
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
                                            placeholder="bank charges"
                                            size="md"
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
                                      name="item_cnf"
                                      defaultValue={itemstate.item_cnf}
                                      render={({
                                        field: { onChange, value, ref },
                                      }) => (
                                        <VStack
                                          w="100%"
                                          py={1}
                                          align="left"
                                          textAlign="left"
                                        >
                                          <Text as="b" fontSize="sm">
                                            CNF
                                          </Text>
                                          <NumberInput
                                            name="item_cnf"
                                            value={value || 0}
                                            precision={2}
                                            //fixedDecimalScale
                                            parser={value =>
                                              value.replace(/\$\s?|(,*)/g, '')
                                            }
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
                                            placeholder="cnf"
                                            size="md"
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
                                      name="item_tf"
                                      defaultValue={itemstate.item_tf}
                                      render={({
                                        field: { onChange, value, ref },
                                      }) => (
                                        <VStack
                                          w="100%"
                                          py={1}
                                          align="left"
                                          textAlign="left"
                                        >
                                          <Text as="b" fontSize="sm">
                                            Transport Fee
                                          </Text>
                                          <NumberInput
                                            name="item_tf"
                                            value={value || 0}
                                            precision={2}
                                            // fixedDecimalScale
                                            parser={value =>
                                              value.replace(/\$\s?|(,*)/g, '')
                                            }
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
                                            placeholder="transport fee"
                                            size="md"
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
                                      name="item_lc"
                                      defaultValue={itemstate.item_lc}
                                      render={({
                                        field: { onChange, value, ref },
                                      }) => (
                                        <VStack
                                          w="100%"
                                          py={1}
                                          align="left"
                                          textAlign="left"
                                        >
                                          <Text as="b" fontSize="sm">
                                            L. Cost
                                          </Text>
                                          <NumberInput
                                            name="item_lc"
                                            value={value || 0}
                                            precision={2}
                                            // fixedDecimalScale
                                            parser={value =>
                                              value.replace(/\$\s?|(,*)/g, '')
                                            }
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
                                            placeholder="l. cost"
                                            size="md"
                                          />
                                        </VStack>
                                      )}
                                    />
                                  </FormControl>
                                </GridItem>
                                <GridItem colSpan={2}>
                                  <HStack>
                                    <FormControl>
                                      <Controller
                                        control={control}
                                        name="item_dept"
                                        defaultValue={itemstate.item_dept}
                                        render={({
                                          field: { onChange, value, ref },
                                        }) => (
                                          <VStack
                                            w="100%"
                                            py={1}
                                            align="left"
                                            textAlign="left"
                                          >
                                            <Text as="b" fontSize="sm">
                                              Department
                                            </Text>
                                            <Select
                                              name="item_dept"
                                              value={value || ''}
                                              width="full"
                                              onChange={onChange}
                                              data={groups
                                                .filter(
                                                  r =>
                                                    r.group_category ===
                                                    'Department'
                                                )
                                                .map(rec => {
                                                  return {
                                                    value: rec.group_desp,
                                                    label: rec.group_desp,
                                                  };
                                                })}
                                              //placeholder=""
                                              nothingFound="None"
                                              clearable
                                              searchable
                                            />
                                          </VStack>
                                        )}
                                      />
                                    </FormControl>
                                    <Box pt={7}>
                                      <IconButton
                                        onClick={() =>
                                          handleAddGroup('Department')
                                        }
                                        icon={<AddIcon />}
                                        size="md"
                                        colorScheme="teal"
                                      />
                                    </Box>
                                  </HStack>
                                </GridItem>
                                <GridItem colSpan={2}>
                                  <HStack>
                                    <FormControl>
                                      <Controller
                                        control={control}
                                        name="item_brand"
                                        defaultValue={itemstate.item_brand}
                                        render={({
                                          field: { onChange, value, ref },
                                        }) => (
                                          <VStack
                                            align="left"
                                            py={1}
                                            textAlign="left"
                                          >
                                            <Text as="b" fontSize="sm">
                                              Brand
                                            </Text>
                                            <Select
                                              name="item_brand"
                                              value={value || ''}
                                              width="full"
                                              onChange={onChange}
                                              data={groups
                                                .filter(
                                                  r =>
                                                    r.group_category === 'Brand'
                                                )
                                                .map(rec => {
                                                  return {
                                                    value: rec.group_desp,
                                                    label: rec.group_desp,
                                                  };
                                                })}
                                              placeholder=""
                                              nothingFound="None"
                                              searchable
                                            />
                                          </VStack>
                                        )}
                                      />
                                    </FormControl>
                                    <Box pt={7}>
                                      <IconButton
                                        onClick={() => handleAddGroup('Brand')}
                                        icon={<AddIcon />}
                                        size="md"
                                        colorScheme="teal"
                                      />
                                    </Box>
                                  </HStack>
                                </GridItem>
                                <GridItem colSpan={2}>
                                  <HStack>
                                    <FormControl>
                                      <Controller
                                        control={control}
                                        name="item_cat"
                                        defaultValue={itemstate.item_cat}
                                        render={({
                                          field: { onChange, value, ref },
                                        }) => (
                                          <VStack align="left" textAlign="left">
                                            {/* <FormLabel>Description</FormLabel> */}
                                            <Text as="b" fontSize="sm">
                                              Category
                                            </Text>
                                            <Select
                                              name="item_cat"
                                              value={value || ''}
                                              width="full"
                                              onChange={onChange}
                                              //borderColor="gray.400"
                                              data={groups
                                                .filter(
                                                  r =>
                                                    r.group_category ===
                                                    'Category'
                                                )
                                                .map(rec => {
                                                  return {
                                                    value: rec.group_desp,
                                                    label: rec.group_desp,
                                                  };
                                                })}
                                              placeholder=""
                                              nothingFound="None"
                                              searchable
                                            />
                                          </VStack>
                                        )}
                                      />
                                    </FormControl>
                                    <Box pt={7}>
                                      <IconButton
                                        onClick={() =>
                                          handleAddGroup('Category')
                                        }
                                        icon={<AddIcon />}
                                        size="md"
                                        colorScheme="teal"
                                      />
                                    </Box>
                                  </HStack>
                                </GridItem>
                              </Grid>
                            </Stack>
                          </Tabs.Panel>
                          <Tabs.Panel value="second">
                            {/* <Grid templateColumns="repeat(12, 1fr)" gap={1}> */}
                            {/* <GridItem colSpan={12}> */}
                            <Container maxW={'full'}>
                              <ItemHistDetlsTable
                                itemno={editItemId.no}
                                itemhistdetls={histdata}
                                totals={totals}
                                handleUpdQtyOnhand={handleUpdQtyOnhand}
                              />
                            </Container>
                            {/* </GridItem>
                            </Grid> */}
                          </Tabs.Panel>
                        </Tabs>
                      </Box>
                    </GridItem>
                  </Grid>
                </GridItem>
              </Grid>
            </Box>
          </VStack>
        </form>
      </VStack>
      <Modal opened={isGroupOpen} onClose={onGroupClose} size="2xl">
        <GroupForm
          state={groupstate}
          setState={setGroupState}
          statustype={groupstatustype}
          onGroupClose={onGroupClose}
          grouptype={grouptype}
        />
        {/* </ScaleFade> */}
      </Modal>
    </Box>
  );
};

export default ItemForm;
