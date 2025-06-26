import React, { useState, useEffect, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import currency from "currency.js";
import { NumericFormat } from "react-number-format";
import { round } from "lodash";
import { useCustomToast } from "../helpers/useCustomToast";
import { NumberInput } from "@mantine/core";
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
  //NumberInput,
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
} from "@chakra-ui/react";
import { Modal } from "@mantine/core";
//import { FiSave } from 'react-icons/fi';
//import { SearchIcon } from '@chakra-ui/icons';
import {
  IconArrowBackUp,
  IconSearch,
  IconDoorExit,
  IconDeviceFloppy,
} from "@tabler/icons-react";
import { useItems } from "../react-query/items/useItems";
import { useItemsHistory } from "../react-query/itemshistory/useItemsHistory";
import CustomReactTable from "../helpers/CustomReactTable";
import ItemSearchTable from "./ItemSearchTable";

const initial_item = [
  {
    item_no: "",
    item_desp: "",
    item_unit: "",
    item_packing: "",
    item_category: "",
    item_brand: "",
    item_location: "",
    item_dept: "",
    item_uprice_pc: 0,
    item_uprice_ctn: 0,
    item_pfactor: 1,
    item_qtyhand: 0,
    item_nonstock: false,
    item_type: "",
    item_smcode: "",
  },
];

const initial_totals = {
  totpoqty: 0,
  totpoamt: 0,
  totportnqty: 0,
  totportnamt: 0,
  totsalesqty: 0,
  totsalesamt: 0,
  totsalesrtnqty: 0,
  totsalesrtnamt: 0,
  totonhandqty: 0,
  totonhandamt: 0,
};

