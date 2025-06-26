import React, { useState, useEffect, useMemo } from "react";
import { MantineReactTable, useMantineReactTable } from "mantine-react-table";
import { useIsFetching } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { round } from "lodash";
import { format } from "date-fns";
import { useCustomToast } from "../helpers/useCustomToast";
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
} from "@chakra-ui/react";
import {
  AiFillEdit,
  AiFillDelete,
  AiOutlinePlus,
  AiOutlineSearch,
  AiOutlineForm,
  AiOutlineArrowLeft,
} from "react-icons/ai";
import { Modal, NumberInput } from "@mantine/core";
import { TiArrowBack } from "react-icons/ti";
import { ImExit } from "react-icons/im";
import { useRecoilState } from "recoil";
import CustomReactTable from "../helpers/CustomReactTable";
import ItemSearchTable from "./ItemSearchTable";

const initial_expiry = {
  ie_itemno: "",
  ie_lotno: "",
  ie_datereceived: null,
  ie_location: "",
  ie_dateexpiry: 0,
  ie_pono: 0,
  ie_podate: 0,
  ie_qtyonhand: 0,
  ie_qtyreceived: 1,
  ie_ucost: "",
  ie_post: "0",
};

const ItemHistLotTable = ({ itemno, itemhistlot }) => {
  const isFetching = useIsFetching();
  const navigate = useNavigate();
  const field_width = "150";
  const field_gap = "3";
  const [state, setState] = useState(initial_expiry);
  const [statustype, setStatusType] = useState("");
  const [filterText, setFilterText] = React.useState("");
  const [selecteditemno, setSelectedItemno] = useState("");
  // const [totals, setTotals] = useState(initial_totals);
  //const { itemshistory, setItemhistItemno } = useItemsHistory();
  /* const {
      handleSubmit,
      register,
      control,
      reset,
      setValue,
      getValues,
      formState: { errors, isSubmitting, id },
    } = useForm({
      defaultValues: {
        ...totals,
      },
    }); */

  console.log("item expiry lot", itemno, itemhistlot);

  const {
    isOpen: isItemSearchOpen,
    onOpen: onItemSearchOpen,
    onClose: onItemSearchClose,
  } = useDisclosure();

  const titles = "Items Expiry Lot Transactions";

  const columns = [
    {
      header: "PO No",
      accessorKey: "ie_pono",
    },
    {
      header: "Expiry Date",
      accessorKey: "ie_dateexpiry",
    },
    {
      header: "Qty Received",
      accessorKey: "ie_qtyreceived",
      mantineTableBodyCellProps: {
        align: "right",
      },
    },
    {
      header: "Qty Onhand",
      accessorKey: "ie_qtyonhand",
      mantineTableBodyCellProps: {
        align: "right",
      },
    },
    {
      header: "Location",
      accessorKey: "ie_location",
    },
  ];

  /* const mantinetable = useMantineReactTable({
      columns,
      data: itemshistory,
      enableTableHead: true,
      enableRowSelection: true,
      enableMultiRowSelection: true,
      enableTopToolbar: false,
      initialState: {
        sorting: [{ id: 'it_transdate', desc: false, density: 'xs' }],
      },
    }); */

  const handleExit = () => {
    navigate(-1);
  };

  const handleItemSearch = () => {
    onItemSearchOpen();
  };

  /*  useEffect(() => {
      setItemhistItemno(itemno);
      if (itemshistory.length > 1) {
        handleCalcTotals(selecteditemno);
      }
    }, [itemno]); */

  return (
    <Box>
      <VStack
        w={{ base: "auto", md: "full" }}
        h={{ base: "auto", md: "full" }}
        p="2"
        spacing="10"
        //align="left"
        alignItems="flex-start"
      >
        <CustomReactTable
          title={titles}
          columns={columns}
          data={itemhistlot ? itemhistlot : {}}
          //   data={itemhistlot.filter(r => r.ie_itemno === itemno)}
          initialState={{
            sorting: [{ id: "ie_dateexpiry", desc: false }],
          }}
          disableRowActionStatus={true}
          disableExportStatus={true}
          disableAddStatus={true}
          disableEditStatus={true}
        />
        {/*  <MantineReactTable table={mantinetable} /> */}
      </VStack>
    </Box>
  );
};

export default ItemHistLotTable;
