import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
//import { useQuery as useApolloQuery, useMutation } from "@apollo/react-hooks";
import { GraphQLClient, gql } from 'graphql-request';
//import { gql } from "@apollo/client";
//import { employees_url } from "../../utils/constants";
import { filterById } from './utils';

import axios from 'axios';
import { queryKeys } from '../constants';

const API_URL = process.env.REACT_APP_API_URL;
//const API_URL = `http://localhost:4000/graphql`;

const graphQLClient = new GraphQLClient(API_URL, {
  headers: {
    Authorization: `Bearer ${process.env.API_KEY}`,
  },
});

async function getAllPurchasesDetls() {
  const { allPurchasesDetls } = await graphQLClient.request(
    gql`
      query getAllPurchasesDetls {
        allPurchasesDetls {
          pl_id
          pl_pono
          pl_type
          pl_itemno
          pl_desp
          pl_pack
          pl_qty
          pl_ucost
          pl_unit
          pl_pfactor
          pl_netucost
          pl_disc
          pl_excost
          pl_remark
          pl_order
          pl_uoldcost
          pl_brand
          pl_store
          pl_upd
          pl_podate
        }
      }
    `
  );
  return allPurchasesDetls;
}

async function getPurchasesDetlsByDate({ plfromdate, pltodate }) {
  const { allPurchasesDetlsByDate } = await graphQLClient.request(
    gql`
      query getPurchasesDetlsByDate($plfromdate: Date, $pltodate: Date) {
        allPurchasesDetlsByDate(plfromdate: $plfromdate, pltodate: $pltodate) {
          pl_id
          pl_pono
          pl_type
          pl_itemno
          pl_desp
          pl_pack
          pl_qty
          pl_ucost
          pl_unit
          pl_pfactor
          pl_netucost
          pl_disc
          pl_excost
          pl_remark
          pl_order
          pl_brand
          pl_store
          pl_upd
          pl_podate
        }
      }
    `,
    { plfromdate, pltodate }
  );
  return allPurchasesDetlsByDate;
}

export function usePurchasesDetlsByDate() {
  const [plfromdate, setPlFromDate] = useState();
  const [pltodate, setPlToDate] = useState();

  const fallback = [];
  const { data: purchasesdetlsbydate = fallback } = useQuery({
    queryKey: [queryKeys.purchasesdetlsbydate, plfromdate, pltodate],
    queryFn: () => getPurchasesDetlsByDate({ plfromdate, pltodate }),
  });

  return { purchasesdetlsbydate, setPlFromDate, setPlToDate };
}
