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

async function getAllItemExpiry(itemno) {
  if (itemno) {
    const { allItemExpiryByItemno } = await graphQLClient.request(
      gql`
        query getAllItemExpiryByItemno($itemno: String) {
          allItemExpiryByItemno(itemno: $itemno) {
            ie_id
            ie_itemno
            ie_lotno
            ie_datereceived
            ie_location
            ie_dateexpiry
            ie_pono
            ie_podate
            ie_qtyonhand
            ie_qtyreceived
            ie_ucost
            ie_post
          }
        }
      `,
      { itemno }
    );
    return allItemExpiryByItemno;
  } else {
    const { allItemExpiry } = await graphQLClient.request(
      gql`
        query getAllItemExpiry {
          allItemExpiry {
            ie_id
            ie_itemno
            ie_lotno
            ie_datereceived
            ie_location
            ie_dateexpiry
            ie_pono
            ie_podate
            ie_qtyonhand
            ie_qtyreceived
            ie_ucost
            ie_post
          }
        }
      `
    );
    return allItemExpiry;
  }
}

export function useItemsExpiry() {
  const [itemexpId, setItemExpId] = useState('');

  const fallback = [];
  const { data: itemsexpiry = fallback } = useQuery({
    queryKey: [queryKeys.itemsexpiry, itemexpId],
    queryFn: () => getAllItemExpiry(itemexpId),
  });

  return { itemsexpiry, setItemExpId };
}
