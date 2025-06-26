import React from "react";
import { useNavigate } from "react-router-dom";
import { useIsFetching } from "@tanstack/react-query";
import { BsPerson } from "react-icons/bs";
import { FiServer } from "react-icons/fi";
import {
  IconClipboardCopy,
  IconClipboardOff,
  IconClipboardList,
  IconClipboardCheck,
  IconClipboardPlus,
} from "@tabler/icons-react";
import { ExternalLinkIcon } from "@chakra-ui/icons";
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
} from "@chakra-ui/react";
import { useItems } from "../react-query/items/useItems";
import StatsCard from "../helpers/StatsCard";

const ItemsOverviewStat = () => {
  const navigate = useNavigate();
  const isFetching = useIsFetching();
  const { items } = useItems();

  const activestat = items.filter((r) => r.item_inactive !== true);
  const inactivestat = items.filter((r) => r.item_inactive === true);
  const belowminlvlstat = items.filter(
    (r) => r.item_inactive !== true && r.item_qtyonhand < r.item_minlvlqty
  );
  const outofstockstat = items
    .filter((r) => r.item_inactive !== true)
    .reduce((count, rec) => {
      const qty = rec.item_qtyonhand;
      if (qty <= 0) {
        count = count + 1;
      }
      return count;
    }, 0);

  return (
    <Grid templateColumns={"repeat(12,1fr)"} columnGap={3}>
      <GridItem colSpan={12}>
        <Box
          maxW="7xl"
          mx={"auto"}
          height={400}
          pt={5}
          px={{ base: 2, sm: 12, md: 17 }}
        >
          <chakra.h1
            textAlign={"center"}
            fontSize={"4xl"}
            py={10}
            fontWeight={"bold"}
          >
            Items Overviews
          </chakra.h1>
          <SimpleGrid columns={{ base: 1, md: 4 }} spacing={{ base: 5, lg: 8 }}>
            <StatsCard
              title={"Active Items"}
              stat={activestat.length}
              icon={<IconClipboardList size={"3em"} />}
            />
            <StatsCard
              title={"Inactive Items"}
              stat={inactivestat.length}
              icon={<IconClipboardOff size={"3em"} />}
            />
            <StatsCard
              title={"Items Below MinLvl"}
              stat={belowminlvlstat.length}
              icon={<IconClipboardCheck size={"3em"} />}
            />
            <StatsCard
              title={"Out of Stock"}
              stat={outofstockstat}
              icon={<IconClipboardPlus size={"3em"} />}
            />
          </SimpleGrid>
        </Box>
      </GridItem>
    </Grid>
  );
};

export default ItemsOverviewStat;
