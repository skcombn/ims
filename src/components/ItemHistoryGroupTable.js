import React, { useState, useEffect, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useIsFetching } from '@tanstack/react-query';
import { Toast } from '../helpers/CustomToastify';
import { ImExit } from 'react-icons/im';
import { AddIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';
import { NumericFormat } from 'react-number-format';

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
import { Modal, NumberInput, Select, Tabs } from '@mantine/core';
import { useRecoilState } from 'recoil';
import { itemState, editItemIdState } from '../data/atomdata';
import {
  IconCreativeCommonsNd,
  IconDoorExit,
  IconSend,
} from '@tabler/icons-react';
import CustomReactTable from '../helpers/CustomReactTable';
import { useItems } from '../react-query/items/useItems';
import { useItemsHistoryGroupByItemno } from '../react-query/itemshistory/useItemsHistoryGroupByItemno';
import { useAddItem } from '../react-query/items/useAddItem';
import { useUpdateItem } from '../react-query/items/useUpdateItem';
import { useItemGroups } from '../react-query/itemgroup/useItemGroups';
import { useGroups } from '../react-query/groups/useGroups';
import GroupForm from './GroupForm';

const ItemHistoryGroupTable = ({ itemno }) => {
  console.log('item history', itemno);
  const { items } = useItems();
  const { itemshistorygroup, setHistGrpItemno } =
    useItemsHistoryGroupByItemno();

  const title = 'Items';

  const columns = useMemo(
    () => [
      {
        header: 'Year',
        accessorFn: row => row.txn_year,
        size: 100,
        mantineTableBodyCellProps: {
          align: 'left',
        },
      },
      {
        id: 'Month',
        header: 'Month',
        accessorFn: row => row.txn_month,
        size: 200,
        mantineTableBodyCellProps: {
          align: 'left',
        },
      },
      {
        header: 'IN Qty',
        accessorFn: row => row.mtdqty,
        Cell: ({ row }) => (
          <NumericFormat
            value={row.original.mtdqty}
            decimalScale={3}
            fixedDecimalScale
            displayType="text"
          />
        ),
        //size: 200,
        mantineTableBodyCellProps: {
          align: 'left',
        },
      },
      {
        header: 'IN Amount',
        accessorFn: row => row.mtdamt,
        size: 100,
        Cell: ({ cell }) =>
          cell.getValue()?.toLocaleString?.('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }),
        mantineTableBodyCellProps: {
          align: 'right',
        },
      },
      {
        header: 'OUT Qty',
        accessorFn: row => row.mthqty,
        Cell: ({ row }) => (
          <NumericFormat
            value={row.original.mthqty}
            decimalScale={3}
            fixedDecimalScale
            displayType="text"
          />
        ),
        //size: 200,
        mantineTableBodyCellProps: {
          align: 'left',
        },
      },
      {
        header: 'OUT Amount',
        accessorFn: row => row.mtdamt,
        size: 100,
        Cell: ({ cell }) =>
          cell.getValue()?.toLocaleString?.('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }),
        mantineTableBodyCellProps: {
          align: 'right',
        },
      },
    ],
    []
  );

  useEffect(() => {
    setHistGrpItemno(itemno);
  }, [itemno]);

  return (
    <Flex p={5}>
      <Box
        width="100%"
        borderWidth={1}
        borderColor="teal.800"
        borderRadius={15}
        overflow="auto"
      >
        <CustomReactTable
          title={title}
          columns={columns}
          data={itemshistorygroup}
          disableAddStatus={true}
          disableEditStatus={true}
          initialState={{ sorting: [{ id: 'desp', desc: false }] }}
        />
      </Box>
    </Flex>
  );
};

export default ItemHistoryGroupTable;
