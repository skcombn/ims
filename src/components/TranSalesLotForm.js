import React, { useState, useEffect } from "react";
import { useIsFetching } from "@tanstack/react-query";
import { MantineReactTable, useMantineReactTable } from "mantine-react-table";
import { Controller, useForm } from "react-hook-form";
import { nanoid } from "nanoid";
import { formatPrice } from "../helpers/utils";
import { FiSave } from "react-icons/fi";
import { AiOutlineSearch } from "react-icons/ai";
import { ImExit } from "react-icons/im";
import { useNavigate } from "react-router-dom";
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
  //Text,
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
import { Modal, NumberInput, ActionIcon, Text, Tooltip } from "@mantine/core";
import { IconDoorExit, IconSend } from "@tabler/icons-react";
import {
  IconEdit,
  IconTrash,
  IconSquareRoundedPlus,
  IconPlus,
} from "@tabler/icons-react";
import { useItemsExpiry } from "../react-query/itemsexpiry/useItemsExpiry";
import CustomReactTable from "../helpers/CustomReactTable";
import CustomReactSelectTable from "../helpers/CustomReactSelectTable";
import ItemSearchTable from "./ItemSearchTable";
import { useItems } from "../react-query/items/useItems";
import { useRecoilState } from "recoil";
import {
  editTranIdState,
  editTranDetlsIdState,
  editTranLotsIdState,
} from "../data/atomdata";

