import { useState, useEffect } from 'react';
import { useIsFetching } from '@tanstack/react-query';
import { Controller, useForm } from 'react-hook-form';
import { nanoid } from 'nanoid';
import { AiOutlineSearch } from 'react-icons/ai';
import {
  Box,
  Button,
  ButtonGroup,
  Divider,
  Flex,
  FormControl,
  Grid,
  GridItem,
  Heading,
  HStack,
  IconButton,
  Input,
  InputGroup,
  InputLeftAddon,
  VStack,
  useDisclosure,
} from '@chakra-ui/react';
import { Modal, NumberInput, ActionIcon, Tooltip } from '@mantine/core';
import { IconDoorExit, IconSend } from '@tabler/icons-react';
import { useItemsExpiry } from '../react-query/itemsexpiry/useItemsExpiry';
import ItemSearchTable from './ItemSearchTable';
import { useRecoilState } from 'recoil';
import { editTranIdState, editTranDetlsIdState } from '../data/atomdata';

const TranSalesLotForm = ({
  state,
  setState,
  lotstate,
  setLotState,
  add_Item,
  update_Item,
  onItemClose,
  add_LotItem,
  update_LotItem,
}) => {
  const isFetching = useIsFetching();
  const field_width = '150';
  const field_gap = '3';
  const { itemsexpiry, setExpItemId } = useItemsExpiry();
  const [editBatchdetlsId, setEditBatchdetlsId] =
    useRecoilState(editTranDetlsIdState);
  const [qty, setQty] = useState(state.tl_qty);
  const [ucost, setUCost] = useState(state.tl_netucost);
  const [isexpirydate, setIsExpiryDate] = useState(state.tl_trackexpiry);

  const {
    isOpen: isSearchOpen,
    onOpen: onSearchOpen,
    onClose: onSearchClose,
  } = useDisclosure();

  const {
    handleSubmit,

    control,

    setValue,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: {
      ...state,
    },
  });

  const onSubmit = values => {
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
      item_packing,
      item_unit,
      item_ucost_pc,
      item_trackexpiry,
    } = data;
    setExpItemId(prev => (prev = item_no));
    setValue('tl_itemno', item_no);
    setValue('tl_desp', item_desp);
    setValue('tl_packing', item_packing);
    setValue('tl_unit', item_unit);
    setValue('tl_ucost', item_ucost_pc);
    setValue('tl_netucost', item_ucost_pc);
    setValue('tl_trackexpiry', item_trackexpiry);
    setQty(prev => (prev = 0));
    setUCost(prev => (prev = item_ucost_pc));
    setIsExpiryDate(item_trackexpiry);
    //update batchlots
    const newLotData = itemsexpiry
      .filter(r => r.ie_itemno === item_no)
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
    const lotdata = [{ ...lotstate }, { ...newLotData }];
    setLotState([...lotstate, ...newLotData]);
  };

  const handleItemSearch = () => {
    onSearchOpen();
  };

  const handleExpiryQty = () => {
    let bal = qty;
    let onhand = 0;

    const lotdata = lotstate
      .sort((a, b) => (a.tl_dateexpiry > b.tl_dateexpiry ? 1 : -1))
      .map(rec => {
        onhand = rec.tl_qtyonhand;
        bal = onhand - bal;
        console.log('bal', bal);
        if (bal >= 0) {
          return { ...rec, tl_qty: bal };
        } else {
          return { ...rec, tl_qty: onhand };
        }
      });
    setLotState(lotdata);
    console.log('exp calc', lotdata);
  };

  useEffect(() => {
    const amt = Math.round(qty * ucost, 2);
    setValue('tl_excost', amt);
    if (isexpirydate && qty > 0) {
      handleExpiryQty();
    }
    console.log('recalc', amt, qty, ucost);
  }, [qty, ucost]);

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
            templateColumns="9"
            templateRows="7"
            columnGap={3}
            rowGap={3}
            px={5}
            py={2}
            w={{ base: 'auto', md: 'full', lg: 'full' }}
            border="1px solid blue"
            borderRadius="10"
          >
            <GridItem colSpan={3} mt={field_gap}>
              <HStack>
                <FormControl>
                  <Controller
                    control={control}
                    name="tl_pono"
                    defaultValue={state.tl_pono}
                    render={({ field: { onChange, value, ref } }) => (
                      <InputGroup>
                        <HStack w="100%" py={1}>
                          <InputLeftAddon
                            children="PO No"
                            minWidth={field_width}
                          />
                          <Input
                            name="tl_pono"
                            value={value || ''}
                            width="full"
                            onChange={onChange}
                            borderColor="gray.400"
                            ref={ref}
                            placeholder="po no"
                            minWidth="100"
                            readOnly
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
            <GridItem colSpan={7} mt={field_gap}>
              <FormControl>
                <Controller
                  control={control}
                  name="tl_dateexpiry"
                  defaultValue={state.pl_dateexpiry}
                  render={({ field: { onChange, value, ref } }) => (
                    <InputGroup>
                      <HStack w="100%" py={1}>
                        <InputLeftAddon
                          children="Date Expiry"
                          minWidth={field_width}
                        />
                        <Input
                          name="tl_dateexpiry"
                          value={value || ''}
                          width="full"
                          onChange={onChange}
                          borderColor="gray.400"
                          ref={ref}
                          placeholder="item description"
                          minWidth="200"
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
                  name="tl_qtyreceived"
                  defaultValue={state.tl_qtyreceived}
                  render={({ field: { onChange, value, ref } }) => (
                    <InputGroup>
                      <HStack w="100%" py={1}>
                        <InputLeftAddon
                          children="Qty Received"
                          minWidth={field_width}
                        />
                        <NumberInput
                          name="tl_qtyreceived"
                          value={value || 0}
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
                          width="full"
                          onChange={e => {
                            onChange(onChange);
                            setQty(prev => (prev = e));
                          }}
                          ref={ref}
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
                  name="tl_qtyonhand"
                  defaultValue={state.tl_qtyonhand}
                  render={({ field: { onChange, value, ref } }) => (
                    <InputGroup>
                      <HStack w="100%" py={1}>
                        <InputLeftAddon
                          children="Qty Received"
                          minWidth={field_width}
                        />
                        <NumberInput
                          name="tl_qtyonhand"
                          value={value || 0}
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
                          width="full"
                          onChange={e => {
                            onChange(onChange);
                            setQty(prev => (prev = e));
                          }}
                          ref={ref}
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
                            onChange(onChange);
                            setQty(prev => (prev = e));
                          }}
                          ref={ref}
                        />
                      </HStack>
                    </InputGroup>
                  )}
                />
              </FormControl>
            </GridItem>
          </Grid>
        </form>
      </VStack>
      <Modal opened={isSearchOpen} onClose={onSearchClose} size="5xl">
        <ItemSearchTable
          state={state}
          setState={setState}
          update_Item={update_ItemDetls}
          onItemSearchClose={onSearchClose}
        />
      </Modal>
    </Flex>
  );
};
export default TranSalesLotForm;
