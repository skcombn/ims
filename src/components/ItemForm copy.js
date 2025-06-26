import React, { useState, useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useIsFetching } from '@tanstack/react-query';
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
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
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
import { Modal, NumberInput, Select } from '@mantine/core';
import { IconDoorExit, IconSend } from '@tabler/icons-react';
import { useItems } from '../react-query/items/useItems';
import { useItemGroups } from '../react-query/itemgroup/useItemGroups';
import { useGroups } from '../react-query/groups/useGroups';
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

const ItemForm = ({
  state,
  setState,
  add_Item,
  update_Item,
  statustype,
  onItemClose,
}) => {
  const isFetching = useIsFetching();
  const navigate = useNavigate();
  const field_width = '150';
  const field_gap = '3';
  const { items } = useItems();
  const { itemsgroups } = useItemGroups();
  const { groups } = useGroups();
  const [grouptype, setGrouptype] = useState('');
  const [groupstatustype, setGroupStatusType] = useState('');
  const [isnonstock, setIsnonstock] = useState(false);
  const [isinactive, setIsInactive] = useState(false);
  const [itemtype, setItemtype] = useState(false);
  const [storea, setStorea] = useState(state.item_storea);
  const [storeb, setStoreb] = useState(state.item_storeb);
  const [storef, setStoref] = useState(state.item_storef);

  const {
    isOpen: isGroupOpen,
    onOpen: onGroupOpen,
    onClose: onGroupClose,
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

  const onSubmit = values => {
    const { item_no } = values;
    const found = items.some(el => el.item_no === item_no);

    //const newData = { ...values, item_inactive: isinactive };
    if (statustype === 'edit') {
      update_Item(values);
      onItemClose();
    }
    if (statustype === 'add') {
      if (found) {
        Toast({
          title: `This item no ${item_no} is existed!`,
          status: 'warning',
          customId: 'itemupdAdd',
        });
      } else {
        add_Item(values);
        onItemClose();
      }
    }
  };

  const handleClose = () => {
    onItemClose();
  };

  const handleAddGroup = grouptype => {
    setGrouptype(grouptype);
    setGroupStatusType(prev => (prev = 'add'));
    const data = { ...initial_group };
    setState(data);
    onGroupOpen();
  };

  useEffect(() => {
    const amt = storea + storeb + storef;
    setValue('item_qtyhand', amt);
  }, [storea, storeb, storef]);

  useEffect(() => {
    setIsnonstock(state.item_nonstock);
    setIsInactive(state.item_inactive);
    setItemtype(state.item_type);
  }, []);

  return (
    <Box
      h={{ base: 'auto', md: 'auto' }}
      py={[0, 0, 0]}
      direction={{ base: 'column-reverse', md: 'row' }}
      overflowY="scroll"
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <VStack
          w={{ base: 'auto', md: 'full' }}
          h={{ base: 'auto', md: 'full' }}
          spacing="2"
          alignItems="flex-start"
        >
          <Grid templateColumns="repeat(4, 1fr)" gap={1}>
            <GridItem>
              <VStack alignItems={'flex-start'} px={1}>
                <Heading size="lg">Item Update</Heading>
                <Divider border="2px solid teal" />
              </VStack>
            </GridItem>
            <GridItem></GridItem>
            <GridItem></GridItem>
            <GridItem>
              <HStack>
                <ButtonGroup>
                  <Button
                    // mt={4}
                    // ml={4}
                    colorScheme="teal"
                    isLoading={isSubmitting}
                    type="submit"
                    variant="outline"
                    size="lg"
                    leftIcon={<IconSend />}
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
                    Close
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
                  <GridItem colSpan={3}>
                    <FormControl>
                      <Controller
                        control={control}
                        name="item_no"
                        defaultValue={state.item_no}
                        render={({ field: { onChange, value, ref } }) => (
                          <VStack align="left">
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
                  <GridItem colSpan={2} mt={field_gap} pt={5} pl={2}>
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
                  </GridItem>
                  <GridItem colSpan={7}>
                    <FormControl>
                      <Controller
                        control={control}
                        name="item_desp"
                        defaultValue={state.item_desp}
                        render={({ field: { onChange, value, ref } }) => (
                          <VStack align="left">
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
                  <GridItem colSpan={3}>
                    <FormControl>
                      <Controller
                        control={control}
                        name="item_pack"
                        defaultValue={state.item_pack}
                        render={({ field: { onChange, value, ref } }) => (
                          <VStack align="left" py={1}>
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
                  <GridItem colSpan={3}>
                    <FormControl>
                      <Controller
                        control={control}
                        name="item_qq"
                        defaultValue={state.item_qq}
                        render={({ field: { onChange, value, ref } }) => (
                          <VStack w="100%" py={1} align="left">
                            <Text as="b" fontSize="sm">
                              Packing Factor
                            </Text>
                            <NumberInput
                              name="item_qq"
                              value={value || 0}
                              precision={2}
                              parser={value => value.replace(/\$\s?|(,*)/g, '')}
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
                  <GridItem colSpan={3}>
                    <FormControl>
                      <Controller
                        control={control}
                        name="item_unit"
                        defaultValue={state.item_unit}
                        render={({ field: { onChange, value, ref } }) => (
                          <VStack w="100%" py={1} align="left">
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
                  <GridItem colSpan={3}>
                    <FormControl>
                      <Controller
                        control={control}
                        name="item_phydate"
                        defaultValue={state.item_phydate}
                        render={({ field: { onChange, value, ref } }) => (
                          <VStack w="100%" py={1} align="left">
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
                  <GridItem colSpan={3}>
                    <FormControl>
                      <Controller
                        control={control}
                        name="item_qtyhand"
                        defaultValue={state.item_qtyhand}
                        render={({ field: { onChange, value, ref } }) => (
                          <VStack w="100%" py={1} align="left">
                            <Text as="b" fontSize="sm">
                              Qty Onhand
                            </Text>
                            <NumberInput
                              name="item_qtyhand"
                              value={value || 0}
                              precision={3}
                              parser={value => value.replace(/\$\s?|(,*)/g, '')}
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
                  <GridItem colSpan={3}>
                    <FormControl>
                      <Controller
                        control={control}
                        name="item_storea"
                        defaultValue={state.item_storea}
                        render={({ field: { onChange, value, ref } }) => (
                          <VStack w="100%" py={1} align="left">
                            <Text as="b" fontSize="sm">
                              Store A
                            </Text>
                            <NumberInput
                              name="item_storea"
                              value={value || 0}
                              precision={3}
                              parser={value => value.replace(/\$\s?|(,*)/g, '')}
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
                  <GridItem colSpan={3}>
                    <FormControl>
                      <Controller
                        control={control}
                        name="item_storeb"
                        defaultValue={state.item_storeb}
                        render={({ field: { onChange, value, ref } }) => (
                          <VStack w="100%" py={1} align="left">
                            <Text as="b" fontSize="sm">
                              Store B
                            </Text>
                            <NumberInput
                              name="item_storeb"
                              value={value || 0}
                              precision={3}
                              parser={value => value.replace(/\$\s?|(,*)/g, '')}
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
                  <GridItem colSpan={3}>
                    <FormControl>
                      <Controller
                        control={control}
                        name="item_storef"
                        defaultValue={state.item_storef}
                        render={({ field: { onChange, value, ref } }) => (
                          <VStack w="100%" py={1} align="left">
                            <Text as="b" fontSize="sm">
                              Store F
                            </Text>
                            <NumberInput
                              name="item_storef"
                              value={value || 0}
                              precision={3}
                              parser={value => value.replace(/\$\s?|(,*)/g, '')}
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
                </Grid>
              </GridItem>

              <GridItem
                colSpan={12}
                w="100%"
                h="auto"
                p={5}
                border="1px solid teal"
                borderRadius={10}
              >
                <Grid templateColumns="repeat(12, 1fr)" gap={1}>
                  <GridItem colSpan={4}>
                    <FormControl>
                      <Controller
                        control={control}
                        name="item_minlvl"
                        defaultValue={state.item_minlgl}
                        render={({ field: { onChange, value, ref } }) => (
                          <VStack align="left" py={1}>
                            {/* <FormLabel>Description</FormLabel> */}
                            <Text as="b" fontSize="sm">
                              Min Level
                            </Text>
                            <NumberInput
                              name="item_minlvl"
                              value={value || 0}
                              precision={3}
                              parser={value => value.replace(/\$\s?|(,*)/g, '')}
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

                  <GridItem colSpan={4}>
                    <FormControl>
                      <Controller
                        control={control}
                        name="item_wsp"
                        defaultValue={state.item_wsp}
                        render={({ field: { onChange, value, ref } }) => (
                          <VStack w="100%" py={1} align="left">
                            <Text as="b" fontSize="sm">
                              WS. Price
                            </Text>
                            <NumberInput
                              name="item_wsp"
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
                  <GridItem colSpan={4}>
                    <FormControl>
                      <Controller
                        control={control}
                        name="item_comm"
                        defaultValue={state.item_comm}
                        render={({ field: { onChange, value, ref } }) => (
                          <VStack w="100%" py={1} align="left">
                            <Text as="b" fontSize="sm">
                              Comm
                            </Text>
                            <NumberInput
                              name="item_comm"
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

                  <GridItem colSpan={4}>
                    <FormControl>
                      <Controller
                        control={control}
                        name="item_rsp"
                        defaultValue={state.item_rsp}
                        render={({ field: { onChange, value, ref } }) => (
                          <VStack w="100%" py={1} align="left">
                            <Text as="b" fontSize="sm">
                              Retail Price
                            </Text>
                            <NumberInput
                              name="item_rsp"
                              value={value || 0}
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
                  <GridItem colSpan={4}>
                    <FormControl>
                      <Controller
                        control={control}
                        name="item_cif"
                        defaultValue={state.item_cif}
                        render={({ field: { onChange, value, ref } }) => (
                          <VStack w="100%" py={1} align="left">
                            <Text as="b" fontSize="sm">
                              CIF
                            </Text>
                            <NumberInput
                              name="item_cif"
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
                  <GridItem colSpan={4}>
                    <FormControl>
                      <Controller
                        control={control}
                        name="item_inf"
                        defaultValue={state.item_inf}
                        render={({ field: { onChange, value, ref } }) => (
                          <VStack w="100%" py={1} align="left">
                            <Text as="b" fontSize="sm">
                              Insurance Fee
                            </Text>
                            <NumberInput
                              name="item_inf"
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
                  <GridItem colSpan={4}>
                    <FormControl>
                      <Controller
                        control={control}
                        name="item_duty"
                        defaultValue={state.item_duty}
                        render={({ field: { onChange, value, ref } }) => (
                          <VStack w="100%" py={1} align="left">
                            <Text as="b" fontSize="sm">
                              Duty
                            </Text>
                            <NumberInput
                              name="item_duty"
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
                  <GridItem colSpan={4}>
                    <FormControl>
                      <Controller
                        control={control}
                        name="item_fob"
                        defaultValue={state.item_fob}
                        render={({ field: { onChange, value, ref } }) => (
                          <VStack w="100%" py={1} align="left">
                            <Text as="b" fontSize="sm">
                              FOB
                            </Text>
                            <NumberInput
                              name="item_fob"
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
                              placeholder="fob"
                            />
                          </VStack>
                        )}
                      />
                    </FormControl>
                  </GridItem>
                  <GridItem colSpan={4}>
                    <FormControl>
                      <Controller
                        control={control}
                        name="item_fc"
                        defaultValue={state.item_fc}
                        render={({ field: { onChange, value, ref } }) => (
                          <VStack w="100%" py={1} align="left">
                            <Text as="b" fontSize="sm">
                              Freight
                            </Text>
                            <NumberInput
                              name="item_fc"
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
                              placeholder="freight"
                              size="md"
                            />
                          </VStack>
                        )}
                      />
                    </FormControl>
                  </GridItem>
                  <GridItem colSpan={4}>
                    <FormControl>
                      <Controller
                        control={control}
                        name="item_bc"
                        defaultValue={state.item_bc}
                        render={({ field: { onChange, value, ref } }) => (
                          <VStack w="100%" py={1} align="left">
                            <Text as="b" fontSize="sm">
                              Bank Charges
                            </Text>
                            <NumberInput
                              name="item_bc"
                              value={value || 0}
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
                  <GridItem colSpan={4}>
                    <FormControl>
                      <Controller
                        control={control}
                        name="item_cnf"
                        defaultValue={state.item_cnf}
                        render={({ field: { onChange, value, ref } }) => (
                          <VStack w="100%" py={1} align="left">
                            <Text as="b" fontSize="sm">
                              CNF
                            </Text>
                            <NumberInput
                              name="item_cnf"
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
                              placeholder="cnf"
                              size="md"
                            />
                          </VStack>
                        )}
                      />
                    </FormControl>
                  </GridItem>
                  <GridItem colSpan={4}>
                    <FormControl>
                      <Controller
                        control={control}
                        name="item_tf"
                        defaultValue={state.item_tf}
                        render={({ field: { onChange, value, ref } }) => (
                          <VStack w="100%" py={1} align="left">
                            <Text as="b" fontSize="sm">
                              Transport Fee
                            </Text>
                            <NumberInput
                              name="item_tf"
                              value={value || 0}
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
                  <GridItem colSpan={4}>
                    <FormControl>
                      <Controller
                        control={control}
                        name="item_lc"
                        defaultValue={state.item_lc}
                        render={({ field: { onChange, value, ref } }) => (
                          <VStack w="100%" py={1} align="left">
                            <Text as="b" fontSize="sm">
                              L. Cost
                            </Text>
                            <NumberInput
                              name="item_lc"
                              value={value || 0}
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
                  <GridItem colSpan={4}>
                    <HStack>
                      <FormControl>
                        <Controller
                          control={control}
                          name="item_dept"
                          defaultValue={state.item_dept}
                          render={({ field: { onChange, value, ref } }) => (
                            <VStack w="100%" py={1} align="left">
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
                                    r => r.group_category === 'Department'
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
                          onClick={() => handleAddGroup('Department')}
                          icon={<AddIcon />}
                          size="md"
                          colorScheme="teal"
                        />
                      </Box>
                    </HStack>
                  </GridItem>
                  <GridItem colSpan={4}>
                    <HStack>
                      <FormControl>
                        <Controller
                          control={control}
                          name="item_brand"
                          defaultValue={state.item_brand}
                          render={({ field: { onChange, value, ref } }) => (
                            <VStack align="left" py={1}>
                              <Text as="b" fontSize="sm">
                                Brand
                              </Text>
                              <Select
                                name="item_brand"
                                value={value || ''}
                                width="full"
                                onChange={onChange}
                                data={groups
                                  .filter(r => r.group_category === 'Brand')
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
                  <GridItem colSpan={4}>
                    <HStack>
                      <FormControl>
                        <Controller
                          control={control}
                          name="item_cat"
                          defaultValue={state.item_cat}
                          render={({ field: { onChange, value, ref } }) => (
                            <VStack align="left">
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
                                  .filter(r => r.group_category === 'Category')
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
                          onClick={() => handleAddGroup('Category')}
                          icon={<AddIcon />}
                          size="md"
                          colorScheme="teal"
                        />
                      </Box>
                    </HStack>
                  </GridItem>
                </Grid>
              </GridItem>
            </Grid>
          </Box>
        </VStack>
      </form>
      <Modal opened={isGroupOpen} onClose={onGroupClose} size="2xl">
        <GroupForm
          state={state}
          setState={setState}
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
