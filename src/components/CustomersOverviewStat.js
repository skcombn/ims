import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useIsFetching } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { differenceInDays, differenceInCalendarMonths } from 'date-fns';
import currency from 'currency.js';
import { FiServer } from 'react-icons/fi';
import {
  IconUser,
  IconUserOff,
  IconChartBar,
  IconChartLine,
  IconChartArea,
} from '@tabler/icons-react';
import { ExternalLinkIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  chakra,
  Flex,
  Grid,
  GridItem,
  Heading,
  HStack,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  useColorModeValue,
} from '@chakra-ui/react';
import { Center, Select } from '@mantine/core';
import { useCustomers } from '../react-query/customers/useCustomers';
import { useARMthView } from '../react-query/armthview/useARMthView';
import { usePeriod } from '../react-query/periods/usePeriods';
import StatsCard from '../helpers/StatsCard';

const CustomersOverviewStat = () => {
  const navigate = useNavigate();
  const isFetching = useIsFetching();
  const { customers } = useCustomers();
  const { armthview, setARMthViewCustno } = useARMthView();
  const { periods } = usePeriod();
  const activestat = customers.filter(r => r.c_inactive === false);
  const inactivestat = customers.filter(r => r.c_inactive === true);
  const [selectyear, setSelectYear] = useState(dayjs().format('YYYY'));
  const yearstart = selectyear + '-01';
  const yearend = selectyear + '-12';
  const today = Date().toLocaleString();
  const mth12 = dayjs()
    .subtract(
      differenceInCalendarMonths(new Date(today), new Date(today)) + 11,
      'month'
    )
    .format('YYYY-MM');

  console.log('mth12', mth12);

  const salesytdstat = armthview
    .filter(r => r.ar_yearmonth >= yearstart && r.ar_yearmonth <= yearend)
    .reduce((acc, rec) => {
      switch (rec.ar_doctype) {
        case 'Cash':
          return acc + rec.ar_totalamt;
        case 'Invoice':
          return acc + rec.ar_totalamt;
        case 'Credit':
          return acc - rec.ar_totalamt;
        case 'Debit':
          return acc + rec.ar_totalamt;
        /*    case 'Receipt':
                return acc - rec.ar_totalamt; */
        default:
          return acc;
      }
    }, 0);

  const balduestat = armthview
    .filter(r => r.ar_yearmonth >= mth12)
    .reduce((acc, rec) => {
      switch (rec.ar_doctype) {
        case 'Cash':
          return acc + rec.ar_totalamt;
        case 'Invoice':
          return acc + rec.ar_totalamt;
        case 'Credit':
          return acc - rec.ar_totalamt;
        case 'Debit':
          return acc + rec.ar_totalamt;
        case 'Receipt':
          return acc - rec.ar_totalamt;
        default:
          return acc;
      }
    }, 0);

  const baldue12stat = armthview
    .filter(r => r.ar_yearmonth < mth12)
    .reduce((acc, rec) => {
      switch (rec.ar_doctype) {
        case 'Cash':
          return acc + rec.ar_totalamt;
        case 'Invoice':
          return acc + rec.ar_totalamt;
        case 'Credit':
          return acc - rec.ar_totalamt;
        case 'Debit':
          return acc + rec.ar_totalamt;
        case 'Receipt':
          return acc - rec.ar_totalamt;
        default:
          return acc;
      }
    }, 0);

  /* const salesytdstattmp = armthview.filter(
    r => r.ar_yearmonth >= yearstart && r.ar_yearmonth <= yearend
  );

  console.log('salesytd', salesytdstat, salesytdstattmp);
 */
  return (
    <Grid templateColumns={'repeat(12,1fr)'} columnGap={3}>
      <GridItem colSpan={12}>
        <Box
          maxW="7xl"
          mx={'auto'}
          height={400}
          pt={5}
          px={{ base: 2, sm: 12, md: 17 }}
        >
          <Center>
            <chakra.h1
              textAlign={'center'}
              fontSize={'4xl'}
              py={10}
              fontWeight={'bold'}
            >
              Customer Overviews
            </chakra.h1>

            <Select
              name="selectyear"
              value={selectyear}
              onChange={setSelectYear}
              w={200}
              h="auto"
              size={25}
              px={15}
              py={5}
              border="1px solid teal"
              fontWeight="bold"
              data={periods.map(rec => {
                return {
                  value: rec.p_period,
                  label: rec.p_period,
                };
              })}
              placeholder="Select items"
              nothingFound="None"
              searchable
            />
          </Center>

          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={{ base: 5, lg: 8 }}>
            <StatsCard
              title={'Active Customers'}
              stat={activestat.length}
              icon={<IconUser size={'3em'} />}
            />
            <StatsCard
              title={'Inactive Customers'}
              stat={inactivestat.length}
              icon={<IconUserOff size={'3em'} />}
            />
            <StatsCard
              title={`YTD Sales ${selectyear}`}
              stat={currency(salesytdstat).format()}
              icon={<IconChartBar size={'3em'} />}
            />
            <StatsCard
              title={`Outstandings within 12 months`}
              stat={currency(balduestat).format()}
              icon={<IconChartLine size={'3em'} />}
            />
            <StatsCard
              title={`Outstandings over 12 months`}
              stat={currency(baldue12stat).format()}
              icon={<IconChartArea size={'3em'} />}
            />
          </SimpleGrid>
        </Box>
      </GridItem>
    </Grid>
  );
};

export default CustomersOverviewStat;
