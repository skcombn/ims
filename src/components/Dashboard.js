import React, { useState } from "react";
import {
  IconButton,
  Box,
  CloseButton,
  Flex,
  Icon,
  Heading,
  useColorModeValue,
  Text,
  Drawer,
  DrawerContent,
  useDisclosure,
  BoxProps,
  FlexProps,
} from "@chakra-ui/react";
import { Grid, Tabs } from "@mantine/core";
import {
  IconClipboardList,
  IconChartArrowsVertical,
  IconChartBar,
  IconFileInvoice,
} from "@tabler/icons-react";
import DashboardItems from "./DashboardItems";
import DashboardSales from "./DashboardSales";
import ItemsOverviewStat from "./ItemsOverviewStat";
import CustomersOverviewStat from "./CustomersOverviewStat";
import SuppliersOverviewStat from "./SuppliersOverviewStat";

const Dashboard = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [select, setSelect] = useState("items");

  return (
    <Box
      w="95%"
      h="auto"
      overflow="scroll"
      px={5}
      m={5}
      border="1px solid teal"
      borderRadius={10}
    >
      <Tabs defaultValue="items">
        <Tabs.List>
          <Tabs.Tab
            icon={<IconChartArrowsVertical size="3rem" color="teal" />}
            value="items"
          >
            <Heading size="md">Items</Heading>
          </Tabs.Tab>
          {/*   <Tabs.Tab
            icon={<IconChartBar size="3rem" color="teal" />}
            value="sales"
          >
            <Heading size="md">Sales</Heading>
          </Tabs.Tab> */}
          {/*  <Tabs.Tab
            icon={<IconClipboardList size="3rem" color="teal" />}
            value="purchases"
            aria-label="Get money"
          >
            <Heading size="md">Purchases</Heading>
          </Tabs.Tab> */}
        </Tabs.List>
        <Tabs.Panel value="items" pt="xs">
          <ItemsOverviewStat />
          <DashboardItems />
        </Tabs.Panel>
        {/*  <Tabs.Panel value="sales" pt="xs">
          <CustomersOverviewStat />
        </Tabs.Panel> */}
        {/*  <Tabs.Panel value="purchases" pt="xs">
          <SuppliersOverviewStat />
        </Tabs.Panel> */}
      </Tabs>
    </Box>
  );
};

export default Dashboard;
