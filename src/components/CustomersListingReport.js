import React, { useState, useEffect, useMemo } from 'react';
import {
  MantineReactTable,
  useMantineReactTable,
  showPrintPreview,
} from 'mantine-react-table';
import { Controller, useForm } from 'react-hook-form';
import { useIsFetching } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Toast } from '../helpers/CustomToastify';
import { NumericFormat } from 'react-number-format';
import currency from 'currency.js';
import dayjs from 'dayjs';
import moment from 'moment';
import { differenceInDays, differenceInCalendarMonths } from 'date-fns';
import { format } from 'date-fns';
import {
  AspectRatio,
  Box,
  Button,
  ButtonGroup,
  Center,
  Checkbox,
  Container,
  Divider,
  //Flex,
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Grid,
  GridItem,
  Heading,
  HStack,
  Icon,
  IconButton,
  Image,
  Input,
  InputGroup,
  InputLeftAddon,
  InputLeftElement,
  SimpleGrid,
  Stack,
  StackDivider,
  Text,
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
import {
  ActionIcon,
  //Button,
  //Center,
  Flex,
  //Text,
  Group,
  Switch,
  Title,
  Tooltip,
  useMantineTheme,
} from '@mantine/core';
import {
  IconEdit,
  IconTrash,
  IconSquarePlus,
  IconDownload,
  IconFileDownload,
  IconSquare,
  IconFilterSearch,
  IconCheckbox,
  IconSquare6Filled,
  IconPrinter,
  IconSelect,
} from '@tabler/icons-react';
import { useRecoilState, useResetRecoilState } from 'recoil';
import { RptState, RptDetlsState, editRptIdState } from '../data/atomdata';
import { useCustomersActive } from '../react-query/customers/useCustomersactive';
import { useReceivableByMth } from '../react-query/receivable/useReceivableByMth';
import { useUpdateReceivable } from '../react-query/receivable/useUpdateReceivable';
import { useARMthView } from '../react-query/armthview/useARMthView';
import { useSetup } from '../react-query/setup/useSetup';
//import CustomReactSelectTable from '../helpers/CustomReactSelectTable';
import Export2Excel from '../helpers/Export2Excel';
import Export2PDF from '../helpers/Export2PDF';
import Export2CSV from '../helpers/Export2CSV';

const CustomersListingReport = () => {
  const isFetching = useIsFetching();
  const navigate = useNavigate();
  const { colorScheme } = useMantineTheme();
  const field_width = '150';
  const field_gap = '3';
  const { customersactive } = useCustomersActive();
  //const [batch, setBatch] = useState([]);
  const [rowSelection, setRowSelection] = useState({});
  const [rptbatch, setRptBatch] = useRecoilState(RptState);
  const [editarrptidstate, setARRptIdState] = useRecoilState(editRptIdState);
  console.log('rowSelection', rowSelection);
  const batch = customersactive;

  const title = 'Customers';

  const columns = useMemo(
    () => [
      {
        header: 'Cust No',
        accessorKey: 'c_custno',
        //size: 200,
        mantineTableBodyCellProps: {
          align: 'left',
        },
      },
      {
        header: 'Customer',
        accessorKey: 'c_cust',
        //size: 200,
        mantineTableBodyCellProps: {
          align: 'left',
        },
      },
      {
        header: 'Tel',
        accessorFn: row => row.c_tel1 && ' / ' && row.c_tel2,
        size: 100,
        mantineTableBodyCellProps: {
          align: 'left',
        },
      },

      {
        header: 'Email',
        accessorKey: 'c_email',
        //size: 200,
        mantineTableBodyCellProps: {
          align: 'left',
        },
      },
      {
        header: 'Fax',
        accessorKey: 'c_fax',
        //size: 200,
        mantineTableBodyCellProps: {
          align: 'left',
        },
      },
      {
        header: 'Contact',
        accessorFn: row => row.c_contact,
        size: 120,
        mantineTableBodyCellProps: {
          align: 'left',
        },
      },
      {
        header: 'Area',
        accessorFn: row => row.c_area,
        size: 120,
        mantineTableBodyCellProps: {
          align: 'left',
        },
      },

      {
        header: 'Salesman',
        accessorFn: row => row.c_smno,
        size: 120,
        mantineTableBodyCellProps: {
          align: 'left',
        },
      },
    ],
    []
  );

  const mantinetable = useMantineReactTable({
    columns,
    data: batch,
    enableTableHead: true,
    enableRowSelection: true,
    enablePagination: true,
    paginationDisplayMode: 'pages',
    enableSorting: true,
    enableStickyHeader: true,
    enableMultiRowSelection: true,
    enableSelectAll: true,
    onRowSelectionChange: setRowSelection,
    state: { rowSelection },
    getRowId: originalRow => originalRow.c_custno,
    enableTopToolbar: true,
    initialState: { sorting: [{ id: 'c_cust', desc: false }] },
    mantineTableHeadCellProps: {
      sx: {
        backgroundColor: 'rgba(52, 210, 235, 0.1)',
        borderRight: '1px solid rgba(224,224,224,1)',
        color: '#fff',
      },
    },
    mantineTableProps: {
      highlightOnHover: true,
      withColumnBorders: true,
      withBorder: colorScheme === 'light',
      sx: {
        'thead > tr': {
          backgroundColor: 'inherit',
        },
        'thead > tr > th': {
          backgroundColor: 'inherit', //#75D6A5
        },
        'tbody > tr > td': {
          backgroundColor: 'inherit',
        },
      },
    },
    renderTopToolbarCustomActions: ({ row, table }) => (
      <Flex gap="md">
        <>
          <Tooltip label="Select All">
            <ActionIcon
              disabled={table.getPrePaginationRowModel().rows.length === 0}
              color="teal"
              onClick={() => handleSelectAllRows(true)}
            >
              <IconCheckbox />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="UnSelect All">
            <ActionIcon
              disabled={table.getPrePaginationRowModel().rows.length === 0}
              color="teal"
              onClick={() => handleSelectAllRows(false)}
            >
              <IconSquare />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="Export CSV">
            <ActionIcon
              disabled={table.getPrePaginationRowModel().rows.length === 0}
              color="teal"
              onClick={() =>
                handleExportCSV(table.getPrePaginationRowModel().rows)
              }
            >
              <IconDownload />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="Export PDF">
            <ActionIcon
              disabled={table.getPrePaginationRowModel().rows.length === 0}
              color="teal"
              onClick={() =>
                handleExportPDF(table.getPrePaginationRowModel().rows)
              }
            >
              <IconFileDownload />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="Export Excel">
            <ActionIcon
              disabled={table.getPrePaginationRowModel().rows.length === 0}
              color="teal"
              onClick={() =>
                handleExportExcel(table.getPrePaginationRowModel().rows)
              }
            >
              <IconFileDownload />
            </ActionIcon>
          </Tooltip>
        </>

        <Center>
          <Title size="md">{title}</Title>
        </Center>
      </Flex>
    ),
    renderEmptyRowsFallback: () => <Text>No data shown</Text>,
  });

  const handleSelectAllRows = state => {
    state
      ? batch.map(rec => {
          setRowSelection(prev => ({
            ...prev,
            [rec.c_custno]: state,
          }));
          return null;
        })
      : setRowSelection([]);
  };

  const handlePrintListing = () => {
    let count = Object.keys(rowSelection).length;
    console.log('submit', rowSelection, count);
    //console.log("count", count);
    if (count === 0) {
      Toast({
        title: `No customers being selected!`,
        status: 'warning',
      });
    } else {
      const batchdata = batch.filter(r =>
        Object.keys(rowSelection).find(key => key === r.c_custno)
      );
      const totals = batchdata.reduce((acc, rec) => {
        return acc + rec.c_totsales;
      }, 0);
      setRptBatch(batchdata);
      setARRptIdState(
        prev =>
          (prev = {
            ...editarrptidstate,
            no: '',
            totals: totals,
            // fromdate: fromdate,
            // todate: todate,
          })
      );
      navigate('/customerslistingrptprint');
    }
  };

  const handleExportExcel = rows => {
    const heading = [columns.map(c => c.header)];
    //const heading = [header];
    const rowData = rows.map(row => [
      row.original.c_custno,
      row.original.c_cust,
      row.original.c_tel1 && ' / ' && row.original.c_tel2,
      row.original.c_email,
      row.original.c_fax,
      row.original.c_contact,
      row.original.c_area,
      row.original.c_smno,
    ]);
    const colWidths = [
      { wch: 15 },
      { wch: 30 },
      { wch: 25 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
    ];
    Export2Excel({ heading, rowData, colWidths, title });
  };

  const handleExportCSV = rows => {
    const tableHeaders = columns.map(c => c.header);
    //const rowData = rows.map(row => row.original);
    const rowData = rows.map(row => [
      row.original.c_custno,
      row.original.c_cust,
      row.original.c_tel1 && ' / ' && row.original.c_tel2,
      row.original.c_email,
      row.original.c_fax,
      row.original.c_contact,
      row.original.c_area,
      row.original.c_smno,
    ]);
    Export2CSV({ rowData, title });
  };

  const handleExportPDF = rows => {
    console.log('exportpdf', rows);

    const tableData = rows.map(row =>
      Object.values([
        row.original.c_custno,
        row.original.c_cust,
        row.original.c_tel1 && ' / ' && row.original.c_tel2,
        row.original.c_email,
        row.original.c_fax,
        row.original.c_contact,
        row.original.c_area,
        row.original.c_smno,
      ])
    );
    const tableHeaders = columns.map(c => c.header);

    Export2PDF({
      tableHeaders: tableHeaders,
      tableData: tableData,
      title: title,
      layout: 'l',
    });
  };

  return (
    <Flex p={5}>
      <Box
        width="100%"
        borderWidth={1}
        borderRadius={15}
        borderColor="teal.800"
        overflow="auto"
      >
        <Grid
          templateColumns={'repeat(12,1fr)'}
          //templateRows="7"
          columnGap={3}
          rowGap={3}
          px={5}
          py={2}
          w={{ base: 'auto', md: 'full', lg: 'full' }}
          border="1px solid teal.100"
          borderRadius="5"
        >
          <GridItem colSpan={2} mt={19}>
            <Center>
              <Heading size="md">Customers Listing Report</Heading>
            </Center>
          </GridItem>
          <GridItem colSpan={6}>
            <HStack pt={2} align="center">
              <Group align="center">
                <Button
                  leftIcon={<IconPrinter />}
                  colorScheme="teal"
                  onClick={handlePrintListing}
                  variant={'outline'}
                  isDisabled={isFetching}
                  size="lg"
                >
                  Print Listing
                </Button>
              </Group>
            </HStack>
          </GridItem>
          <GridItem colSpan={12}>
            <Divider border="2px solid teal" />
          </GridItem>
          <GridItem colSpan={12}>
            <MantineReactTable table={mantinetable} />
          </GridItem>
        </Grid>
      </Box>
    </Flex>
  );
};

export default CustomersListingReport;
