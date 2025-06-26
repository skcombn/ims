import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useIsFetching } from '@tanstack/react-query';
import { BsPerson } from 'react-icons/bs';
import { FiServer } from 'react-icons/fi';
import { IconDatabase } from '@tabler/icons-react';
import { ExternalLinkIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  chakra,
  Flex,
  Grid,
  GridItem,
  Heading,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  useColorModeValue,
} from '@chakra-ui/react';
import { useSuppliers } from '../react-query/suppliers/useSuppliers';
import StatsCard from '../helpers/StatsCard';

const SuppliersOverviewStat = () => {
  const navigate = useNavigate();
  const isFetching = useIsFetching();
  const { suppliers } = useSuppliers();

  const activestat = suppliers.filter(r => r.s_inactive === false);
  const inactivestat = suppliers.filter(r => r.s_inactive === true);

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
          <chakra.h1
            textAlign={'center'}
            fontSize={'4xl'}
            py={10}
            fontWeight={'bold'}
          >
            Supplier Overviews
          </chakra.h1>
          <SimpleGrid columns={{ base: 1, md: 4 }} spacing={{ base: 5, lg: 8 }}>
            <StatsCard
              title={'Active Suppliers'}
              stat={activestat.length}
              icon={<BsPerson size={'3em'} />}
            />
            <StatsCard
              title={'Inactive Suppliers'}
              stat={inactivestat.length}
              icon={<IconDatabase size={'3em'} />}
            />
          </SimpleGrid>
        </Box>
      </GridItem>
    </Grid>
  );
};

export default SuppliersOverviewStat;
