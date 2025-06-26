import React, { useState, useEffect, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { IconScan } from "@tabler/icons-react";
import { formatPrice } from "../helpers/utils";
import { FiSave } from "react-icons/fi";
//import { AiOutlineSearch } from 'react-icons/ai';
import { ImExit } from "react-icons/im";
import { SearchIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";
import { useIsFetching } from "@tanstack/react-query";
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
  Heading,
  HStack,
  IconButton,
  Image,
  Input,
  InputGroup,
  InputLeftAddon,
  InputLeftElement,
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
import { Grid } from "@mantine/core";
import {
  IconEdit,
  IconTrash,
  IconSquareRoundedPlus,
  IconPlus,
  IconSend,
  IconDoorExit,
} from "@tabler/icons-react";
import { useTranSerial } from "../react-query/transserial/useTranSerial";
import { useAddTranSerial } from "../react-query/transserial/useAddTranSerial";
import { AlertDialogBox } from "../helpers/AlertDialogBox";
import CustomReactTable from "../helpers/CustomReactTable";

const TranPOSerialForm = ({
  state,
  setState,
  serialstate,
  setSerialState,
  statustype,
  add_Item,
  update_Item,
  onFormClose,
}) => {
  const isFetching = useIsFetching();
  const navigate = useNavigate();
  const field_gap = "3";
  const [serialno, setSerialNo] = useState("");

  console.log("serialno", serialno);
  console.log("serialstate", serialstate);

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
      ...state,
    },
  }); */

  const serialcolumns = useMemo(
    () => [
      {
        header: "Serial No",
        accessorKey: "ts_serialno",
        //enableEditing: false,
        //size: 150,
      },
    ],
    []
  );

  const onSubmit = (values) => {
    onFormClose();
  };

  const handleExit = () => {
    onFormClose();
  };

  const handleAddItem = () => {
    console.log("add state", state);

    const newRec = {
      ts_serialno: serialno,
      ts_tranno: state.tl_id,
      ts_itemno: state.tl_itemno,
    };
    setSerialState((prev) => (prev = [...serialstate, newRec]));
    setSerialNo((prev) => (prev = ""));
    //setValue("ts_serialno", "");
  };

  const handleClear = (values) => {
    console.log("clear");
  };

  const handleAddState = (values) => {
    console.log("add");
  };

  const handleEditState = (values) => {
    console.log("edit");
  };

  const handleDelState = (values) => {
    console.log("del");
  };

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
        <Grid columns={6}>
          <Grid.Col span={3}>
            <VStack alignItems={"flex-start"} px={1}>
              <Heading size="lg">Serial No Form</Heading>
              <Divider border="2px solid teal" />
            </VStack>
          </Grid.Col>
          {/* <Grid.Col span={1}></Grid.Col> */}
          <Grid.Col span={3}>
            <ButtonGroup>
              <Button
                variant={"outline"}
                size="lg"
                colorScheme="teal"
                //isLoading={isSubmitting}
                type="submit"
                onClick={onSubmit}
                leftIcon={<IconSend />}
                isDisabled={isFetching}
              >
                Submit
              </Button>
              <Button
                variant={"outline"}
                size="lg"
                colorScheme="teal"
                //isLoading={isSubmitting}
                onClick={handleExit}
                leftIcon={<IconDoorExit />}
              >
                Close
              </Button>
            </ButtonGroup>
          </Grid.Col>
        </Grid>
        <Grid columns={6}>
          <Grid.Col span={2}>
            <HStack>
              <InputGroup>
                <HStack w="100%" py={1}>
                  <VStack align="left">
                    <Text as="b" fontSize="sm" textAlign="left">
                      Serial No
                    </Text>
                    <Input
                      name="ts_serialno"
                      value={state.ts_serialno}
                      width="full"
                      onChange={(e) => {
                        setSerialNo(e.target.value);
                      }}
                      /*  onKeyDown={(e) => {
                          e.key === "Enter" && handleDespKeyDown(e);
                        }} */
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
          </Grid.Col>
          <Grid.Col span={2}>
            <Box>
              <ButtonGroup mt={8}>
                <Button
                  colorScheme="teal"
                  onClick={handleAddItem}
                  //isDisabled={state.std_itemno.length < 5}
                >
                  Add
                </Button>
                <Button colorScheme="teal" onClick={handleClear}>
                  Clear
                </Button>
              </ButtonGroup>
            </Box>
          </Grid.Col>
          <Grid.Col span={6}>
            <CustomReactTable
              title="Serial No"
              columns={serialcolumns}
              data={serialstate}
              handleAdd={handleAddState}
              handleEdit={handleEditState}
              handleDelete={handleDelState}
              disableExportStatus={true}
              initialState={{ sorting: [{ id: "ts_serialno", desc: false }] }}
            />
          </Grid.Col>
        </Grid>
      </VStack>
    </Flex>
  );
};

export default TranPOSerialForm;
