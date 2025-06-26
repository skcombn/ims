import React, { useState, useMemo } from 'react';
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
} from '@chakra-ui/react';
import { Tabs } from '@mantine/core';
import { useARMthView } from '../react-query/armthview/useARMthView';

const DashboardSales = () => {
  const { armthview } = useARMthView();

  return (
    <Container maxW="container.lg">
      <VStack alignItems={'flex-start'} p={1}>
        <Heading size="lg">Sales</Heading>
        <Divider border="2px solid teal" w={100} />
      </VStack>
      <Box p={2} border="1px solid teal" borderRadius={10} w="full">
        <Tabs keepMounted={false} defaultValue="first">
          <Tabs.List>
            <Tabs.Tab value="first">First tab</Tabs.Tab>
            <Tabs.Tab value="second">Second tab</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="first">
            <Container minW="container.lg">First panel</Container>
          </Tabs.Panel>
          <Tabs.Panel value="second">
            <Container minW="container.lg">Second panel</Container>
          </Tabs.Panel>
        </Tabs>
      </Box>
    </Container>
  );
};

export default DashboardSales;
