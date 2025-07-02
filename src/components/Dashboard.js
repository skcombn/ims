//import React from 'react';
import { Box, Heading } from '@chakra-ui/react';
import { Tabs } from '@mantine/core';
import { IconChartArrowsVertical } from '@tabler/icons-react';
import DashboardItems from './DashboardItems';
import ItemsOverviewStat from './ItemsOverviewStat';

const Dashboard = () => {
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
        </Tabs.List>
        <Tabs.Panel value="items" pt="xs">
          <ItemsOverviewStat />
          <DashboardItems />
        </Tabs.Panel>
      </Tabs>
    </Box>
  );
};

export default Dashboard;
