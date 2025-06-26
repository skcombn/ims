import React, { useState, forwardRef } from 'react';
import DataTable, { defaultThemes } from 'react-data-table-component';
import styled from 'styled-components';
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
import {
  AiFillEdit,
  AiFillDelete,
  AiOutlinePlus,
  AiOutlineClose,
  AiOutlineSearch,
} from 'react-icons/ai';
import { AlertDialogBox } from '../helpers/AlertDialogBox';
import { useCustomers } from '../react-query/customers/useCustomers';
import { useAddCustomer } from '../react-query/customers/useAddCustomer';
import CustomerForm from './CustomerForm';

const initial_cust = {
  ar_custno: '',
  ar_cust: '',
  ar_add1: '',
  ar_add2: '',
  ar_add3: '',
  ar_tel1: '',
  ar_tel2: '',
  ar_fax: '',
  ar_contact: '',
  ar_area: '',
};

const CustomersTable = () => {
  const { customers } = useCustomers();
  const addCustomer = useAddCustomer();
  const [state, setState] = useState({});
  const [statustype, setStatusType] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [filterText, setFilterText] = React.useState('');
  const [resetPaginationToggle, setResetPaginationToggle] =
    React.useState(false);

  const filteredItems = customers.filter(
    item =>
      item.ar_cust &&
      item.ar_cust.toLowerCase().includes(filterText.toLowerCase())
  );

  const FilterComponent = ({ filterText, onFilter, onClear }) => (
    <>
      <HStack>
        <InputGroup>
          <InputLeftElement
            pointerEvents="none"
            children={<AiOutlineSearch />}
          />
          <Input
            id="search"
            key="search"
            type="text"
            variant="outline"
            autoFocus="autoFocus"
            width="300"
            placeholder="Filter By Name"
            aria-label="Search Input"
            value={filterText}
            onChange={row => {
              onFilter(row);
            }}
          />
        </InputGroup>
        <IconButton icon={<AiOutlineClose />} onClick={onClear} size="md" />
      </HStack>
    </>
  );
  const subHeaderComponentMemo = React.useMemo(() => {
    const handleClear = () => {
      if (filterText) {
        setResetPaginationToggle(!resetPaginationToggle);
        setFilterText('');
      }
    };

    return (
      <>
        <FilterComponent
          onFilter={e => setFilterText(e.target.value)}
          onClear={handleClear}
          filterText={filterText}
          handleAddCust={handleAddCust}
        />
        <IconButton
          icon={<AiOutlinePlus />}
          size="md"
          onClick={() => {
            setStatusType(prev => (prev = 'add'));
            handleAddCust();
          }}
        />
      </>
    );
  }, [filterText, resetPaginationToggle]);

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
    //const data = { ...initial_cust };
    setStatusType('add');
    setState(...initial_cust);
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

  const customStyles = {
    header: {
      style: {
        minHeight: '56px',
      },
    },
    headRow: {
      style: {
        borderTopStyle: 'solid',
        borderTopWidth: '1px',
        backgroundColor: '#9AE6B4',
        borderTopColor: defaultThemes.default.divider.default,
        fontSize: '14px',
        fontWeight: 700,
      },
    },
    headCells: {
      //style: { backgroundColor: `#9AE6B4`, fontSize: '14px', fontWeight: 700 },
      style: {
        '&:not(:last-of-type)': {
          borderRightStyle: 'solid',
          borderRightWidth: '1px',
          borderRightColor: defaultThemes.default.divider.default,
        },
      },
    },
    cells: {
      style: {
        '&:not(:last-of-type)': {
          borderRightStyle: 'solid',
          borderRightWidth: '1px',
          borderRightColor: defaultThemes.default.divider.default,
          fontSize: '14px',
        },
      },
    },
  };

  const CustomAddress = ({ row }) => (
    <div
      style={{
        color: 'grey',
        overflow: 'hidden',
        whiteSpace: 'wrap',
        textOverflow: 'ellipses',
      }}
    >
      {row}
    </div>
  );

  const titles = 'Customers Table';

  const columns = [
    // {
    //   id: 1,
    //   key: 'addaction',
    //   text: 'Action',
    //   align: 'center',
    //   sortable: false,
    //   width: '60px',

    //   cell: record => {
    //     return (
    //       <>
    //         <IconButton
    //           size="sm"
    //           icon={<AiOutlinePlus />}
    //           onClick={() => {
    //             handleAddCust(record);
    //           }}
    //         ></IconButton>
    //       </>
    //     );
    //   },
    // },
    {
      id: 2,
      key: 'editaction',
      text: 'Action',
      sortable: false,
      width: '60px',
      cell: record => {
        return (
          <>
            <IconButton
              icon={<AiFillEdit />}
              size="sm"
              onClick={() => {
                handleEditCust(record);
              }}
            ></IconButton>
          </>
        );
      },
    },
    {
      id: 3,
      key: 'deleteaction',
      text: 'Action',
      width: '60px',
      sortable: false,
      cell: record => {
        return (
          <>
            <IconButton
              icon={<AiFillDelete />}
              size="sm"
              onClick={() => {
                handleDeleteCust(record);
              }}
            />
          </>
        );
      },
    },
    {
      id: 4,
      name: 'Cust No',
      selector: row => row.ar_custno,
      sortable: true,
      width: '120px',
    },
    {
      id: 5,
      name: 'Customer',
      selector: row => row.ar_cust,
      width: '200px',
      sortable: true,
      align: 'left',
      wrap: false,
      cell: row => <div style={{ overflow: 'hidden' }}>{row.ar_cust}</div>,
    },
    {
      id: 6,
      name: 'Address Line 1',
      selector: row => row.ar_add1,
      //selector: row => row.ar_add1,
      //wrap: true,
      width: '200px',
      //grow: 4,
      cell: row => (
        <div
          style={{
            color: 'grey',
            overflow: 'hidden',
            whiteSpace: 'wrap',
            textOverflow: 'ellipses',
          }}
        >
          {row.ar_add1}
        </div>
      ),
    },
    {
      id: 7,
      name: 'Address Line 2',
      selector: row => row.ar_add2,
      wrap: true,
      minWidth: '200px',
      //align: 'left',
      left: true,
      grow: 4,
    },
    {
      id: 8,
      name: 'Address Line 3',
      selector: row => row.ar_add3,
      wrap: true,
      minWidth: '200px',
      //align: 'left',
      left: true,
      grow: 4,
    },
    {
      id: 9,
      name: 'Phone 1',
      selector: row => row.ar_tel1,
      width: '120px',
    },
    {
      id: 10,
      name: 'Phone 2',
      selector: row => row.ar_tel2,
      width: '120px',
    },
    {
      id: 11,
      name: 'Fax',
      selector: row => row.ar_fax,
      width: '120px',
    },
    {
      id: 12,
      name: 'Contact',
      selector: row => row.ar_contact,
      width: '120px',
    },

    {
      id: 13,
      name: 'Area',
      selector: row => row.ar_area,
      width: '120px',
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

  const add_Cust = data => {
    console.log('cust', data);
    addCustomer(data);
  };

  const update_Cust = () => {};
  

  return (
    <Flex>
      <Box
        mt="100"
        width="96%"
        borderWidth={1}
        borderColor="teal.800"
        overflow="scroll"
      >
        <DataTable
          title={titles}
          columns={columns}
          data={filteredItems}
          pagination
          defaultSortFieldId={4}
          paginationResetDefaultPage={resetPaginationToggle}
          subHeader
          subHeaderComponent={subHeaderComponentMemo}
          fixedHeader
          progressComponent={<div>Loading...</div>}
          customStyles={customStyles}
        />
      </Box>
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
        title="Delete Customer"
      >
        <Heading size="md">
          Are you sure you want to delete this customer {state.ar_custno}{' '}
          {state.ar_cust} ?
        </Heading>
      </AlertDialogBox>
    </Flex>
  );
};

export default CustomersTable;
