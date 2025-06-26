import React, { useState, useMemo } from "react";
import { useIsFetching, useIsMutating } from "@tanstack/react-query";
import {
  ActionIcon,
  Button,
  Center,
  Flex,
  Text,
  Title,
  Tooltip,
  useMantineTheme,
} from "@mantine/core";
import {
  MantineReactTable,
  useMantineReactTable,
  showPrintPreview,
} from "mantine-react-table";
import {
  IconEdit,
  IconTrash,
  IconSquarePlus,
  IconDownload,
  IconFileDownload,
  IconSquare,
} from "@tabler/icons-react";
import { mkConfig, generateCsv, download } from "export-to-csv";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { downloadExcel } from "react-export-table-to-excel";
import { CSVDownload, SVDownload } from "react-csv";

const CustomReactTable = ({
  title,
  columns,
  data,
  initialState,
  handleAdd,
  handleEdit,
  handleDelete,
  handleSelect,
  handleRowClick,
  handleRowDoubleClick,
  handleExportPDF,
  handleExportCSV,
  handleExportExcel,
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
    fieldSeparator: ",",
    decimalSeparator: ".",
    useKeysAsHeaders: true,
    filename: `${title}`,
    showColumnHeaders: false,
    showTitle: false,
    title: "",
    columnHeaders: columns.map((c) => c.header),
  });

  const table = useMantineReactTable({
    columns,
    data: data,
    title: `${title}`,
    initialState: { ...initialState },
    state: { showSkeletons: isFetching, showProgressBars: isMutating },
    enableColumnActions: true,
    enableColumnFilters: true,
    enableColumnFilterModes: true,
    enablePagination: true,
    enableSorting: true,
    enableStickyHeader: true,
    enableClickToCopy: false,
    enableEditing: !disableEditAction,
    enableRowNumbers: disableRowNumbers,
    enableToolbarInternalActions: true,
    enableTopToolbar: true,
    enableRowActions: false,
    displayColumnDefOptions: {
      "mrt-row-actions": {
        header: "Actions", //change header text
        size: 100,
      },
    },
    columnFilterDisplayMode: "subheader",
    paginationDisplayMode: "pages",
    positionToolbarAlertBanner: "bottom",
    mantineTableHeadCellProps: {
      sx: {
        backgroundColor: "rgba(52, 210, 235, 0.1)",
        borderRight: "1px solid rgba(224,224,224,1)",
        color: "#fff",
      },
    },
    mantineTableProps: {
      highlightOnHover: true,
      withColumnBorders: true,
      withBorder: colorScheme === "light",
      sx: {
        "thead > tr": {
          backgroundColor: "inherit",
        },
        "thead > tr > th": {
          backgroundColor: "inherit", //#75D6A5
        },
        "tbody > tr > td": {
          backgroundColor: "inherit",
        },
      },
    },

    mantineTableBodyRowProps: ({ row }) => ({
      onClick: (event) => {
        if (handleRowClick) {
          handleRowClick(row);
        } else {
          handleOnClickDummy();
        }
      },
      onDoubleClick: (event) => {
        if (handleRowDoubleClick) {
          handleRowDoubleClick(row);
        } else {
          handleOnDoubleClickDummy();
        }
      },
    }),

    renderRowActions: ({ row, table }) => (
      <Flex gap="md">
        {!disableRowAction && (
          <>
            <Tooltip label="Edit">
              <ActionIcon onClick={() => handleEdit(row)}>
                <IconEdit />
              </ActionIcon>
            </Tooltip>
            <Tooltip label="Delete">
              <ActionIcon color="red" onClick={() => handleDelete(row)}>
                <IconTrash />
              </ActionIcon>
            </Tooltip>
          </>
        )}
        {disableRowAction && (
          <Tooltip label="Select">
            <ActionIcon onClick={() => handleSelect(row)}>
              <IconSquare />
            </ActionIcon>
          </Tooltip>
        )}
      </Flex>
    ),
    renderTopToolbarCustomActions: ({ row, table }) => (
      <Flex gap="md">
        {!disableAddAction && (
          <Tooltip label="Add">
            <ActionIcon color="teal" onClick={handleAdd}>
              <IconSquarePlus />
            </ActionIcon>
          </Tooltip>
        )}
        {!disableExport && (
          <>
            <Tooltip label="Export CSV">
              <ActionIcon
                disabled={table.getPrePaginationRowModel().rows.length === 0}
                color="teal"
                onClick={() =>
                  handleExportCSV
                    ? handleExportCSV(table.getPrePaginationRowModel().rows)
                    : handleExportCSVRows(table.getPrePaginationRowModel().rows)
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
                  handleExportPDF
                    ? handleExportPDF(table.getPrePaginationRowModel().rows)
                    : handleExportPDFRows(table.getPrePaginationRowModel().rows)
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
                  handleExportExcel
                    ? handleExportExcel(table.getPrePaginationRowModel().rows)
                    : handleExportExcelRows(
                        table.getPrePaginationRowModel().rows
                      )
                }
              >
                <IconFileDownload />
              </ActionIcon>
            </Tooltip>
          </>
        )}
        <Center>
          <Title size="md">{title}</Title>
        </Center>
      </Flex>
    ),
    renderEmptyRowsFallback: () => <Text>No data shown</Text>,
  });

  const handleExportCSVRows = (rows) => {
    const rowData = rows.map((row) => row.original);
    console.log("csv", rowData);
    const csv = generateCsv(csvConfig)(rowData);
    download(csvConfig)(csv);
  };

  const handleExportData = (data) => {
    const csv = generateCsv(csvConfig)(data);
    download(csvConfig)(csv);
  };

  const handleExportPDFRows = (rows) => {
    const doc = new jsPDF();
    const tableData = rows.map((row) => Object.values(row.original).splice(1));
    const tableHeaders = columns.map((c) => c.header);

    autoTable(doc, {
      head: [tableHeaders],
      body: tableData,
    });

    doc.save(`${title}.pdf`);
  };

  const handleExportExcelRows = (rows) => {
    const tableData = rows.map((row) => Object.values(row.original).splice(1));
    const tableHeaders = columns.map((c) => c.header);

    const tableColumns = columns.map((c) => {
      return { value: c.header };
    });
    console.log("col", tableColumns);
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

  const handleExportExcelRows1 = (rows) => {
    const tableData = rows.map((row) => Object.values(row.original).splice(1));
    const tableHeaders = columns.map((c) => c.header);

    const tableColumns = columns.map((c) => {
      return { value: c.header };
    });
    console.log("col", tableColumns);
    <CSVDownload data={tableData} target="_blank" />;
  };

  const handleOnClickDummy = () => {
    console.log("onclick");
  };

  const handleOnDoubleClickDummy = () => {
    console.log("ondoubleclick");
  };

  return <MantineReactTable table={table} />;
};

export default CustomReactTable;
