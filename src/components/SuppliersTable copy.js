import React, { useState, forwardRef } from 'react';
import MaterialTable from 'material-table';
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
import { useSuppliers } from '../react-query/suppliers/useSuppliers';
import { AiFillEdit, AiFillDelete, AiOutlinePlus } from 'react-icons/ai';
import AddBox from '@material-ui/icons/AddBox';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';
import SupplierForm from './SupplierForm';

const columns = [
  {
    title: 'Supp No',
    field: 'ap_vendno',
    cellStyle: {
      width: 30,
    },
  },
  {
    title: 'Supplier',
    field: 'ap_vendor',
    cellStyle: {
      width: 600,
    },
  },
  {
    title: 'Address Line 1',
    field: 'ap_add1',
    cellStyle: {
      width: 600,
    },
  },
  {
    title: 'Address Line 2',
    field: 'ap_add2',
    cellStyle: {
      width: 600,
    },
  },
  {
    title: 'Address Line 3',
    field: 'ap_add3',
    cellStyle: {
      width: 600,
    },
  },
  {
    title: 'Tel 1',
    field: 'ap_tel1',
    cellStyle: {
      width: 80,
    },
  },
  {
    title: 'Tel 2',
    field: 'ap_tel2',
    cellStyle: {
      width: 80,
    },
  },
  {
    title: 'Fax',
    field: 'ap_fax',
    cellStyle: {
      width: 80,
    },
  },
  {
    title: 'Contact',
    field: 'ap_contact',
    cellStyle: {
      width: 100,
    },
  },
];

const initial_supp = [
  {
    ap_vendno: '',
    ap_vendor: '',
    ap_add1: '',
    ap_add2: '',
    ap_add3: '',
    ap_tel1: '',
    ap_tel2: '',
    ap_fax: false,
    ap_contact: false,
  },
];

const tableIcons = {
  Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
  Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
  Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
  DetailPanel: forwardRef((props, ref) => (
    <ChevronRight {...props} ref={ref} />
  )),
  Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
  Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
  Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
  FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
  LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
  NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  PreviousPage: forwardRef((props, ref) => (
    <ChevronLeft {...props} ref={ref} />
  )),
  ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
  SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
  ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
  ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />),
};

const SuppliersTable = () => {
  const { suppliers } = useSuppliers();
  const [state, setState] = useState({});
  const [statustype, setStatusType] = useState('');

  const {
    isOpen: isAlertDeleteOpen,
    onOpen: onAlertDeleteOpen,
    onClose: onAlertDeleteClose,
  } = useDisclosure();

  const {
    isOpen: isSuppOpen,
    onOpen: onSuppOpen,
    onClose: onSuppClose,
  } = useDisclosure();

  const handleAddSupp = () => {
    const data = { ...initial_supp };
    setState(data);
    onSuppOpen(true);
  };

  const handleEditSupp = data => {
    setState(data);
    onSuppOpen(true);
  };

  const add_Supp = () => {};

  const update_Supp = () => {};

  return (
    <Box>
      <VStack
        align="center"
        w="auto"
        h={{ base: 'auto', md: '100vh' }}
        overflow="scroll"
      >
        <MaterialTable
          columns={columns}
          data={suppliers}
          title="Supplier Tables"
          // icons={tableIcons}
          actions={[
            {
              icon: () => <AiOutlinePlus size="30px" />,
              tooltip: 'Add Record',
              isFreeAction: true,
              onClick: (event, rowData) => {
                setStatusType(prev => (prev = 'add'));
                handleAddSupp(rowData);
              },
            },
            rowData => ({
              //disabled: rowData.status !== "Pending",
              icon: () => <AiFillEdit size="30px" />,
              tooltip: 'Edit Record',
              onClick: (event, rowData) => {
                setStatusType(prev => (prev = 'edit'));
                handleEditSupp(rowData);
              },
            }),
            rowData => ({
              //disabled: rowData.status !== "Pending",
              icon: () => <AiFillDelete />,
              tooltip: 'Delete Record',
              onClick: (event, rowData) => {
                //handleDeleteItem(rowData);
              },
            }),
          ]}
          options={{
            filtering: true,
            search: true,
            toolbar: true,
            pageSize: 5,
            headerStyle: {
              backgroundColor: '#9AE6B4',
              color: 'black',
              fontWeight: 'bold',
            },
            showTitle: true,
          }}
        />
      </VStack>
      <Modal
        closeOnOverlayClick={false}
        isOpen={isSuppOpen}
        onClose={onSuppClose}
        size="4xl"
      >
        <ModalOverlay />
        <ModalContent>
          {/* <ModalHeader>Product Form</ModalHeader> */}
          <ModalCloseButton />
          <ModalBody>
            <SupplierForm
              state={state}
              setState={setState}
              add_Supp={add_Supp}
              update_Supp={update_Supp}
              statustype={statustype}
              onSuppClose={onSuppClose}
            />
          </ModalBody>

          {/* <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onProductClose}>
              Close
              </Button>
          </ModalFooter> */}
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default SuppliersTable;
