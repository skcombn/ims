import React, { useState, useMemo } from 'react';
import { useIsFetching, useIsMutating } from '@tanstack/react-query';
import {
  ActionIcon,
  Button,
  Center,
  Flex,
  Text,
  Title,
  Tooltip,
  useMantineTheme,
} from '@mantine/core';
import {
  MantineReactTable,
  useMantineReactTable,
  showPrintPreview,
} from 'mantine-react-table';
import {
  IconEdit,
  IconTrash,
  IconSquarePlus,
  IconDownload,
  IconFileDownload,
  IconSquare,
  IconCheckbox,
} from '@tabler/icons-react';
import { mkConfig, generateCsv, download } from 'export-to-csv';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { downloadExcel } from 'react-export-table-to-excel';
import { CSVDownload, SVDownload } from 'react-csv';

const CustomReactSelectTable = ({
  title,
  columns,
  data,
  rowSelection,
  setRowSelection,
  initialState,
  // handleAdd,
  // handleEdit,
  // handleDelete,
  // handleSelect,
  // handleRowClick,
  // handleRowDoubleClick,
  handleGetRowId,
  handleExportPDF,
  handleExportCSV,
  handleExportExcel,
  handleSelectAllRows,
  disableRowActionStatus,
  disableExportStatus,
  disableAddStatus,
  disableEditStatus,
  disableRowNumbersStatus,
}) => {
  const isFetching = useIsFetching();
  const isMutating = useIsMutating();
  const { colorScheme } = useMantineTheme();
  const [disableRowAction, setDisableRowAction] = useState(
    disableRowActionStatus || false
  );
  const [disableExport, setDisableExport] = useState(
    disableExportStatus || false
  );
  const [disableAddAction, setDisableAddAction] = useState(
    disableAddStatus || false
  );
  const [disableEditAction, setDisableEditAction] = useState(
    disableEditStatus || false
  );
  const [disableRowNumbers, setDisableRowNumbers] = useState(
    disableRowNumbersStatus || false
  );

  const csvConfig = mkConfig({
    fieldSeparator: ',',
    decimalSeparator: '.',
    useKeysAsHeaders: true,
    filename: `${title}`,
    showColumnHeaders: false,
    showTitle: false,
    title: '',
    columnHeaders: columns.map(c => c.header),
  });

  const table = useMantineReactTable({
    columns,
    data: data,
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
    //getRowId: originalRow => originalRow.{handleGetRowId},
    enableTopToolbar: true,
    initialState: { ...initialState },
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

  const handleExportCSVRows = rows => {
    const rowData = rows.map(row => row.original);
    console.log('csv', rowData);
    const csv = generateCsv(csvConfig)(rowData);
    download(csvConfig)(csv);
  };

  const handleExportData = data => {
    const csv = generateCsv(csvConfig)(data);
    download(csvConfig)(csv);
  };

  const handleExportPDFRows = rows => {
    const doc = new jsPDF();
    const tableData = rows.map(row => Object.values(row.original).splice(1));
    const tableHeaders = columns.map(c => c.header);

    autoTable(doc, {
      head: [tableHeaders],
      body: tableData,
    });

    doc.save(`${title}.pdf`);
  };

  const handleExportExcelRows = rows => {
    const tableData = rows.map(row => Object.values(row.original).splice(1));
    const tableHeaders = columns.map(c => c.header);

    const tableColumns = columns.map(c => {
      return { value: c.header };
    });
    console.log('col', tableColumns);
    downloadExcel({
      fileName: `${title}`,
      sheet: `${title}`,
      tablePayload: {
        header: tableHeaders,
        // accept two different data structures
        body: tableData,
      },
    });
  };

  const handleExportExcelRows1 = rows => {
    const tableData = rows.map(row => Object.values(row.original).splice(1));
    const tableHeaders = columns.map(c => c.header);

    const tableColumns = columns.map(c => {
      return { value: c.header };
    });
    console.log('col', tableColumns);
    <CSVDownload data={tableData} target="_blank" />;
  };

  const handleOnClickDummy = () => {
    console.log('onclick');
  };

  const handleOnDoubleClickDummy = () => {
    console.log('ondoubleclick');
  };

  return <MantineReactTable table={table} />;
};

export default CustomReactSelectTable;
