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

async function getAllTransadjust(tranno) {
  if (tranno) {
    const { allTranadjByTranno } = await graphQLClient.request(
      gql`
        query getAllTranadjByTranno($tranno: String) {
          allTranadjByTranno(tranno: $tranno) {
            ta_id
            ta_batchno
            ta_date
            ta_userid
            ta_remark
            ta_post
            ta_branch
            ta_type
            ta_user
          }
        }
      `,
      { tranno }
    );
    return allTranadjByTranno;
  } else {
    const { allTranadj } = await graphQLClient.request(gql`
      query {
        allTranadj {
          ta_id
          ta_batchno
          ta_date
          ta_userid
          ta_remark
          ta_post
          ta_branch
          ta_type
          ta_user
        }
      }
    `);
    return allTranadj;
  }
}

export function useTransadjust() {
  const [tranadjId, setTranAdjId] = useState('');

  const fallback = [];
  const { data: tranadjust = fallback } = useQuery({
    queryKey: [queryKeys.tranadjust, tranadjId],
    queryFn: () => getAllTransadjust(tranadjId),
  });

  return { tranadjust, setTranAdjId };
}
