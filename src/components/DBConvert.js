import React, { useState, useEffect } from 'react';
import { useFilePicker } from 'use-file-picker';

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
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  NumberInput,
  NumberInputField,
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
import { Controller, useForm } from 'react-hook-form';
import {
  IconArrowBackUp,
  IconLock,
  IconSearch,
  IconDoorExit,
  IconDeviceFloppy,
  IconPrinter,
  IconSend,
  IconFolderOpen,
} from '@tabler/icons-react';

const initial_state = {
  custdbpath: '',
  suppdbpath: '',
  itemdbpath: '',
};

const DBConvert = () => {
  const field_width = '150';
  const field_gap = '3';
  const [state, setState] = useState({});
  const { openFilePicker, filesContent, loading } = useFilePicker({
    accept: '.dbf',
  });

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

  async function handleCustDBPath() {
    const dbpath = getValues('custdbpath');
    //let buffer = fs.readFileSync('/vdos/sinar/ap_vend.dbf');
    //let datatable = Dbf.read(buffer);
    /* if (datatable) {
      datatable.rows.forEach(row => {
        datatable.columns.forEach(col => {
          console.log(row[col.name]);
        });
      });
    } */
  }

  useEffect(() => {
    console.log('filescontent', filesContent);
  });

  return (
    <Container border="1px solid teal" p={5} borderRadius={15}>
      <Heading pb={3} size="md">
        DB CONVERT
      </Heading>

      <form>
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
            <HStack>
              <FormControl>
                <Controller
                  control={control}
                  name="custdbpath"
                  defaultValue={filesContent}
                  render={({ field: { onChange, value, ref } }) => (
                    <InputGroup>
                      <HStack w="100%" py={1}>
                        <InputLeftAddon
                          children="Customer DBF file"
                          minWidth={field_width}
                        />
                        <Input
                          pt={1}
                          name="custdbpath"
                          value={value}
                          width="full"
                          type="file"
                          onChange={onChange}
                          borderColor="gray.400"
                          //textTransform="capitalize"
                          ref={ref}
                          placeholder="customer DBF file"
                          minWidth="100"
                        />
                      </HStack>
                    </InputGroup>
                  )}
                />
              </FormControl>
              <Box pt={0}>
                <IconButton
                  onClick={() => handleCustDBPath()}
                  icon={<IconFolderOpen />}
                  size="md"
                  colorScheme="teal"
                />
              </Box>
            </HStack>
          </GridItem>
        </Grid>
      </form>
    </Container>
  );
};

export default DBConvert;
