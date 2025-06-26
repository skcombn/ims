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

async function getAllItemSerial(itemno) {
  if (itemno) {
    const { allItemSerialByItemno } = await graphQLClient.request(
      gql`
        query getAllItemSerialByItemno($itemno: String) {
          allItemSerialByItemno(itemno: $itemno) {
            is_id
            is_itemno
            is_pono
            is_podate
            is_serialno
            is_post
          }
        }
      `,
      { itemno }
    );
    return allItemSerialByItemno;
  } else {
    const { allItemSerial } = await graphQLClient.request(
      gql`
        query getAllItemSerial {
          allItemSerial {
            is_id
            is_itemno
            is_pono
            is_podate
            is_serialno
            is_post
          }
        }
      `
    );
    return allItemSerial;
  }
}

export function useItemsSerial() {
  const [itemserialId, setItemSerialId] = useState('');

  const fallback = [];
  const { data: itemsserial = fallback } = useQuery({
    queryKey: [queryKeys.itemsserial, itemserialId],
    queryFn: () => getAllItemSerial(itemserialId),
  });

  return { itemsserial, setItemSerialId };
}
