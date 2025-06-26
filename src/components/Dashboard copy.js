import React, { useState } from 'react';
import {
  IconButton,
  Box,
  CloseButton,
  Flex,
  Icon,
  useColorModeValue,
  Text,
  Drawer,
  DrawerContent,
  useDisclosure,
  BoxProps,
  FlexProps,
} from '@chakra-ui/react';
import { Grid } from '@mantine/core';
import {
  FiHome,
  FiTrendingUp,
  FiCompass,
  FiStar,
  FiSettings,
  FiMenu,
} from 'react-icons/fi';
import RoutesMain from './RoutesMain';
import DashboardSidebar from './DashboardSidebar';
import DashboardItems from './DashboardItems';
import DashboardSales from './DashboardSales';
const Dashboard = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [select, setSelect] = useState('items');

  const SwitchCase = () => {
    switch (select) {
      case 'items':
        return <DashboardItems status="" />;
      case 'sales':
        return <DashboardSales status="" />;

      default:
        return 'You are not authorised user!';
    }
  };

  return (
    <Flex w="100%" h="600" overflow="scroll" px={5}>
      <Grid>
        <Grid.Col span="content">
          <DashboardSidebar setSelect={setSelect} />
        </Grid.Col>
        <Grid.Col span={'auto'}>
          <SwitchCase />
        </Grid.Col>
      </Grid>
    </Flex>
  );
};

export default Dashboard;
