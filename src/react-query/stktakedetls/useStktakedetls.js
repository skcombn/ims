import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
//import { useQuery as useApolloQuery, useMutation } from "@apollo/react-hooks";
import { GraphQLClient, gql } from 'graphql-request';
//import { gql } from "@apollo/client";
//import { employees_url } from "../../utils/constants";
import { filterById } from './utils';
import { branch } from '../../utils/constants';

import axios from 'axios';
import { queryKeys } from '../constants';

const API_URL = process.env.REACT_APP_API_URL || '';
//const API_URL = `http://192.168.0.107:4000/graphql`;

const graphQLClient = new GraphQLClient(API_URL);

async function getStktakedetls(batchno) {
  if (batchno) {
    const { allStktakeDetlsByBatchno } = await graphQLClient.request(
      gql`
        query Stktakedetls($batchno: String) {
          allStktakeDetlsByBatchno(batchno: $batchno) {
            std_id
            std_batchno
            std_itemno
            std_desp
            std_packing
            std_qty
            std_price
          }
        }
      `,
      { batchno }
    );
    return allStktakeDetlsByBatchno;
  } else {
    const { allStktakeDetls } = await graphQLClient.request(
      gql`
        query AllStktakedetls {
          allStktakeDetls {
            std_id
            std_batchno
            std_itemno
            std_desp
            std_packing
            std_qty
            std_price
          }
        }
      `
    );
    return allStktakeDetls;
  }
}

export function useStktakedetls() {
  const [filter, setFilter] = useState('all');
  const [batchdetlsId, setBatchDetlsId] = useState('');

  const selectFn = useCallback(
    unfiltered => filterById(unfiltered, filter),
    [filter]
  );

  const fallback = [];
  const { data: stktakedetls = fallback } = useQuery({
    queryKey: [queryKeys.stktakedetls, batchdetlsId],
    queryFn: () => getStktakedetls(batchdetlsId),
  });

  return { stktakedetls, setBatchDetlsId };
}
