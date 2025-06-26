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

async function getAllTranadjdetls(tranno) {
  if (tranno) {
    const { allTranadjdetlsByTranno } = await graphQLClient.request(
      gql`
        query getAllTranadjdetlsByTranno($tranno: String) {
          allTranadjdetlsByTranno(tranno: $tranno) {
            tad_id
            tad_batchno
            tad_itemno
            tad_desp
            tad_packing
            tad_qtyonhand
            tad_qtycount
            tad_qtyadjust
            tad_branch
            tad_unit
            tad_trackexpiry
          }
        }
      `,
      { tranno }
    );
    return allTranadjdetlsByTranno;
  } else {
    const { allTranadjdetls } = await graphQLClient.request(gql`
      query {
        allTranadjdetls {
          tad_id
          tad_batchno
          tad_itemno
          tad_desp
          tad_packing
          tad_qtyonhand
          tad_qtycount
          tad_qtyadjust
          tad_branch
          tad_unit
          tad_trackexpiry
        }
      }
    `);
    return allTranadjdetls;
  }
}

export function useTransadjustDetls() {
  const [tranadjdetlId, setTranAdjDetlId] = useState('');

  const fallback = [];
  const { data: tranadjustdetls = fallback } = useQuery({
    queryKey: [queryKeys.tranadjustdetls, tranadjdetlId],
    queryFn: () => getAllTranadjdetls(tranadjdetlId),
  });

  return { tranadjustdetls, setTranAdjDetlId };
}
