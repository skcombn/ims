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

const API_URL = process.env.REACT_APP_API_URL;
//const API_URL = `http://192.168.0.107:4000/graphql`;

const graphQLClient = new GraphQLClient(API_URL);

async function getStktake() {
  const { allStktake } = await graphQLClient.request(
    gql`
      query AllStktake {
        allStktake {
          st_id
          st_batchno
          st_date
          st_time
          st_remark
          st_userid
          st_user
          st_post
        }
      }
    `
  );
  return allStktake;
}

export function useStktake() {
  const [filter, setFilter] = useState('all');
  const [batchid, setBatchId] = useState('');

  const selectFn = useCallback(
    unfiltered => filterById(unfiltered, filter),
    [filter]
  );

  const fallback = [];
  const { data: stktake = fallback } = useQuery({
    queryKey: [queryKeys.stktake, batchid],
    queryFn: () => getStktake(batchid),
  });

  return { stktake, filter, setFilter, setBatchId };
}
