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

async function getAllItems(id) {
  const { allItems } = await graphQLClient.request(gql`
    query {
      allItems {
        item_id
        item_no
        item_desp
        item_pack
        item_unit
        item_price
        item_cost
        item_qtyonhand
        item_minlvl
        item_pfactor
        item_brand
        item_manufacturer
        item_lotno
        item_grade
        item_location
        item_size
        item_suppno
        item_supplier
        item_type
        item_trackexpiry
        item_trackserial
        item_remark
        item_productno
        item_inactive
        item_cat
      }
    }
  `);
  return allItems;
}

export function useItems() {
  const [itemId, setItemId] = useState('');

  const fallback = [];
  const { data: items = fallback } = useQuery({
    queryKey: [queryKeys.items, itemId],
    queryFn: () => getAllItems(itemId),
  });

  return { items, setItemId };
}
