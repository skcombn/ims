import React, { useState, forwardRef } from 'react';
import DataTable from 'react-data-table-component';
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
  useRadio,
  useRadioGroup,
  useDisclosure,
  useColorMode,
  useColorModeValue,
  useBreakpointValue,
  useControllableState,
} from '@chakra-ui/react';
import { AiFillEdit, AiFillDelete, AiOutlinePlus } from 'react-icons/ai';
import { AlertDialogBox } from '../helpers/AlertDialogBox';
import { useCustomers } from '../react-query/customers/useCustomers';
import CustomerForm from './CustomerForm';

const initial_cust = [
  {
    ar_custno: '',
    ar_cust: '',
    ar_add1: '',
    ar_add2: '',
    ar_add3: '',
    ar_tel1: '',
    ar_tel2: '',
    ar_fax: false,
    ar_contact: false,
    ar_smno: '',
    ar_area: '',
  },
];

const CustomersTable = () => {
  const { customers } = useCustomers();
  const [state, setState] = useState({});
  const [statustype, setStatusType] = useState('');

  const {
    isOpen: isAlertDeleteOpen,
    onOpen: onAlertDeleteOpen,
    onClose: onAlertDeleteClose,
  } = useDisclosure();

  const {
    isOpen: isCustOpen,
    onOpen: onCustOpen,
    onClose: onCustClose,
  } = useDisclosure();

  const handleAddCust = () => {
    const data = { ...initial_cust };
    setState(data);
    onCustOpen(true);
  };

  const handleEditCust = data => {
    setState(data);
    onCustOpen(true);
  };

  const handleDeleteCust = rowData => {
    setState(prev => (prev = { ...rowData }));
    onAlertDeleteOpen();
  };

  const columns = [
    {
      key: 'action',
      text: 'Action',
      width: 20,
      align: 'left',
      sortable: false,
      cell: record => {
        return (
          <>
            <IconButton
              icon={<AiFillEdit />}
              onClick={() => {
                handleEditCust(record);
              }}
            ></IconButton>
          </>
        );
      },
    },
    {
      key: 'action',
      text: 'Action',
      width: 20,
      align: 'left',
      sortable: false,
      cell: record => {
        return (
          <>
            <IconButton
              icon={<AiFillDelete />}
              onClick={() => {
                handleDeleteCust(record);
              }}
            ></IconButton>
          </>
        );
      },
    },
    {
      name: 'Cust No',
      selector: row => row.ar_custno,
    },
    {
      name: 'Customer',
      selector: row => row.ar_cust,
    },
    {
      name: 'Address Line 1',
      selector: row => row.ar_add1,
    },
    {
      name: 'Address Line 2',
      selector: row => row.ar_add2,
    },
    {
      name: 'Address Line 3',
      selector: row => row.ar_add3,
    },
    {
      name: 'Phone 1',
      selector: row => row.ar_tel1,
    },
    {
      name: 'Phone 2',
      selector: row => row.ar_tel2,
    },
    {
      name: 'Fax',
      selector: row => row.ar_fax,
    },
    {
      name: 'Contact',
      selector: row => row.ar_contact,
    },
    {
      name: 'Salesman',
      selector: row => row.ar_smno,
    },
    {
      name: 'Area',
      selector: row => row.ar_area,
    },
  ];

  const handleOnDeleteConfirm = () => {
    const { id } = state;
    //delete_Item(id);
    // toast({
    //   title: "Order being deleted!",
    //   status: "warning",
    // });
  };

  const add_Cust = () => {};

  const update_Cust = () => {};

  const onEdit = () => {
    onCustOpen();
  };

  return (
    <Flex>
      <VStack
        align="center"
        w="auto"
        h={{ base: 'auto', md: '100vh' }}
        overflow="scroll"
      >
        <DataTable columns={columns} data={customers} pagination />
      </VStack>
      <Modal
        closeOnOverlayClick={false}
        isOpen={isCustOpen}
        onClose={onCustClose}
        size="4xl"
      >
        <ModalOverlay />
        <ModalContent>
          {/* <ModalHeader>Product Form</ModalHeader> */}
          <ModalCloseButton />
          <ModalBody>
            <CustomerForm
              state={state}
              setState={setState}
              add_Cust={add_Cust}
              update_Cust={update_Cust}
              statustype={statustype}
              onCustClose={onCustClose}
            />
          </ModalBody>

          {/* <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onProductClose}>
              Close
              </Button>
          </ModalFooter> */}
        </ModalContent>
      </Modal>
      <AlertDialogBox
        onClose={onAlertDeleteClose}
        onConfirm={handleOnDeleteConfirm}
        isOpen={isAlertDeleteOpen}
        title="Delete Product"
      >
        <Heading size="md">
          Are you sure you want to delete this product {state.itemno}{' '}
          {state.name} ?
        </Heading>
      </AlertDialogBox>
    </Flex>
  );
};

export default CustomersTable;
