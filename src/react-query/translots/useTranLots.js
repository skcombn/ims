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

async function getAllTranslot(tranno) {
  if (tranno) {
    const { allTranslotByTranno } = await graphQLClient.request(
      gql`
        query getAllTranslotByTranno($tranno: String) {
          allTranslotByTranno(tranno: $tranno) {
            tl_id
            tl_tranno
            tl_type
            tl_itemno
            tl_lotno
            tl_datereceived
            tl_location
            tl_dateexpiry
            tl_pono
            tl_podate
            tl_qtyonhand
            tl_qtyreceived
            tl_ucost
            tl_post
            tl_qty
            tl_trantype
          }
        }
      `,
      { tranno }
    );
    return allTranslotByTranno;
  } else {
    const { allTranslot } = await graphQLClient.request(gql`
      query {
        allTranslot {
          tl_id
          tl_tranno
          tl_type
          tl_itemno
          tl_lotno
          tl_datereceived
          tl_location
          tl_dateexpiry
          tl_pono
          tl_podate
          tl_qtyonhand
          tl_qtyreceived
          tl_ucost
          tl_post
          tl_qty
          tl_trantype
        }
      }
    `);
    return allTranslot;
  }
}

export function useTranLots() {
  const [tranlotId, setTranLotId] = useState('');

  const fallback = [];
  const { data: translots = fallback } = useQuery({
    queryKey: [queryKeys.translots, tranlotId],
    queryFn: () => getAllTranslot(tranlotId),
  });

  return { translots, setTranLotId };
}
