import { useState, useEffect } from 'react';
import { useIsFetching } from '@tanstack/react-query';
import { Controller, useForm } from 'react-hook-form';
import { Toast } from '../helpers/CustomToastify';
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
import { Modal, NumberInput } from '@mantine/core';
import { IconSend, IconDoorExit } from '@tabler/icons-react';
import ItemSearchTable from './ItemSearchTable';

const TranPODetlsForm = ({
  state,
  setState,
  statustype,
  add_Item,
  update_Item,
  onItemClose,
}) => {
  const isFetching = useIsFetching();
  const field_width = '150';
  const field_gap = '3';
  const [qty, setQty] = useState(state.tl_qty);
  const [ucost, setUCost] = useState(state.tl_netucost);
  const [isexpirydate, setIsExpiryDate] = useState(state.tl_trackexpiry);

  console.log('batchdetls state', state);

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
    let lValid = false;
    //check for expiry item
    if (isexpirydate) {
      if (values.tl_trackexpiry && values.tl_lotno.length > 0) {
        lValid = true;
      } else {
        lValid = false;
      }
      if (lValid === false) {
        Toast({
          title: 'Lot No field can not be blank!',
          status: 'warning',
          customId: 'lotnoErr',
        });
      } else {
        if (statustype === 'edit') {
          update_Item(values);
        }
        if (statustype === 'add') {
          add_Item(values);
        }
      }
    } else {
      if (statustype === 'edit') {
        update_Item(values);
      }
      if (statustype === 'add') {
        add_Item(values);
      }
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
      item_trackexpiry,
    } = data;
    setValue('tl_itemno', item_no);
    setValue('tl_desp', item_desp);
    setValue('tl_packing', item_pack);
    setValue('tl_unit', item_unit);
    setValue('tl_ucost', item_cost);
    setValue('tl_netucost', item_cost);
    setValue('tl_trackexpiry', item_trackexpiry);
    setQty(prev => (prev = 0));
    setUCost(prev => (prev = item_cost));
    setIsExpiryDate(item_trackexpiry);
    // setTrackSerial(item_trackserial);
  };

  const handleItemSearch = () => {
    onSearchOpen();
  };

  useEffect(() => {
    const amt = Math.round(qty * ucost, 2);
    setValue('tl_amount', amt);
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
            border="1px solid teal"
            borderRadius="10"
          >
            <GridItem colSpan={3} mt={field_gap}>
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
                            width="full"
                            onChange={onChange}
                            borderColor="gray.400"
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
            <GridItem colSpan={9} mt={field_gap}>
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
                          parser={value => value.replace(/\$\s?|(,*)/g, '')}
                          formatter={value =>
                            !Number.isNaN(parseFloat(value))
                              ? ` ${value}`.replace(
                                  /\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g,
                                  ','
                                )
                              : ' '
                          }
                          width="50%"
                          onChange={e => {
                            onChange(e);
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

            <GridItem colSpan={9} mt={field_gap}>
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
                          width="full"
                          onChange={onChange}
                          borderColor="gray.400"
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
                  name="tl_netucost"
                  defaultValue={state.tl_netucost}
                  render={({ field: { onChange, value, ref } }) => (
                    <InputGroup>
                      <HStack w="100%" py={1}>
                        <InputLeftAddon
                          children="Unit Cost"
                          minWidth={field_width}
                        />
                        <NumberInput
                          name="tl_netucost"
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
                          width="full"
                          onChange={e => {
                            onChange(e);
                            setUCost(prev => (prev = e));
                          }}
                          ref={ref}
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
                          ref={ref}
                        />
                      </HStack>
                    </InputGroup>
                  )}
                />
              </FormControl>
            </GridItem>
            {isexpirydate && (
              <>
                <GridItem colSpan={9} mt={field_gap}>
                  <FormControl>
                    <Controller
                      control={control}
                      name="tl_lotno"
                      defaultValue={state.tl_lotno}
                      rules={{ required: isexpirydate ? true : false }}
                      render={({ field: { onChange, value, ref } }) => (
                        <InputGroup>
                          <HStack w="100%" py={1}>
                            <InputLeftAddon
                              children="Lot No"
                              minWidth={field_width}
                            />
                            <Input
                              name="tl_lotno"
                              value={value || ''}
                              width="full"
                              onChange={onChange}
                              borderColor="gray.400"
                              ref={ref}
                              placeholder="lot no"
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
                      name="tl_dateexpiry"
                      defaultValue={state.tl_dateexpiry}
                      rules={{ required: isexpirydate ? true : false }}
                      render={({ field: { onChange, value, ref } }) => (
                        <InputGroup>
                          <HStack w="100%" py={1}>
                            <InputLeftAddon
                              children="Expiry Date"
                              minWidth={field_width}
                            />
                            <Input
                              name="tl_dateexpiry"
                              value={value || ''}
                              type="date"
                              width="full"
                              onChange={onChange}
                              borderColor="gray.400"
                              ref={ref}
                              placeholder="Expiry Date"
                            />
                          </HStack>
                        </InputGroup>
                      )}
                    />
                  </FormControl>
                </GridItem>
              </>
            )}

            <GridItem colSpan={9} mt={field_gap}>
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
                          ref={ref}
                          placeholder="remark"
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
          statustype={statustype}
          onItemSearchClose={onSearchClose}
        />
      </Modal>
    </Flex>
  );
};
export default TranPODetlsForm;
