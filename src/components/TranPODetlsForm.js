import React, { useState, useEffect } from "react";
import { useIsFetching } from "@tanstack/react-query";
import { MantineReactTable, useMantineReactTable } from "mantine-react-table";
import { Controller, useForm } from "react-hook-form";
import { Toast } from "../helpers/CustomToastify";
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
import {
  IconEdit,
  IconTrash,
  IconSquareRoundedPlus,
  IconPlus,
  IconSend,
  IconDoorExit,
} from "@tabler/icons-react";
import { useItems } from "../react-query/items/useItems";
import CustomReactTable from "../helpers/CustomReactTable";
import ItemSearchTable from "./ItemSearchTable";

const TranPODetlsForm = ({
  state,
  setState,
  statustype,
  add_Item,
  update_Item,
  onItemClose,
}) => {
  const isFetching = useIsFetching();
  const navigate = useNavigate();
  const field_width = "150";
  const field_gap = "3";
  const [qty, setQty] = useState(state.tl_qty);
  const [ucost, setUCost] = useState(state.tl_netucost);
  const [isexpirydate, setIsExpiryDate] = useState(state.tl_trackexpiry);
  const [isCalc, setIsCalc] = useState(true);
  const [serialno, setSerialNo] = useState("");
  const [serialnorec, setSerialNoRec] = useState({});
  /* const [trackserial, setTrackSerial] = useState(state.tl_trackserial);
  const [editserialnoId, setEditSerialNoId] = useState({
    id: "",
    status: "add",
  }); */

  console.log("batchdetls state", state);

  const {
    isOpen: isSearchOpen,
    onOpen: onSearchOpen,
    onClose: onSearchClose,
  } = useDisclosure();

  const {
    isOpen: isAlertDeleteOpen,
    onOpen: onAlertDeleteOpen,
    onClose: onAlertDeleteClose,
  } = useDisclosure();

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

  /*  const serialcolumns = [
    {
      header: "Serial No",
      accessorKey: "ts_serialno",
      enableEditing: false,
    },
  ]; */

  const onSubmit = (values) => {
    let lValid = false;
    //check for expiry item
    if (isexpirydate) {
      if (values.tl_trackexpiry && values.tl_lotno.length > 0) {
        lValid = true;
      } else {
        lValid = false;
      }
      if (lValid === false) {
        Toast({
          title: "Lot No field can not be blank!",
          status: "warning",
          customId: "lotnoErr",
        });
      } else {
        if (statustype === "edit") {
          update_Item(values);
        }
        if (statustype === "add") {
          add_Item(values);
        }
      }
    } else {
      if (statustype === "edit") {
        update_Item(values);
      }
      if (statustype === "add") {
        add_Item(values);
      }
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
      item_pack,
      item_unit,
      item_cost,
      item_trackexpiry,
    } = data;
    setValue("tl_itemno", item_no);
    setValue("tl_desp", item_desp);
    setValue("tl_packing", item_pack);
    setValue("tl_unit", item_unit);
    setValue("tl_ucost", item_cost);
    setValue("tl_netucost", item_cost);
    setValue("tl_trackexpiry", item_trackexpiry);
    setQty((prev) => (prev = 0));
    setUCost((prev) => (prev = item_cost));
    setIsExpiryDate(item_trackexpiry);
    // setTrackSerial(item_trackserial);
  };

  const handleItemSearch = () => {
    onSearchOpen();
  };

  /*  const handleAddSerialItem = () => {
    if (editserialnoId.status === "edit") {
      const oldData = serialstate.filter((r) => r.ts_id !== editserialnoId.id);
      const newRec = {
        ...serialnorec,
        ts_serialno: serialno,
      };
      setSerialState((prev) => (prev = [...oldData, newRec]));
    } else {
      const itemno = getValues("tl_itemno");
      const newRec = {
        ts_serialno: serialno,
        ts_trantype: state.tl_trantype,
        ts_itemno: itemno,
        ts_post: "0",
      };
      setSerialState((prev) => (prev = [...serialstate, newRec]));
    }
    setIsCalc(true);
    setSerialNo((prev) => (prev = ""));
  }; */

  /* const handleClearSerialItem = () => {
    setSerialNo((prev) => (prev = ""));
  }; */

  /*  const handleEditSerialItem = (data) => {
    const { original } = data;
    setSerialNoRec((prev) => (prev = original));
    setSerialNo((prev) => (prev = original.ts_serialno));
    setEditSerialNoId(
      (prev) => (prev = { id: original.ts_id, status: "edit" })
    );
  }; */

  /*  const handleDeleteSerialItem = (data) => {
    const { original } = data;
    const updData = serialstate.filter((r) => r.ts_id != original.ts_id);
    setSerialState(updData);
    setSerialNo((prev) => (prev = ""));
    setIsCalc(true);
  }; */

  /*  const handleCalc = () => {
    const totrec = serialstate.reduce((acc, rec) => {
      return acc + 1;
    }, 0);
    setQty(totrec);
    setValue("tl_qty", totrec);
    setIsCalc(false);
  }; */

  useEffect(() => {
    const amt = Math.round(qty * ucost, 2);
    setValue("tl_amount", amt);
    console.log("recalc", amt, qty, ucost);
  }, [qty, ucost]);

  /*  useEffect(() => {
    handleCalc();
  }, [isCalc]); */

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
            border="1px solid teal"
            borderRadius="10"
          >
            <GridItem colSpan={3} mt={field_gap}>
              <HStack>
                <FormControl>
                  <Controller
                    control={control}
                    name="tl_itemno"
                    defaultValue={state.tl_itemno}
                    render={({ field: { onChange, value, ref } }) => (
                      <InputGroup>
                        <HStack w="100%" py={1}>
                          <InputLeftAddon
                            children="Item No"
                            minWidth={field_width}
                          />
                          <Input
                            name="tl_itemno"
                            value={value || ""}
                            width="full"
                            onChange={onChange}
                            borderColor="gray.400"
                            //textTransform="capitalize"
                            ref={ref}
                            placeholder="item no"
                            minWidth="100"
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
            <GridItem colSpan={9} mt={field_gap}>
              <FormControl>
                <Controller
                  control={control}
                  name="tl_desp"
                  defaultValue={state.pl_desp}
                  render={({ field: { onChange, value, ref } }) => (
                    <InputGroup>
                      <HStack w="100%" py={1}>
                        <InputLeftAddon
                          children="Description"
                          minWidth={field_width}
                        />
                        <Input
                          name="tl_desp"
                          value={value || ""}
                          width="full"
                          onChange={onChange}
                          borderColor="gray.400"
                          //textTransform="capitalize"
                          ref={ref}
                          placeholder="item description"
                          minWidth="200"
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
                  name="tl_packing"
                  defaultValue={state.tl_packing}
                  render={({ field: { onChange, value, ref } }) => (
                    <InputGroup>
                      <HStack w="100%" py={1}>
                        <InputLeftAddon
                          children="Packing"
                          minWidth={field_width}
                        />
                        <Input
                          name="tl_packing"
                          value={value || ""}
                          width="full"
                          onChange={onChange}
                          borderColor="gray.400"
                          //textTransform="capitalize"
                          ref={ref}
                          placeholder="item packing"
                          minWidth="500"
                        />
                      </HStack>
                    </InputGroup>
                  )}
                />
              </FormControl>
            </GridItem>
            <GridItem colSpan={3} mt={field_gap}>
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
                          width="50%"
                          onChange={(e) => {
                            onChange(e);
                            setQty((prev) => (prev = e));
                          }}
                          //borderColor="gray.400"
                          //textTransform="capitalize"
                          ref={ref}
                          //placeholder="qty"
                          //readOnly={trackserial}
                        />
                      </HStack>
                    </InputGroup>
                  )}
                />
              </FormControl>
            </GridItem>
            {/*  <GridItem colSpan={3} mt={field_gap}>
              <FormControl>
                <Controller
                  control={control}
                  name="tl_trackserial"
                  defaultValue={trackserial}
                  render={({ field: { onChange, value, ref } }) => (
                    <Checkbox
                      name="tl_trackserial"
                      value={value || false}
                      width="full"
                      label="Track Serial"
                      checked={trackserial}
                      size="lg"
                      onChange={(e) => {
                        onChange(e.target.checked);
                        setTrackSerial(e.target.checked);
                      }}
                      borderColor="gray.400"
                      //textTransform="capitalize"
                      ref={ref}
                      //placeholder="item packing"
                      //minWidth="500"
                    />
                  )}
                />
              </FormControl>
            </GridItem> */}
            <GridItem colSpan={9} mt={field_gap}>
              <FormControl>
                <Controller
                  control={control}
                  name="tl_unit"
                  defaultValue={state.tl_unit}
                  render={({ field: { onChange, value, ref } }) => (
                    <InputGroup>
                      <HStack w="100%" py={1}>
                        <InputLeftAddon
                          children="Unit"
                          minWidth={field_width}
                        />
                        <Input
                          name="tl_unit"
                          value={value || ""}
                          width="full"
                          onChange={onChange}
                          borderColor="gray.400"
                          //textTransform="capitalize"
                          ref={ref}
                          placeholder="unit"
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
                  name="tl_netucost"
                  defaultValue={state.tl_netucost}
                  render={({ field: { onChange, value, ref } }) => (
                    <InputGroup>
                      <HStack w="100%" py={1}>
                        <InputLeftAddon
                          children="Unit Cost"
                          minWidth={field_width}
                        />
                        <NumberInput
                          name="tl_netucost"
                          value={value || 0}
                          precision={2}
                          //fixedDecimalScale
                          parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                          formatter={(value) =>
                            !Number.isNaN(parseFloat(value))
                              ? `$ ${value}`.replace(
                                  /\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g,
                                  ","
                                )
                              : "$ "
                          }
                          width="full"
                          onChange={(e) => {
                            onChange(e);
                            setUCost((prev) => (prev = e));
                          }}
                          //borderColor="gray.400"
                          //textTransform="capitalize"
                          ref={ref}
                          //placeholder="unit cost"
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
                  name="tl_amount"
                  defaultValue={state.tl_amount}
                  render={({ field: { onChange, value, ref } }) => (
                    <InputGroup>
                      <HStack w="100%" py={1}>
                        <InputLeftAddon
                          children="Amount"
                          minWidth={field_width}
                        />
                        <NumberInput
                          name="tl_amount"
                          value={value || 0}
                          precision={2}
                          //fixedDecimalScale
                          parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                          formatter={(value) =>
                            !Number.isNaN(parseFloat(value))
                              ? `$ ${value}`.replace(
                                  /\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g,
                                  ","
                                )
                              : "$ "
                          }
                          width="full"
                          onChange={onChange}
                          //borderColor="gray.400"
                          //textTransform="capitalize"
                          ref={ref}
                          //placeholder="amount"
                        />
                      </HStack>
                    </InputGroup>
                  )}
                />
              </FormControl>
            </GridItem>
            {isexpirydate && (
              <>
                <GridItem colSpan={9} mt={field_gap}>
                  <FormControl>
                    <Controller
                      control={control}
                      name="tl_lotno"
                      defaultValue={state.tl_lotno}
                      rules={{ required: isexpirydate ? true : false }}
                      render={({ field: { onChange, value, ref } }) => (
                        <InputGroup>
                          <HStack w="100%" py={1}>
                            <InputLeftAddon
                              children="Lot No"
                              minWidth={field_width}
                            />
                            <Input
                              name="tl_lotno"
                              value={value || ""}
                              width="full"
                              onChange={onChange}
                              borderColor="gray.400"
                              //textTransform="capitalize"
                              ref={ref}
                              placeholder="lot no"
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
                      name="tl_dateexpiry"
                      defaultValue={state.tl_dateexpiry}
                      rules={{ required: isexpirydate ? true : false }}
                      render={({ field: { onChange, value, ref } }) => (
                        <InputGroup>
                          <HStack w="100%" py={1}>
                            <InputLeftAddon
                              children="Expiry Date"
                              minWidth={field_width}
                            />
                            <Input
                              name="tl_dateexpiry"
                              value={value || ""}
                              type="date"
                              width="full"
                              onChange={onChange}
                              borderColor="gray.400"
                              //textTransform="capitalize"
                              ref={ref}
                              placeholder="Expiry Date"
                            />
                          </HStack>
                        </InputGroup>
                      )}
                    />
                  </FormControl>
                </GridItem>
              </>
            )}
            {/* 
            <GridItem colSpan={9} mt={field_gap}>
              <FormControl>
                <Controller
                  control={control}
                  name="tl_location"
                  defaultValue={state.tl_location}
                  render={({ field: { onChange, value, ref } }) => (
                    <InputGroup>
                      <HStack w="100%" py={1}>
                        <InputLeftAddon
                          children="Location"
                          minWidth={field_width}
                        />
                        <Input
                          name="tl_location"
                          value={value || ''}
                          width="full"
                          onChange={onChange}
                          borderColor="gray.400"
                          //textTransform="capitalize"
                          ref={ref}
                          placeholder="location"
                        />
                      </HStack>
                    </InputGroup>
                  )}
                />
              </FormControl>
            </GridItem> */}
            <GridItem colSpan={9} mt={field_gap}>
              <FormControl>
                <Controller
                  control={control}
                  name="tl_remark"
                  defaultValue={state.tl_remark}
                  render={({ field: { onChange, value, ref } }) => (
                    <InputGroup>
                      <HStack w="100%" py={1}>
                        <InputLeftAddon
                          children="Remark"
                          minWidth={field_width}
                        />
                        <Input
                          name="tl_remark"
                          value={value || ""}
                          width="full"
                          onChange={onChange}
                          borderColor="gray.400"
                          //textTransform="capitalize"
                          ref={ref}
                          placeholder="remark"
                        />
                      </HStack>
                    </InputGroup>
                  )}
                />
              </FormControl>
            </GridItem>
            {/*  {trackserial && (
              <GridItem colSpan={9}>
                <Grid templateColumns={"repeat(6,1fr)"} columnGap={3} pb={2}>
                  <GridItem colSpan={6}>
                    <Divider border="2px solid teal" />
                  </GridItem>
                  <GridItem colSpan={2}>
                    <HStack>
                      <InputGroup>
                        <HStack w="100%" py={1}>
                          <VStack align="left">
                            <Text as="b" fontSize="sm">
                              Serial No
                            </Text>
                            <Input
                              name="ts_serialno"
                              value={serialno}
                              width="full"
                              onChange={(e) => {
                                setSerialNo(e.target.value);
                              }}
                             
                              borderColor="gray.400"
                              //textTransform="capitalize"
                              placeholder="serial no"
                              //minWidth="100"
                              autoComplete="off"
                              isRequired
                            />
                          </VStack>
                        </HStack>
                      </InputGroup>
                    </HStack>
                  </GridItem>
                  <GridItem colSpan={2}>
                    <Box>
                      <ButtonGroup mt={8}>
                        <Button
                          colorScheme="teal"
                          onClick={handleAddSerialItem}
                          //isDisabled={state.std_itemno.length < 5}
                        >
                          Add
                        </Button>
                        <Button
                          colorScheme="teal"
                          onClick={handleClearSerialItem}
                        >
                          Clear
                        </Button>
                      </ButtonGroup>
                    </Box>
                  </GridItem>

                  <GridItem colSpan={6}>
                    <CustomReactTable
                      title="Serial No"
                      columns={serialcolumns}
                      data={serialstate}
                      //handleAdd={handleAddState}
                      handleEdit={handleEditSerialItem}
                      handleDelete={handleDeleteSerialItem}
                      disableAddStatus={true}
                      disableExportStatus={true}
                      initialState={{
                        sorting: [{ id: "ts_serialno", desc: false }],
                      }}
                    />
                  </GridItem>
                </Grid>
              </GridItem>
            )} */}
          </Grid>
        </form>
      </VStack>

      <Modal opened={isSearchOpen} onClose={onSearchClose} size="5xl">
        <ItemSearchTable
          state={state}
          setState={setState}
          //add_Item={add_InvDetls}
          update_Item={update_ItemDetls}
          statustype={statustype}
          //setStatusType={setStatusType}
          onItemSearchClose={onSearchClose}
        />
      </Modal>
    </Flex>
  );
};
export default TranPODetlsForm;