const ItemHistoryTable = () => {
  const toast = useCustomToast();
  const navigate = useNavigate();
  const field_width = "150";
  const field_gap = "3";
  const [state, setState] = useState(initial_item);
  const [statustype, setStatusType] = useState("");
  const [filterText, setFilterText] = React.useState("");
  const [selecteditemno, setSelectedItemno] = useState("");
  const [totals, setTotals] = useState(initial_totals);
  const { items } = useItems();
  const { itemshistory, setItemhistItemno } = useItemsHistory();

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

  const {
    isOpen: isItemSearchOpen,
    onOpen: onItemSearchOpen,
    onClose: onItemSearchClose,
  } = useDisclosure();

  const title = "Items History Transactions";

  const columns = useMemo(
    () => [
      {
        header: "Document No",
        accessorFn: (row) => row.it_transno,
        //size: 120,
        mantineTableBodyCellProps: {
          align: "left",
        },
      },
      {
        id: "date",
        header: "Date",
        accessorFn: (row) => {
          const rDay = new Date(row.it_transdate);
          rDay.setHours(0, 0, 0, 0); // remove time from date
          return rDay;
        },
        Cell: ({ cell }) => dayjs(cell.getValue()).format("DD-MMM-YYYY"),
        size: 100,
        filterVariant: "date",
        sortingFn: "datetime",
        mantineTableBodyCellProps: {
          align: "left",
        },
      },
      {
        header: "Type",
        accessorFn: (row) => row.it_type,
        size: 100,
        mantineTableBodyCellProps: {
          align: "left",
        },
      },
      {
        header: "Source",
        accessorFn: (row) => row.it_sc,
        //size: 120,
        mantineTableBodyCellProps: {
          align: "left",
        },
      },

      {
        header: "Qty",
        accessorFn: (row) => row.it_qty,
        Cell: ({ row }) => (
          <NumericFormat
            value={row.original.it_qty}
            decimalScale={3}
            fixedDecimalScale
            displayType="text"
          />
        ),
        size: 120,
        mantineTableBodyCellProps: {
          align: "right",
        },
      },
      {
        header: "Unit",
        accessorFn: (row) => row.it_unit,
        size: 120,
        mantineTableBodyCellProps: {
          align: "left",
        },
      },
      {
        header: "U/Price",
        accessorFn: (row) => row.it_netvalue,
        size: 120,
        Cell: ({ cell }) =>
          cell.getValue()?.toLocaleString?.("en-US", {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }),
        mantineTableBodyCellProps: {
          align: "right",
        },
      },
      {
        header: "Amount",
        accessorFn: (row) => row.it_extvalue,
        size: 120,
        Cell: ({ cell }) =>
          cell.getValue()?.toLocaleString?.("en-US", {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }),
        mantineTableBodyCellProps: {
          align: "right",
        },
      },
      {
        header: "Remark",
        accessorFn: (row) => row.it_remark,
        //size: 120,
        mantineTableBodyCellProps: {
          align: "left",
        },
      },
    ],
    []
  );

  const handleExit = () => {
    navigate(-1);
  };

  const handleItemSearch = () => {
    const no = getValues("item_no");
    if (no && no.length > 0) {
      const rec = items.filter((r) => r.item_no === no);
      if (rec.length > 0) {
        update_ItemDetls({ ...rec[0] });
      } else {
        setValue("item_no", "");
        setValue("item_desp", "");
        setValue("item_packing", "");
        setValue("item_unit", "");
        setValue("item_type", "");
        setValue("item_group", "");
        setValue("item_category", "");
        setValue("item_brand", "");
        setValue("item_smcode", "");
        setValue("item_location", "");
        onItemSearchOpen();
      }
    } else {
      onItemSearchOpen();
    }
  };

  const update_ItemDetls = (data) => {
    const {
      item_no,
      item_desp,
      item_packing,
      item_unit,
      item_type,
      item_group,
      item_category,
      item_brand,
      item_smcode,
      item_location,
    } = data;
    setSelectedItemno((prev) => (prev = item_no));

    // update state values
    setValue("item_no", item_no);
    setValue("item_desp", item_desp);
    setValue("item_packing", item_packing);
    setValue("item_unit", item_unit);
    setValue("item_type", item_type);
    setValue("item_group", item_group);
    setValue("item_category", item_category);
    setValue("item_brand", item_brand);
    setValue("item_smcode", item_smcode);
    setValue("item_location", item_location);

    //handleCalcTotals(item_no);
  };

  const handleCalcTotals = (item_no) => {
    var totpoqty = 0,
      totpoamt = 0,
      totportnqty = 0,
      totportnamt = 0,
      totsalesqty = 0,
      totsalesamt = 0,
      totsalesrtnqty = 0,
      totsalesrtnamt = 0;

    itemshistory
      .filter((r) => r.it_itemno === item_no)
      .forEach((rec) => {
        switch (rec.it_transtype) {
          case "POInvoice":
            totpoqty = round(totpoqty + rec.it_qty, 3);
            totpoamt = round(totpoamt + rec.it_extvalue, 2);
            return null;
          case "Invoice":
            totsalesqty = round(totsalesqty + rec.it_qty, 3);
            totsalesamt = round(totsalesamt + rec.it_extvalue, 2);
            return null;
          case "Cash":
            totsalesqty = round(totsalesqty + rec.it_qty, 3);
            totsalesamt = round(totsalesamt + rec.it_extvalue, 2);
            return null;
          case "Credit":
            totsalesrtnqty = round(totsalesrtnqty + rec.it_qty, 3);
            totsalesrtnamt = round(totsalesrtnamt + rec.it_extvalue, 2);
            return null;
          default:
            return null;
        }
      });

    // const totpoqty = itemshistory
    //   .filter(r => r.it_itemno === item_no && r.it_transtype === 'Purchase')
    //   .reduce((acc, item) => {
    //     return acc + item.it_qty;
    //   }, 0);
    // const totpoamt = itemshistory
    //   .filter(r => r.it_itemno === item_no && r.it_transtype === 'Purchase')
    //   .reduce((acc, item) => {
    //     return acc + item.it_extvalue;
    //   }, 0);
    console.log("onhand", totpoqty, totsalesqty, totportnqty, totsalesrtnqty);
    const totonhandqty = round(
      totpoqty - totsalesqty - totportnqty + totsalesrtnqty,
      3
    );
    const totonhandamt = 0;

    setTotals(
      (prev) =>
        (prev = {
          ...prev,
          totpoqty: totpoqty,
          totpoamt: totpoamt,
          totsalesqty: totsalesqty,
          totsalesamt: totsalesamt,
          totsalesrtnqty: totsalesrtnqty,
          totsalesrtnamt: totsalesrtnamt,
          totonhandqty: totonhandqty,
          totonhandamt: totonhandamt,
        })
    );
    setValue("totpoqty", totpoqty);
    setValue("totpoamt", totpoamt);
    setValue("totsalesqty", totsalesqty);
    setValue("totsalesamt", totsalesamt);
    setValue("totsalesrtnqty", totsalesrtnqty);
    setValue("totsalesrtnamt", totsalesrtnamt);
    setValue("totonhandqty", totonhandqty);
    setValue("totonhandamt", totonhandamt);
    console.log("calc totals", item_no, totsalesamt);
  };

  useEffect(() => {
    setItemhistItemno(selecteditemno);
  }, [selecteditemno]);

  useEffect(() => {
    if (selecteditemno.length > 1) {
      handleCalcTotals(selecteditemno);
    }
  }, [itemshistory.length]);

  return (
    <Box
      h={{ base: "auto", md: "auto" }}
      py={[0, 0, 0]}
      direction={{ base: "column-reverse", md: "row" }}
      overflowY="auto"
    >
      <VStack
        w={{ base: "auto", md: "full" }}
        h={{ base: "auto", md: "full" }}
        p="2"
        spacing="10"
        //align="left"
        //alignItems="flex-start"
      >
        <form>
          <HStack py={2} spacing="3">
            <Grid templateColumns={"repeat(12,1fr)"} columnGap={3}>
              <GridItem colSpan={1}>
                <Button
                  leftIcon={<IconArrowBackUp size={30} />}
                  onClick={() => navigate(-1)}
                  colorScheme="teal"
                  variant={"outline"}
                  size="lg"
                >
                  Back
                </Button>
              </GridItem>
              <GridItem colSpan={2}>
                <VStack alignItems={"flex-start"} px={1}>
                  <Heading size="lg">Item History</Heading>
                  <Divider border="2px solid teal" />
                </VStack>
              </GridItem>
              <GridItem colSpan={6}></GridItem>
              <GridItem colSpan={2}>
                <Flex>
                  <HStack mr={5}>
                    <ButtonGroup>
                      <Button
                        leftIcon={<IconDeviceFloppy size="20" />}
                        colorScheme="teal"
                        variant={"outline"}
                        size="lg"
                      >
                        Submit
                      </Button>
                      <Button
                        leftIcon={<IconDoorExit />}
                        colorScheme="teal"
                        onClick={handleExit}
                        variant={"outline"}
                        size="lg"
                      >
                        Exit
                      </Button>
                    </ButtonGroup>
                  </HStack>
                </Flex>
              </GridItem>
            </Grid>
          </HStack>
          <Grid
            templateColumns={"repeat(12,1fr)"}
            //templateRows="7"
            columnGap={3}
            rowGap={3}
            px={5}
            py={2}
            w={{ base: "auto", md: "full", lg: "full" }}
            border="1px solid teal"
            borderRadius="10"
          >
            <GridItem colSpan={2} mt={field_gap} w="100%">
              <HStack>
                <FormControl>
                  <Controller
                    control={control}
                    name="item_no"
                    //defaultValue={invoice.sls_no || ''}
                    render={({ field: { onChange, value, ref } }) => (
                      <VStack align="left">
                        <Text as="b" fontSize="sm" textAlign="left">
                          Item No
                        </Text>
                        <Input
                          name="item_no"
                          value={value || ""}
                          width="full"
                          onChange={onChange}
                          borderColor="gray.400"
                          //textTransform="capitalize"
                          ref={ref}
                          placeholder="item no"
                          minWidth="100"
                          //readOnly
                        />
                      </VStack>
                    )}
                  />
                </FormControl>
                <Box pt={7}>
                  <IconButton
                    onClick={() => handleItemSearch()}
                    icon={<IconSearch />}
                    size="md"
                    colorScheme="teal"
                  />
                </Box>
              </HStack>
            </GridItem>
            <GridItem colSpan={5} mt={field_gap}>
              <FormControl>
                <Controller
                  control={control}
                  name="item_desp"
                  defaultValue={state.item_desp}
                  render={({ field: { onChange, value, ref } }) => (
                    <VStack align="left">
                      {/* <FormLabel>Description</FormLabel> */}
                      <Text as="b" fontSize="sm" textAlign="left">
                        Description
                      </Text>
                      <Input
                        name="item_desp"
                        value={value || ""}
                        width="full"
                        onChange={onChange}
                        borderColor="gray.400"
                        //textTransform="capitalize"
                        ref={ref}
                        placeholder="description"
                        readOnly
                        //minWidth="100"
                      />
                    </VStack>
                  )}
                />
              </FormControl>
            </GridItem>
            <GridItem colSpan={5} mt={field_gap}>
              <FormControl>
                <Controller
                  control={control}
                  name="item_packing"
                  defaultValue={state.item_packing}
                  render={({ field: { onChange, value, ref } }) => (
                    <VStack align="left">
                      <Text as="b" fontSize="sm" textAlign="left">
                        Packing
                      </Text>
                      <Input
                        name="item_packing"
                        value={value || ""}
                        width="full"
                        onChange={onChange}
                        borderColor="gray.400"
                        //textTransform="capitalize"
                        ref={ref}
                        placeholder="packing"
                        readOnly
                        //minWidth="100"
                      />
                    </VStack>
                  )}
                />
              </FormControl>
            </GridItem>
            <GridItem colSpan={1}>
              <FormControl>
                <Controller
                  control={control}
                  name="item_unit"
                  defaultValue={state.item_unit}
                  render={({ field: { onChange, value, ref } }) => (
                    <VStack w="100%" py={1} align="left">
                      <Text as="b" fontSize="sm" align="left">
                        Unit
                      </Text>
                      <Input
                        name="item_unit"
                        value={value || ""}
                        width="full"
                        onChange={onChange}
                        borderColor="gray.400"
                        //textTransform="capitalize"
                        ref={ref}
                        readOnly
                        placeholder="unit"
                      />
                    </VStack>
                  )}
                />
              </FormControl>
            </GridItem>
            <GridItem colSpan={1}>
              <FormControl>
                <Controller
                  control={control}
                  name="item_type"
                  defaultValue={state.item_type}
                  render={({ field: { onChange, value, ref } }) => (
                    <VStack w="100%" py={1} align="left">
                      <Text as="b" fontSize="sm" align="left">
                        Type
                      </Text>
                      <Input
                        name="item_type"
                        value={value || ""}
                        width="full"
                        onChange={onChange}
                        borderColor="gray.400"
                        //textTransform="capitalize"
                        ref={ref}
                        placeholder="unit"
                        readOnly
                      />
                    </VStack>
                  )}
                />
              </FormControl>
            </GridItem>
            <GridItem
              colSpan={2}
              w="100%"
              h="auto"
              px={1}
              //border="1px solid"
            >
              <FormControl>
                <Controller
                  control={control}
                  name="item_group"
                  defaultValue={state.item_group}
                  render={({ field: { onChange, value, ref } }) => (
                    <VStack w="100%" py={1} align="left">
                      <Text as="b" fontSize="sm" align="left">
                        Group
                      </Text>
                      <Input
                        name="item_group"
                        value={value || ""}
                        width="full"
                        onChange={onChange}
                        borderColor="gray.400"
                        //textTransform="capitalize"
                        ref={ref}
                        placeholder="unit"
                        readOnly
                      />
                    </VStack>
                  )}
                />
              </FormControl>
            </GridItem>
            <GridItem
              colSpan={2}
              w="100%"
              h="auto"
              px={1}
              //border="1px solid"
            >
              <FormControl>
                <Controller
                  control={control}
                  name="item_category"
                  defaultValue={state.item_category}
                  render={({ field: { onChange, value, ref } }) => (
                    <VStack w="100%" py={1} align="left">
                      <Text as="b" fontSize="sm" align="left">
                        Category
                      </Text>
                      <Input
                        name="item_category"
                        value={value || ""}
                        width="full"
                        onChange={onChange}
                        borderColor="gray.400"
                        //textTransform="capitalize"
                        ref={ref}
                        placeholder="category"
                        readOnly
                      />
                    </VStack>
                  )}
                />
              </FormControl>
            </GridItem>
            <GridItem
              colSpan={2}
              w="100%"
              h="auto"
              px={1}
              //border="1px solid"
            >
              <FormControl>
                <Controller
                  control={control}
                  name="item_brand"
                  defaultValue={state.item_brand}
                  render={({ field: { onChange, value, ref } }) => (
                    <VStack w="100%" py={1} align="left">
                      <Text as="b" fontSize="sm" align="left">
                        Brand
                      </Text>
                      <Input
                        name="item_brand"
                        value={value || ""}
                        width="full"
                        onChange={onChange}
                        borderColor="gray.400"
                        //textTransform="capitalize"
                        ref={ref}
                        placeholder="brand"
                        readOnly
                      />
                    </VStack>
                  )}
                />
              </FormControl>
            </GridItem>
            <GridItem
              colSpan={2}
              w="100%"
              h="auto"
              px={1}
              //border="1px solid"
            >
              <FormControl>
                <Controller
                  control={control}
                  name="item_smcode"
                  defaultValue={state.item_smcode}
                  render={({ field: { onChange, value, ref } }) => (
                    <VStack w="100%" py={1} align="left">
                      <Text as="b" fontSize="sm" align="left">
                        Salesman Code
                      </Text>
                      <Input
                        name="item_smcode"
                        value={value || ""}
                        width="full"
                        onChange={onChange}
                        borderColor="gray.400"
                        //textTransform="capitalize"
                        ref={ref}
                        placeholder="salesman code"
                        readOnly
                      />
                    </VStack>
                  )}
                />
              </FormControl>
            </GridItem>
            <GridItem
              colSpan={2}
              w="100%"
              h="auto"
              px={1}
              //border="1px solid"
            >
              <FormControl>
                <Controller
                  control={control}
                  name="item_location"
                  defaultValue={state.item_location}
                  render={({ field: { onChange, value, ref } }) => (
                    <VStack w="100%" py={1} align="left">
                      <Text as="b" fontSize="sm" align="left">
                        Location
                      </Text>
                      <Input
                        name="item_location"
                        value={value || ""}
                        width="full"
                        onChange={onChange}
                        borderColor="gray.400"
                        //textTransform="capitalize"
                        ref={ref}
                        placeholder="salesman code"
                        readOnly
                      />
                    </VStack>
                  )}
                />
              </FormControl>
            </GridItem>
            <GridItem colSpan={12}>
              <Divider height="1px" borderColor="black" />
            </GridItem>
            <GridItem
              colSpan={2}
              w="100%"
              h="auto"
              px={1}
              //border="1px solid"
            >
              <FormControl>
                <Controller
                  control={control}
                  name="totonhandqty"
                  defaultValue={totals.totonhandqty}
                  render={({ field: { onChange, value, ref } }) => (
                    <VStack w="100%" py={1} align="left">
                      <Text as="b" fontSize="sm" align="left">
                        Total Onhand Qty
                      </Text>
                      <Input
                        name="totonhandqty"
                        value={currency(value, { precision: 3 }) || 0}
                        //type="number"
                        width="full"
                        readOnly
                        textAlign="right"
                        onChange={onChange}
                        borderColor="gray.400"
                        //textTransform="capitalize"
                        ref={ref}
                        placeholder="total onhand qty"
                      />
                    </VStack>
                  )}
                />
              </FormControl>
            </GridItem>
            {/*  <GridItem
              colSpan={2}
              w="100%"
              h="auto"
              px={1}
              //border="1px solid"
            >
              <FormControl>
                <Controller
                  control={control}
                  name="totonhandqty"
                  defaultValue={totals.totonhandqty}
                  render={({ field: { onChange, value, ref } }) => (
                    <VStack w="100%" py={1} align="left">
                      <Text as="b" fontSize="sm" align="left">
                        Total Onhand Qty
                      </Text>
                      <Input
                        name="totonhandqty"
                        value={value || 0}
                        //type="number"
                        width="full"
                        readOnly
                        textAlign="right"
                        onChange={onChange}
                        borderColor="gray.400"
                        //textTransform="capitalize"
                        ref={ref}
                        placeholder="total onhand qty"
                      />
                    </VStack>
                  )}
                />
              </FormControl>
            </GridItem> */}
            <GridItem
              colSpan={2}
              w="100%"
              h="auto"
              px={1}
              //border="1px solid"
            >
              <FormControl>
                <Controller
                  control={control}
                  name="totpoqty"
                  defaultValue={totals.totpoqty}
                  render={({ field: { onChange, value, ref } }) => (
                    <VStack w="100%" py={1} align="left">
                      <Text as="b" fontSize="sm" align="left">
                        Total PO Qty
                      </Text>
                      <Input
                        name="totpoqty"
                        value={currency(value, { precision: 3 }) || 0}
                        //type="number"
                        textAlign="right"
                        onChange={onChange}
                        borderColor="gray.400"
                        //textTransform="capitalize"
                        ref={ref}
                        placeholder="total purchases qty"
                        readOnly
                      />
                    </VStack>
                  )}
                />
              </FormControl>
            </GridItem>
            <GridItem
              colSpan={2}
              w="100%"
              h="auto"
              px={1}
              //border="1px solid"
            >
              <FormControl>
                <Controller
                  control={control}
                  name="totsalesqty"
                  defaultValue={totals.totsalesqty}
                  render={({ field: { onChange, value, ref } }) => (
                    <VStack w="100%" py={1} align="left">
                      <Text as="b" fontSize="sm" align="left">
                        Total Sales Qty
                      </Text>
                      <Input
                        name="totsalesqty"
                        value={currency(value, { precision: 3 }) || 0}
                        //type="number"
                        width="full"
                        textAlign="right"
                        onChange={onChange}
                        borderColor="gray.400"
                        //textTransform="capitalize"
                        ref={ref}
                        placeholder="total sales qty"
                        readOnly
                      />
                    </VStack>
                  )}
                />
              </FormControl>
            </GridItem>

            <GridItem
              colSpan={2}
              w="100%"
              h="auto"
              px={1}
              //border="1px solid"
            >
              <FormControl>
                <Controller
                  control={control}
                  name="totportnqty"
                  defaultValue={totals.totportnqty}
                  render={({ field: { onChange, value, ref } }) => (
                    <VStack w="100%" py={1} align="left">
                      <Text as="b" fontSize="sm" align="left">
                        Total PO Return Qty
                      </Text>
                      <Input
                        name="totportnqty"
                        value={currency(value, { precision: 3 }) || 0}
                        //type="number"
                        width="full"
                        textAlign="right"
                        onChange={onChange}
                        borderColor="gray.400"
                        //textTransform="capitalize"
                        ref={ref}
                        placeholder="total purchases return qty"
                        readOnly
                      />
                    </VStack>
                  )}
                />
              </FormControl>
            </GridItem>
            <GridItem
              colSpan={2}
              w="100%"
              h="auto"
              px={1}
              //border="1px solid"
            >
              <FormControl>
                <Controller
                  control={control}
                  name="totsalesrtnqty"
                  defaultValue={totals.totsalesrtnqty}
                  render={({ field: { onChange, value, ref } }) => (
                    <VStack w="100%" py={1} align="left">
                      <Text as="b" fontSize="sm" align="left">
                        Total Sales Return Qty
                      </Text>
                      <Input
                        name="totsalesrtnqty"
                        value={currency(value, { precision: 3 }) || 0}
                        //type="number"
                        width="full"
                        textAlign="right"
                        onChange={onChange}
                        borderColor="gray.400"
                        //textTransform="capitalize"
                        ref={ref}
                        placeholder="total sales return qty"
                        readOnly
                      />
                    </VStack>
                  )}
                />
              </FormControl>
            </GridItem>

            <GridItem
              colSpan={2}
              w="100%"
              h="auto"
              px={1}
              //border="1px solid"
            ></GridItem>
            {/*   <GridItem
              colSpan={2}
              w="100%"
              h="auto"
              px={1}
              //border="1px solid"
            ></GridItem> */}
            <GridItem
              colSpan={2}
              w="100%"
              h="auto"
              px={1}
              //border="1px solid"
            >
              <FormControl>
                <Controller
                  control={control}
                  name="totonhandamt"
                  defaultValue={totals.totonhandamt}
                  render={({ field: { onChange, value, ref } }) => (
                    <VStack w="100%" py={1} align="left">
                      <Text as="b" fontSize="sm" align="left">
                        Total Onhand Amount
                      </Text>
                      <Input
                        name="totonhandamt"
                        value={currency(value || 0).format()}
                        //type="number"
                        width="full"
                        textAlign="right"
                        onChange={onChange}
                        borderColor="gray.400"
                        //textTransform="capitalize"
                        ref={ref}
                        placeholder="total onhand amount"
                        readOnly
                      />
                    </VStack>
                  )}
                />
              </FormControl>
            </GridItem>
            <GridItem
              colSpan={2}
              w="100%"
              h="auto"
              px={1}
              //border="1px solid"
            >
              <FormControl>
                <Controller
                  control={control}
                  name="totpoamt"
                  defaultValue={totals.totpoamt}
                  render={({ field: { onChange, value, ref } }) => (
                    <VStack w="100%" py={1} align="left">
                      <Text as="b" fontSize="sm" align="left">
                        Total PO Amt
                      </Text>
                      <Input
                        name="totpoamt"
                        value={currency(value || 0).format()}
                        //type="number"
                        width="full"
                        textAlign="right"
                        onChange={onChange}
                        borderColor="gray.400"
                        //textTransform="capitalize"
                        ref={ref}
                        placeholder="total purchases amount"
                        readOnly
                      />
                    </VStack>
                  )}
                />
              </FormControl>
            </GridItem>
            <GridItem
              colSpan={2}
              w="100%"
              h="auto"
              px={1}
              //border="1px solid"
            >
              <FormControl>
                <Controller
                  control={control}
                  name="totsalesamt"
                  defaultValue={totals.totsalesamt}
                  render={({ field: { onChange, value, ref } }) => (
                    <VStack w="100%" py={1} align="left">
                      <Text as="b" fontSize="sm" align="left">
                        Total Sales Amount
                      </Text>
                      <Input
                        name="totsalesamt"
                        value={currency(value || 0).format()}
                        //type="number"
                        width="full"
                        textAlign="right"
                        onChange={onChange}
                        borderColor="gray.400"
                        //textTransform="capitalize"
                        ref={ref}
                        placeholder="total sales amount"
                        readOnly
                      />
                    </VStack>
                  )}
                />
              </FormControl>
            </GridItem>
            <GridItem
              colSpan={2}
              w="100%"
              h="auto"
              px={1}
              //border="1px solid"
            >
              <FormControl>
                <Controller
                  control={control}
                  name="totportnamt"
                  defaultValue={totals.totportnamt}
                  render={({ field: { onChange, value, ref } }) => (
                    <VStack w="100%" py={1} align="left">
                      <Text as="b" fontSize="sm" align="left">
                        Total PO Return Amt
                      </Text>
                      <Input
                        name="totportnamt"
                        value={currency(value || 0).format()}
                        //type="number"
                        width="full"
                        textAlign="right"
                        onChange={onChange}
                        borderColor="gray.400"
                        //textTransform="capitalize"
                        ref={ref}
                        placeholder="total purchases return amount"
                        readOnly
                      />
                    </VStack>
                  )}
                />
              </FormControl>
            </GridItem>

            <GridItem
              colSpan={2}
              w="100%"
              h="auto"
              px={1}
              //border="1px solid"
            >
              <FormControl>
                <Controller
                  control={control}
                  name="totsalesrtnamt"
                  defaultValue={totals.totsalesrtnamt}
                  render={({ field: { onChange, value, ref } }) => (
                    <VStack w="100%" py={1} align="left">
                      <Text as="b" fontSize="sm" align="left">
                        Total Sales Return Amount
                      </Text>
                      <Input
                        name="totsalesrtnamt"
                        value={currency(value || 0).format()}
                        //type="number"
                        width="full"
                        textAlign="right"
                        onChange={onChange}
                        borderColor="gray.400"
                        //textTransform="capitalize"
                        ref={ref}
                        placeholder="total sales return amount"
                        readOnly
                      />
                    </VStack>
                  )}
                />
              </FormControl>
            </GridItem>
          </Grid>
          <Box
            width="100%"
            borderWidth={1}
            borderColor="teal.800"
            borderRadius={10}
            border="1px solid teal"
            overflow="scroll"
            px={5}
            mt={5}
          >
            <CustomReactTable
              title={title}
              columns={columns}
              data={
                itemshistory
                  ? itemshistory.filter((r) => r.it_itemno === selecteditemno)
                  : {}
              }
              initialState={{
                sorting: [{ id: "date", desc: true }],
              }}
              disableEditAction={false}
              disableExportStatus={true}
              disableRowActionStatus={true}
              disableAddStatus={true}
              disableEditStatus={true}
            />
          </Box>
        </form>
      </VStack>
      <Modal opened={isItemSearchOpen} onClose={onItemSearchClose} size="6xl">
        <ItemSearchTable
          state={state}
          setState={setState}
          //add_Item={add_InvDetls}
          update_Item={update_ItemDetls}
          statustype={statustype}
          setStatusType={setStatusType}
          onItemSearchClose={onItemSearchClose}
        />
      </Modal>
    </Box>
  );
};

export default ItemHistoryTable;
