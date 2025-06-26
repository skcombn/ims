import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
//import { useQuery as useApolloQuery, useMutation } from "@apollo/react-hooks";
import { GraphQLClient, gql } from 'graphql-request';
//import { gql } from "@apollo/client";
//import { items_url } from "../constants";

import axios from 'axios';
import { queryKeys } from '../constants';

const API_URL = process.env.REACT_APP_API_URL;
//const API_URL = `http://localhost:4000/graphql`;

const graphQLClient = new GraphQLClient(API_URL, {
  headers: {
    Authorization: `Bearer ${process.env.API_KEY}`,
  },
});

async function getAllTransadjustlot(tranno) {
  if (tranno) {
    const { allTranadjlotByTranno } = await graphQLClient.request(
      gql`
        query getAllTranadjlotByTranno($tranno: String) {
          allTranadjlotByTranno(tranno: $tranno) {
            tal_id
            tal_batchno
            tal_itemno
            tal_lotno
            tal_pono
            tal_expirydate
            tal_qtyonhand
            tal_qtycount
            tal_qtyadjust
          }
        }
      `,
      { tranno }
    );
    return allTranadjlotByTranno;
  } else {
    const { allTranadjlot } = await graphQLClient.request(gql`
      query {
        allTranadjlot {
          tal_id
          tal_batchno
          tal_itemno
          tal_lotno
          tal_pono
          tal_expirydate
          tal_qtyonhand
          tal_qtycount
          tal_qtyadjust
        }
      }
    `);
    return allTranadjlot;
  }
}

export function useTransadjustLot() {
  const [tranadjlotId, setTranAdjlotId] = useState('');

  const fallback = [];
  const { data: tranadjustlot = fallback } = useQuery({
    queryKey: [queryKeys.tranadjustlot, tranadjlotId],
    queryFn: () => getAllTransadjustlot(tranadjlotId),
  });

  return { tranadjustlot, setTranAdjlotId };
}
