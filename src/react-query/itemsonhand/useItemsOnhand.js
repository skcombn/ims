import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
//import { useQuery as useApolloQuery, useMutation } from "@apollo/react-hooks";
import { GraphQLClient, gql } from 'graphql-request';
//import { gql } from "@apollo/client";
//import { employees_url } from "../../utils/constants";
import { filterByItemId } from './utils';

import axios from 'axios';
import { queryKeys } from '../constants';

const API_URL = process.env.REACT_APP_API_URL;
//const API_URL = `http://192.168.0.107:4000/graphql`;

const graphQLClient = new GraphQLClient(API_URL, {
  headers: {
    Authorization: `Bearer ${process.env.API_KEY}`,
  },
});

async function getItemsOnhand() {
  const { allItemsOnhand } = await graphQLClient.request(gql`
    query {
      allItemsOnhand {
        item_id
        item_no
        item_branch
        item_qoh_pc
        item_qoh_ctn
        item_ucost_pc
        item_ucost_ctn
        item_onorder_pc
        item_onorder_ctn
        item_uprice_pc
        item_uprice_ctn
        item_remark
        item_pfactor
        item_outlet_pc
        item_outlet_ctn
        item_offeruprice
        item_cooluprice
        item_minlvlqty
        item_suppno
        item_supplier
        item_openqty
        item_openamt
        item_updated
        item_lastsalesdate
        item_lastpodate
        item_lastpoqty
        item_lastsalesqty
        item_inactive
        item_olducost
        item_memuprice
        item_allowposaddon
      }
    }
  `);
  return allItemsOnhand;
}

export function useItemsOnhand() {
  const [itemonhandId, setItemonhandId] = useState('');

  const fallback = [];
  const { data: itemsonhand = fallback } = useQuery({
    queryKey: [queryKeys.itemsonhand, itemonhandId],
    queryFn: () => getItemsOnhand(),
  });

  return { itemsonhand, setItemonhandId };
}
