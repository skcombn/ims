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

async function getAllTranSerial(tranno) {
  if (tranno) {
    const { allTranserialByTranno } = await graphQLClient.request(
      gql`
        query getAllTranserialByTranno($tranno: String) {
          allTranserialByTranno(tranno: $tranno) {
            ts_id
            ts_tranno
            ts_serialno
            ts_pono
            ts_invno
            ts_podate
            ts_invdate
            ts_post
            ts_trantype
          }
        }
      `,
      { tranno }
    );
    return allTranserialByTranno;
  } else {
    const { allTranserial } = await graphQLClient.request(gql`
      query {
        allTranserial {
          ts_id
          ts_tranno
          ts_serialno
          ts_pono
          ts_invno
          ts_podate
          ts_invdate
          ts_post
          ts_trantype
        }
      }
    `);
    return allTranserial;
  }
}

export function useTranSerial() {
  const [transerialId, setTranSerialId] = useState('');

  const fallback = [];
  const { data: transserial = fallback } = useQuery({
    queryKey: [queryKeys.transserial, transerialId],
    queryFn: () => getAllTranSerial(transerialId),
  });

  return { transserial, setTranSerialId };
}
