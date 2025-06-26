import React, { useState, useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useIsFetching } from '@tanstack/react-query';
import { formatPrice } from '../helpers/utils';
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
import { NumberInput } from '@mantine/core';
import { IconDoorExit, IconSend } from '@tabler/icons-react';
import { useStaffs } from '../react-query/staffs/useStaffs';
import { useAddStaff } from '../react-query/staffs/useAddStaff';
import { useUpdateStaff } from '../react-query/staffs/useUpdateStaff';
// const initial_group = [
//   {
//     group_desp: '',
//     group_category: '',
//   },
// ];

const StaffForm = ({
  state,
  setState,
  statustype,
  onStaffClose,
  stafftype,
}) => {
  const isFetching = useIsFetching();
  const navigate = useNavigate();
  const field_width = '150';
  const field_gap = '3';
  const addStaff = useAddStaff();
  const updateStaff = useUpdateStaff();
  //console.log('statustype', statustype);
  //console.log('Status', state);
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

  const onSubmit = values => {
    //console.log('status', statustype);
    //console.log('values', values);
    if (statustype === 'edit') {
      update_Staff(values);
    }
    if (statustype === 'add') {
      //console.log('values', values);
      add_Staff(values);
    }
    onStaffClose();
  };

  const handleExit = () => {
    onStaffClose();
  };

  const add_Staff = data => {
    addStaff(data);
  };

  const update_Staff = data => {
    updateStaff(data);
    onStaffClose();
  };

  return (
    <Flex
      h={{ base: 'auto', md: 'auto' }}
      py={[0, 0, 0]}
      direction={{ base: 'column-reverse', md: 'row' }}
      //overflowY="scroll"
    >
      <VStack
        w={{ base: 'auto', md: 'full' }}
        h={{ base: 'auto', md: 'full' }}
        p="2"
        spacing="10"
        //alignItems="flex-start"
      >
        <form>
          <Grid templateColumns="repeat(4, 1fr)" gap={1} py={2}>
            <GridItem colSpan={2}>
              <VStack alignItems={'flex-start'} px={1}>
                <Heading size="lg">Staff Form</Heading>
                <Divider border="2px solid teal" />
              </VStack>
            </GridItem>
            <GridItem></GridItem>
            <GridItem>
              <HStack>
                <Button
                  colorScheme="teal"
                  isLoading={isSubmitting}
                  //type="submit"
                  variant="outline"
                  size="lg"
                  leftIcon={<IconSend />}
                  isDisabled={isFetching}
                  onClick={handleSubmit(onSubmit)}
                >
                  Submit
                </Button>
                <Button
                  colorScheme="teal"
                  isLoading={isSubmitting}
                  onClick={handleExit}
                  variant="outline"
                  size="lg"
                  leftIcon={<IconDoorExit />}
                >
                  Close
                </Button>
              </HStack>
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
            borderRadius="20"
            //backgroundColor="blue.50"
          >
            <GridItem colSpan={3} mt={field_gap}>
              <FormControl>
                <Controller
                  control={control}
                  name="s_code"
                  defaultValue={state.s_code}
                  render={({ field: { onChange, value, ref } }) => (
                    <InputGroup>
                      <HStack w="100%" py={1}>
                        <InputLeftAddon
                          children="Code"
                          minWidth={field_width}
                        />
                        <Input
                          name="s_code"
                          value={value}
                          width="full"
                          onChange={onChange}
                          borderColor="gray.400"
                          //textTransform="capitalize"
                          ref={ref}
                          placeholder="staff code"
                          minWidth="100"
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
                  name="s_name"
                  defaultValue={state.s_name}
                  render={({ field: { onChange, value, ref } }) => (
                    <InputGroup>
                      <HStack w="100%" py={1}>
                        <InputLeftAddon
                          children="Name"
                          minWidth={field_width}
                        />
                        <Input
                          name="s_name"
                          value={value}
                          width="full"
                          onChange={onChange}
                          borderColor="gray.400"
                          //textTransform="capitalize"
                          ref={ref}
                          placeholder="name"
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
                  name="s_designation"
                  defaultValue={state.s_designation}
                  render={({ field: { onChange, value, ref } }) => (
                    <InputGroup>
                      <HStack w="100%" py={1}>
                        <InputLeftAddon
                          children="Designation"
                          minWidth={field_width}
                        />
                        <Input
                          name="s_designation"
                          value={value}
                          width="full"
                          onChange={onChange}
                          borderColor="gray.400"
                          //textTransform="capitalize"
                          ref={ref}
                          placeholder="designation"
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
                  name="s_comms"
                  defaultValue={state.s_comms}
                  render={({ field: { onChange, value, ref } }) => (
                    <InputGroup>
                      <HStack w="100%" py={1}>
                        <InputLeftAddon
                          children="Commission"
                          minWidth={field_width}
                        />
                        <NumberInput
                          name="s_comms"
                          value={value}
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
                          onChange={onChange}
                          //borderColor="gray.400"
                          //textTransform="capitalize"
                          ref={ref}
                          //placeholder="commission"
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
                  name="s_area"
                  defaultValue={state.s_area}
                  render={({ field: { onChange, value, ref } }) => (
                    <InputGroup>
                      <HStack w="100%" py={1}>
                        <InputLeftAddon
                          children="Area"
                          minWidth={field_width}
                        />
                        <Input
                          name="s_area"
                          value={value}
                          width="full"
                          onChange={onChange}
                          borderColor="gray.400"
                          //textTransform="capitalize"
                          ref={ref}
                          placeholder="area"
                          minWidth="200"
                        />
                      </HStack>
                    </InputGroup>
                  )}
                />
              </FormControl>
            </GridItem>
          </Grid>
          {/*  <Box>
            <Center>
              <Button
                mt={4}
                ml={4}
                colorScheme="teal"
                isLoading={isSubmitting}
                type="submit"
              >
                Submit
              </Button>
              <Button
                mt={4}
                ml={10}
                colorScheme="teal"
                isLoading={isSubmitting}
                onClick={handleExit}
              >
                Close
              </Button>
            </Center>
          </Box> */}
        </form>
      </VStack>
    </Flex>
  );
};

export default StaffForm;
