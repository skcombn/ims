import React, { useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import {
  IconButton,
  Avatar,
  Box,
  CloseButton,
  Container,
  Flex,
  Heading,
  Grid,
  GridItem,
  HStack,
  VStack,
  Icon,
  useColorModeValue,
  Link,
  Drawer,
  DrawerContent,
  Text,
  useDisclosure,
  BoxProps,
  FlexProps,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  SimpleGrid,
} from '@chakra-ui/react';
import {
  FiHome,
  FiTrendingUp,
  FiCompass,
  FiStar,
  FiSettings,
  FiMenu,
  FiBell,
  FiChevronDown,
} from 'react-icons/fi';
import { IconType } from 'react-icons';
import { ReactText } from 'react';
import NavBar from './NavBar';
import RoutesMain from './RoutesMain';
import { SignIn } from './SignIn';
import useLocalStorageState from 'use-local-storage-state';
import { user_localstorage_key } from '../utils/constants';

const Main = () => {
  const navigate = useNavigate();
  const [localstate, setLocalState, { removeItem }] = useLocalStorageState(
    user_localstorage_key
  );
  const [select, setSelect] = React.useState('Dashboard');

  // useEffect(() => {
  //   setLocalState({ user: 'User', level: 'Admin' });
  // }, []);

  return (
    <Grid flexDirection="rows">
      <GridItem>
        <NavBar />
      </GridItem>
      <GridItem>
        <RoutesMain />
      </GridItem>
    </Grid>
  );
};

export default Main;
