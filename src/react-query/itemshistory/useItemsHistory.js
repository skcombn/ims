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
//const API_URL = `http://192.168.0.107:4000/graphql`;

const graphQLClient = new GraphQLClient(API_URL, {
  headers: {
    Authorization: `Bearer ${process.env.API_KEY}`,
  },
});

async function getAllItemsHistory(itemno) {
  if (itemno) {
    const { allItemsHistoryByItem } = await graphQLClient.request(
      gql`
        query getAllItemsHistoryByItem($itemno: String) {
          allItemsHistoryByItem(itemno: $itemno) {
            it_id
            it_transno
            it_itemno
            it_transdate
            it_qty
            it_value
            it_disc
            it_netvalue
            it_extvalue
            it_pfactor
            it_transtype
            it_scno
            it_sc
            it_branch
            it_postdate
            it_remark
            it_desp
            it_packing
            it_lotno
          }
        }
      `,
      { itemno }
    );
    return allItemsHistoryByItem;
  } else {
    const { allItemsHistory } = await graphQLClient.request(
      gql`
        query getAllItemsHistory {
          allItemsHistory {
            it_id
            it_transno
            it_itemno
            it_transdate
            it_qty
            it_value
            it_disc
            it_netvalue
            it_extvalue
            it_pfactor
            it_transtype
            it_scno
            it_sc
            it_branch
            it_postdate
            it_remark
            it_desp
            it_packing
            it_lotno
          }
        }
      `
    );
    return allItemsHistory;
  }
}

export function useItemsHistory() {
  const [itemHistId, setItemHistId] = useState('');

  const fallback = [];
  const { data: itemshistory = fallback } = useQuery({
    queryKey: [queryKeys.itemshistory, itemHistId],
    queryFn: () => getAllItemsHistory(itemHistId),
  });

  return { itemshistory, setItemHistId };
}
