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

async function getAllTranDetls(tranno) {
  if (tranno) {
    const { trandetls } = await graphQLClient.request(
      gql`
        query getAllTranItems($tranno: String) {
          allTranItems(tranno: $tranno) {
            tl_id
            tl_tranno
            tl_type
            tl_itemno
            tl_qty
            tl_ucost
            tl_unit
            tl_desp
            tl_packing
            tl_pfactor
            tl_netucost
            tl_disc
            tl_amount
            tl_remark
            tl_order
            tl_branch
            tl_lotno
            tl_dateexpiry
            tl_trackexpiry
            tl_uprice
            tl_location
            tl_uoldcost
            tl_brand
            tl_trantype
            tl_post
            tl_trandate
            tl_trackserial
          }
        }
      `,
      { tranno }
    );
    return trandetls;
  } else {
    const { allTranItems } = await graphQLClient.request(gql`
      query {
        allTranItems {
          tl_id
          tl_tranno
          tl_type
          tl_itemno
          tl_qty
          tl_ucost
          tl_unit
          tl_desp
          tl_packing
          tl_pfactor
          tl_netucost
          tl_disc
          tl_amount
          tl_remark
          tl_order
          tl_branch
          tl_lotno
          tl_dateexpiry
          tl_trackexpiry
          tl_uprice
          tl_location
          tl_uoldcost
          tl_brand
          tl_trantype
          tl_post
          tl_trandate
          tl_trackserial
        }
      }
    `);
    return allTranItems;
  }
}

export function useTransDetls() {
  const [trandetlId, setTranDetlId] = useState('');

  const fallback = [];
  const { data: transdetls = fallback } = useQuery({
    queryKey: [queryKeys.transdetls, trandetlId],
    queryFn: () => getAllTranDetls(trandetlId),
  });

  return { transdetls, setTranDetlId };
}