const TranSalesLotForm = ({
  state,
  setState,
  lotstate,
  setLotState,
  //statustype,
  add_Item,
  update_Item,
  onItemClose,
  add_LotItem,
  update_LotItem,
}) => {
  const isFetching = useIsFetching();
  const navigate = useNavigate();
  const field_width = "150";
  const field_gap = "3";
  const { itemsexpiry, setExpItemId } = useItemsExpiry();
  const [editBatchId, setEditBatchId] = useRecoilState(editTranIdState);
  const [editBatchdetlsId, setEditBatchdetlsId] =
    useRecoilState(editTranDetlsIdState);
  const [editBatchlotsId, setEditBatchlotsId] =
    useRecoilState(editTranLotsIdState);
  const [qty, setQty] = useState(state.tl_qty);
  const [ucost, setUCost] = useState(state.tl_netucost);
  const [isexpirydate, setIsExpiryDate] = useState(state.tl_trackexpiry);

  console.log("detlsform detlsstate", state);
  console.log("detlsform lotsstate", lotstate);

  const {
    isOpen: isSearchOpen,
    onOpen: onSearchOpen,
    onClose: onSearchClose,
  } = useDisclosure();

  const {
    handleSubmit,
    register,
    control,
    reset,
    setValue,
    formState: { errors, isSubmitting, id },
  } = useForm({
    defaultValues: {
      ...state,
    },
  });

  const expirycolumns = [
    /* {
      header: 'ID',
      accessorKey: 'tl_id',
      enableEditing: false,
      enableHiding: true,
    }, */
    {
      header: "PO No",
      accessorKey: "tl_pono",
      enableEditing: false,
    },
    {
      header: "Expiry Date",
      accessorKey: "tl_dateexpiry",
      enableEditing: false,
    },
    {
      header: "Qty Received",
      accessorKey: "tl_qtyreceived",
      enableEditing: false,
      mantineTableBodyCellProps: {
        align: "right",
      },
    },
    {
      header: "Qty Onhand",
      accessorKey: "tl_qtyonhand",
      enableEditing: false,
      mantineTableBodyCellProps: {
        align: "right",
      },
    },
    {
      header: "Location",
      accessorKey: "tl_location",
      enableEditing: false,
    },
    {
      header: "Qty",
      accessorKey: "tl_qty",
      enableEditing: true,
      mantineTableBodyCellProps: {
        align: "right",
      },
    },
  ];

  //CREATE action
  const handleCreateItem = ({ values, exitCreatingMode }) => {
    //console.log("create", values);
    //handleAdd({ ...values });
    exitCreatingMode();
  };

  //UPDATE action
  const handleSaveItem = ({ values, table, row }) => {
    const { original } = row;
    console.log("rowedit", original);
    update_LotItem({ ...original });
    table.setEditingRow(null); //exit editing mode
    setQty((prev) => prev + original.tl_qty);
  };

  const table = useMantineReactTable({
    title: "Expiry Lots Table",
    columns: expirycolumns,
    data: lotstate.filter((r) => r.tl_post === "0"),
    initialState: {
      columnVisibility: { tl_id: false },
      sorting: [{ id: "tl_dateexpiry", desc: false }],
      density: "xs",
    },
    createDisplayMode: "row",
    editDisplayMode: "row",
    enableEditing: true,
    enableTopToolbar: false,
    getRowId: (row) => row.id,
    onCreatingRowSave: handleCreateItem,
    onEditingRowSave: handleSaveItem,
    renderRowActions: ({ row, table }) => (
      <Flex gap="md">
        <Tooltip label="Edit">
          <ActionIcon onClick={() => table.setEditingRow(row)}>
            <IconEdit />
          </ActionIcon>
        </Tooltip>
        {/*  <Tooltip label="Delete">
          <ActionIcon color="red" onClick={() => openDeleteConfirmModal(row)}>
            <IconTrash />
          </ActionIcon>
        </Tooltip> */}
      </Flex>
    ),
    /*  renderTopToolbarCustomActions: ({ table }) => (
      <ActionIcon
        variant="outline"
        onClick={() => {
          table.setCreatingRow(true);
        }}
        color="teal"
      >
        <IconPlus size="40" />
      </ActionIcon>
    ), */
  });

  const onSubmit = (values) => {
    //console.log('status', statustype);
    if (editBatchdetlsId.type === "edit") {
      update_Item(values);
      update_LotItem(lotstate);
    }
    if (editBatchdetlsId.type === "add") {
      add_Item(values);
      add_LotItem(lotstate);
    }
    onItemClose();
  };

  const handleExit = () => {
    onItemClose();
  };

  const update_ItemDetls = (data) => {
    console.log("upditem", data);
    const {
      item_no,
      item_desp,
      item_packing,
      item_unit,
      item_ucost_pc,
      item_trackexpiry,
    } = data;
    setExpItemId((prev) => (prev = item_no));
    setValue("tl_itemno", item_no);
    setValue("tl_desp", item_desp);
    setValue("tl_packing", item_packing);
    setValue("tl_unit", item_unit);
    setValue("tl_ucost", item_ucost_pc);
    setValue("tl_netucost", item_ucost_pc);
    setValue("tl_trackexpiry", item_trackexpiry);
    setQty((prev) => (prev = 0));
    setUCost((prev) => (prev = item_ucost_pc));
    setIsExpiryDate(item_trackexpiry);
    //update batchlots
    const newLotData = itemsexpiry
      .filter((r) => r.ie_itemno === item_no)
      .map((rec) => {
        return {
          tl_id: nanoid(),
          tl_tranno: editTranIdState.no,
          tl_itemno: rec.ie_itemno,
          tl_type: "item",
          tl_lotno: rec.ie_lotno,
          tl_datereceived: rec.ie_datereceived,
          tl_location: rec.ie_location,
          tl_dateexpiry: rec.ie_dateexpiry,
          tl_pono: rec.ie_pono,
          tl_podate: rec.ie_podate,
          tl_qtyonhand: rec.ie_qtyonhand,
          tl_qtyreceived: rec.ie_qtyreceived,
          tl_ucost: rec.ie_ucost,
          tl_post: rec.ie_post,
          tl_qty: 0,
        };
      });
    console.log("lot", newLotData);
    const lotdata = [{ ...lotstate }, { ...newLotData }];
    console.log("lotstate add", lotdata);
    setLotState([...lotstate, ...newLotData]);
  };

  const update_extamount = (data) => {
    console.log("calc amt", data, state.tl_netucost, state.tl_qty);
  };

  const handleItemSearch = () => {
    onSearchOpen();
  };

  const handleExpiryQty = () => {
    let bal = qty;
    let onhand = 0;
    var BreakException = {};
    const lotdata = lotstate
      .sort((a, b) => (a.tl_dateexpiry > b.tl_dateexpiry ? 1 : -1))
      .map((rec) => {
        onhand = rec.tl_qtyonhand;
        bal = onhand - bal;
        console.log("bal", bal);
        if (bal >= 0) {
          return { ...rec, tl_qty: bal };
        } else {
          return { ...rec, tl_qty: onhand };
        }
      });
    setLotState(lotdata);
    console.log("exp calc", lotdata);
  };

  useEffect(() => {
    const amt = Math.round(qty * ucost, 2);
    setValue("tl_excost", amt);
    if (isexpirydate && qty > 0) {
      handleExpiryQty();
    }
    console.log("recalc", amt, qty, ucost);
  }, [qty, ucost]);

  return (
    <Flex
      h={{ base: "auto", md: "auto" }}
      py={[0, 0, 0]}
      direction={{ base: "column-reverse", md: "row" }}
      overflowY="scroll"
    >
      <VStack
        w={{ base: "auto", md: "full" }}
        h={{ base: "auto", md: "full" }}
        p="2"
        spacing="10"
        //alignItems="flex-start"
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid templateColumns={"repeat(4,1fr)"} columnGap={3} pb={2}>
            <GridItem colSpan={2}>
              <VStack alignItems={"flex-start"} px={1}>
                <Heading size="lg">Details Form</Heading>
                <Divider border="2px solid teal" w={250} />
              </VStack>
            </GridItem>
            <GridItem></GridItem>
            <GridItem>
              <ButtonGroup>
                <Button
                  variant={"outline"}
                  size="lg"
                  colorScheme="teal"
                  isLoading={isSubmitting}
                  type="submit"
                  onClick={handleSubmit(onSubmit)}
                  leftIcon={<IconSend />}
                  isDisabled={isFetching}
                >
                  Submit
                </Button>
                <Button
                  variant={"outline"}
                  size="lg"
                  colorScheme="teal"
                  isLoading={isSubmitting}
                  onClick={handleExit}
                  leftIcon={<IconDoorExit />}
                >
                  Close
                </Button>
              </ButtonGroup>
            </GridItem>
          </Grid>
          <Grid
            templateColumns="9"
            templateRows="7"
            columnGap={3}
            rowGap={3}
            px={5}
            py={2}
            w={{ base: "auto", md: "full", lg: "full" }}
            border="1px solid blue"
            borderRadius="10"
          >
            <GridItem colSpan={3} mt={field_gap}>
              <HStack>
                <FormControl>
                  <Controller
                    control={control}
                    name="tl_pono"
                    defaultValue={state.tl_pono}
                    render={({ field: { onChange, value, ref } }) => (
                      <InputGroup>
                        <HStack w="100%" py={1}>
                          <InputLeftAddon
                            children="PO No"
                            minWidth={field_width}
                          />
                          <Input
                            name="tl_pono"
                            value={value || ""}
                            width="full"
                            onChange={onChange}
                            borderColor="gray.400"
                            //textTransform="capitalize"
                            ref={ref}
                            placeholder="po no"
                            minWidth="100"
                            readOnly
                          />
                        </HStack>
                      </InputGroup>
                    )}
                  />
                </FormControl>
                <Box pt={0}>
                  <IconButton
                    onClick={() => handleItemSearch()}
                    icon={<AiOutlineSearch />}
                    size="md"
                    colorScheme="teal"
                  />
                </Box>
              </HStack>
            </GridItem>
            <GridItem colSpan={7} mt={field_gap}>
              <FormControl>
                <Controller
                  control={control}
                  name="tl_dateexpiry"
                  defaultValue={state.pl_dateexpiry}
                  render={({ field: { onChange, value, ref } }) => (
                    <InputGroup>
                      <HStack w="100%" py={1}>
                        <InputLeftAddon
                          children="Date Expiry"
                          minWidth={field_width}
                        />
                        <Input
                          name="tl_dateexpiry"
                          value={value || ""}
                          width="full"
                          onChange={onChange}
                          borderColor="gray.400"
                          //textTransform="capitalize"
                          ref={ref}
                          placeholder="item description"
                          minWidth="200"
                          readOnly
                        />
                      </HStack>
                    </InputGroup>
                  )}
                />
              </FormControl>
            </GridItem>

            <GridItem colSpan={9} mt={field_gap}>
              <FormControl>
                <Controller
                  control={control}
                  name="tl_qtyreceived"
                  defaultValue={state.tl_qtyreceived}
                  render={({ field: { onChange, value, ref } }) => (
                    <InputGroup>
                      <HStack w="100%" py={1}>
                        <InputLeftAddon
                          children="Qty Received"
                          minWidth={field_width}
                        />
                        <NumberInput
                          name="tl_qtyreceived"
                          value={value || 0}
                          precision={2}
                          //fixedDecimalScale
                          parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                          formatter={(value) =>
                            !Number.isNaN(parseFloat(value))
                              ? ` ${value}`.replace(
                                  /\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g,
                                  ","
                                )
                              : " "
                          }
                          width="full"
                          onChange={(e) => {
                            onChange(onChange);
                            setQty((prev) => (prev = e));
                          }}
                          //borderColor="gray.400"
                          //textTransform="capitalize"
                          ref={ref}
                          //placeholder="qty"
                          readOnly
                        />
                      </HStack>
                    </InputGroup>
                  )}
                />
              </FormControl>
            </GridItem>
            <GridItem colSpan={9} mt={field_gap}>
              <FormControl>
                <Controller
                  control={control}
                  name="tl_qtyonhand"
                  defaultValue={state.tl_qtyonhand}
                  render={({ field: { onChange, value, ref } }) => (
                    <InputGroup>
                      <HStack w="100%" py={1}>
                        <InputLeftAddon
                          children="Qty Received"
                          minWidth={field_width}
                        />
                        <NumberInput
                          name="tl_qtyonhand"
                          value={value || 0}
                          precision={2}
                          //fixedDecimalScale
                          parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                          formatter={(value) =>
                            !Number.isNaN(parseFloat(value))
                              ? ` ${value}`.replace(
                                  /\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g,
                                  ","
                                )
                              : " "
                          }
                          width="full"
                          onChange={(e) => {
                            onChange(onChange);
                            setQty((prev) => (prev = e));
                          }}
                          //borderColor="gray.400"
                          //textTransform="capitalize"
                          ref={ref}
                          //placeholder="qty"
                          readOnly
                        />
                      </HStack>
                    </InputGroup>
                  )}
                />
              </FormControl>
            </GridItem>
            <GridItem colSpan={9} mt={field_gap}>
              <FormControl>
                <Controller
                  control={control}
                  name="tl_qty"
                  defaultValue={state.tl_qty}
                  render={({ field: { onChange, value, ref } }) => (
                    <InputGroup>
                      <HStack w="100%" py={1}>
                        <InputLeftAddon children="Qty" minWidth={field_width} />
                        <NumberInput
                          name="tl_qty"
                          value={value || 0}
                          precision={2}
                          //fixedDecimalScale
                          parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                          formatter={(value) =>
                            !Number.isNaN(parseFloat(value))
                              ? ` ${value}`.replace(
                                  /\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g,
                                  ","
                                )
                              : " "
                          }
                          width="full"
                          onChange={(e) => {
                            onChange(onChange);
                            setQty((prev) => (prev = e));
                          }}
                          //borderColor="gray.400"
                          //textTransform="capitalize"
                          ref={ref}
                          //placeholder="qty"
                        />
                      </HStack>
                    </InputGroup>
                  )}
                />
              </FormControl>
            </GridItem>
          </Grid>
        </form>
      </VStack>
      <Modal opened={isSearchOpen} onClose={onSearchClose} size="5xl">
        <ItemSearchTable
          state={state}
          setState={setState}
          //add_Item={add_InvDetls}
          update_Item={update_ItemDetls}
          //statustype={statustype}
          //setStatusType={setStatusType}
          onItemSearchClose={onSearchClose}
        />
      </Modal>
    </Flex>
  );
};
export default TranSalesLotForm;
