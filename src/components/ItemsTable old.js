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
import { AlertDialogBox } from '../helpers/AlertDialogBox';
import { useItems } from '../react-query/items/useItems';
import { useAddItem } from '../react-query/items/useAddItem';
import ItemForm from './ItemForm';

const columns = [
  {
    title: 'Item No',
    field: 'ic_stkno',
    cellStyle: {
      width: 30,
    },
  },
  {
    title: 'Description',
    field: 'ic_desp',
    cellStyle: {
      width: 600,
    },
  },
  {
    title: 'Packing',
    field: 'ic_pack',
    cellStyle: {
      width: 600,
    },
  },
  {
    title: 'Brand',
    field: 'ic_brand',
    cellStyle: {
      width: 100,
    },
  },
  {
    title: 'Department',
    field: 'ic_dept',
    cellStyle: {
      width: 100,
    },
  },
  {
    title: 'Category',
    field: 'ic_cat',
    cellStyle: {
      width: 100,
    },
  },
  {
    title: 'Unit',
    field: 'ic_unit',
    cellStyle: {
      width: 100,
    },
  },
];

const initial_item = [
  {
    ic_stkno: '',
    ic_desp: '',
    ic_unit: '',
    ic_pack: '',
    ic_cat: '',
    ic_brand: '',
    ic_dept: '',
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

const ItemsTable = () => {
  const { items } = useItems();
  const addItem = useAddItem();
  const [state, setState] = useState({});
  const [statustype, setStatusType] = useState('');

  const {
    isOpen: isAlertDeleteOpen,
    onOpen: onAlertDeleteOpen,
    onClose: onAlertDeleteClose,
  } = useDisclosure();

  const {
    isOpen: isItemOpen,
    onOpen: onItemOpen,
    onClose: onItemClose,
  } = useDisclosure();

  const handleAddItem = () => {
    const data = { ...initial_item };
    setState(data);
    onItemOpen(true);
  };

  const handleEditItem = data => {
    setState(data);
    onItemOpen(true);
  };

  const handleDeleteItem = rowData => {
    setState(prev => (prev = { ...rowData }));
    onAlertDeleteOpen();
  };

  const add_Item = data => {
    addItem(data);
  };
  const update_Item = () => {};

  const handleOnDeleteConfirm = () => {
    const { id } = state;
    //delete_Item(id);
    // toast({
    //   title: "Order being deleted!",
    //   status: "warning",
    // });
  };

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
          data={items}
          title="Item Tables"
          icons={tableIcons}
          actions={[
            {
              icon: () => <AiOutlinePlus size="30px" />,
              tooltip: 'Add Record',
              isFreeAction: true,
              onClick: (event, rowData) => {
                setStatusType(prev => (prev = 'add'));
                handleAddItem(rowData);
              },
            },
            rowData => ({
              //disabled: rowData.status !== "Pending",
              icon: () => <AiFillEdit size="30px" />,
              tooltip: 'Edit Record',
              onClick: (event, rowData) => {
                setStatusType(prev => (prev = 'edit'));
                handleEditItem(rowData);
              },
            }),
            rowData => ({
              //disabled: rowData.status !== "Pending",
              icon: () => <AiFillDelete />,
              tooltip: 'Delete Record',
              onClick: (event, rowData) => {
                handleDeleteItem(rowData);
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
        isOpen={isItemOpen}
        onClose={onItemClose}
        size="4xl"
      >
        <ModalOverlay />
        <ModalContent>
          {/* <ModalHeader>Product Form</ModalHeader> */}
          <ModalCloseButton />
          <ModalBody>
            <ItemForm
              state={state}
              setState={setState}
              add_Item={add_Item}
              update_Item={update_Item}
              statustype={statustype}
              onItemClose={onItemClose}
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
          Are you sure you want to delete this item {state.ic_stkno}{' '}
          {state.ic_desp} ?
        </Heading>
      </AlertDialogBox>
    </Box>
  );
};

export default ItemsTable;
