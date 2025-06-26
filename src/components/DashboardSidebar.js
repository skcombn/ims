import React, { useState } from 'react';
import {
  Button,
  Card,
  Center,
  Flex,
  HStack,
  VStack,
  Text,
  Icon,
  IconButton,
  Divider,
  Avatar,
  Heading,
  Menu,
  MenuItem,
  MenuButton,
  MenuList,
  MenuItemOption,
  MenuOptionGroup,
  useDisclosure,
  textDecoration,
} from '@chakra-ui/react';
import {
  FiMenu,
  FiHome,
  FiCalendar,
  FiUser,
  FiDollarSign,
  FiBriefcase,
  FiSettings,
} from 'react-icons/fi';
import {
  IconClipboardList,
  IconChartArrowsVertical,
  IconChartBar,
  IconFileInvoice,
} from '@tabler/icons-react';
import { Group } from '@mantine/core';
import { ImTextColor } from 'react-icons/im';

export default function DashboardSidebar({ setSelect }) {
  const menu_top = '5';
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [navSize, changeNavSize] = useState('large');

  return (
    <Flex
      pos="sticky"
      left="5"
      h="100vh"
      marginTop="0vh"
      boxShadow="0 4px 12px 0 rgba(0, 0, 0, 0.05)"
      borderRadius={navSize == 'small' ? '10px' : '10px'}
      border="1px solid teal"
      w={navSize == 'small' ? '75px' : '250px'}
      flexDir="column"
      justifyContent="space-between"
    >
      <Flex
        p="5%"
        flexDir="column"
        w="100%"
        alignItems={navSize === 'small' ? 'center' : 'flex-start'}
        as="nav"
      >
        {/*  <IconButton
          background="none"
          mt={2}
          size="lg"
          _hover={{ background: 'none' }}
          icon={<FiMenu />}
          onClick={() => {
            if (navSize == 'small') changeNavSize('large');
            else changeNavSize('small');
          }}
        /> */}
        <Menu
          isLazy
          placement="right"
          autoSelect={true}
          defaultIsOpen
          _hover={{ bg: 'gray.400' }}
          _expanded={{ bg: 'teal.400' }}
          _focus={{ boxShadow: 'outline', bg: 'teal' }}
        >
          <MenuItem pt={menu_top} onClick={() => setSelect('items')}>
            {/* <Icon
              as={FiCalendar}
              fontSize="xl"
              size={'lg'}
              bgColor={'teal.100'}
              //color={active ? "#82AAAD" : "gray.500"}
              />
              <Text ml={5} display={navSize === 'small' ? 'none' : 'flex'}>
              Items
              </Text> */}
            <Group>
              <IconButton onClick={() => setSelect('items')} size="lg">
                <IconClipboardList size="50" color="teal" />
              </IconButton>

              <Heading size="md">Items</Heading>
            </Group>
          </MenuItem>
          <MenuItem pt={menu_top} onClick={() => setSelect('sales')}>
            <Group>
              <IconButton onClick={() => setSelect('items')} size="lg">
                <IconChartArrowsVertical size="50" color="teal" />
              </IconButton>

              <Heading size="md">Sales</Heading>
            </Group>
          </MenuItem>
          <MenuItem pt={menu_top} onClick={() => setSelect('deletedorders')}>
            <Group>
              <IconButton onClick={() => setSelect('items')} size="lg">
                <IconChartBar size="50" color="teal" />
              </IconButton>

              <Heading size="md">Purchases</Heading>
            </Group>
          </MenuItem>
        </Menu>
      </Flex>
    </Flex>
  );
}
