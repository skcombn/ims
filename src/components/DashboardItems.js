import React, { useState, useMemo } from "react";
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
  Stack,
  StackDivider,
  Text,
  VStack,
  ScaleFade,
  Wrap,
  WrapItem,
  useRadio,
  useRadioGroup,
  useDisclosure,
  useColorMode,
  useColorModeValue,
  useBreakpointValue,
} from "@chakra-ui/react";
import { Tabs } from "@mantine/core";
import StatsCard from "../helpers/StatsCard";
import ItemsMinLvlTable from "./ItemsMinLvlTable";
const DashboardItems = () => {
  return (
    <Box
      w="98%"
      h="auto"
      overflow="scroll"
      px={5}
      m={5}
      border="1px solid teal"
      borderRadius={10}
    >
      {/*  <VStack alignItems={'flex-start'} p={1}>
        <Heading size="md">Items below minimum level</Heading>
        <Divider border="2px solid teal" w={250} />
      </VStack> */}
      <Box p={2} w="full">
        <Tabs keepMounted={false} defaultValue="first">
          <Tabs.List>
            <Tabs.Tab value="first">
              <VStack alignItems={"flex-start"} p={1}>
                <Heading size="md">Items below minimum level</Heading>
                <Divider border="2px solid teal" w={250} />
              </VStack>
            </Tabs.Tab>
            {/*   <Tabs.Tab value="second">Second tab</Tabs.Tab> */}
          </Tabs.List>

          <Tabs.Panel value="first">
            <ItemsMinLvlTable />
          </Tabs.Panel>
          <Tabs.Panel value="second">
            <Container minW="container.lg">Second panel</Container>
          </Tabs.Panel>
        </Tabs>
      </Box>
    </Box>
  );
};

export default DashboardItems;
