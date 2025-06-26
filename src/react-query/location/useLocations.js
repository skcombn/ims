import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
//import { useQuery as useApolloQuery, useMutation } from "@apollo/react-hooks";
import { GraphQLClient, gql } from 'graphql-request';
//import { gql } from "@apollo/client";
//import { employees_url } from "../../utils/constants";
import { filterByItemId } from './utils';

import axios from 'axios';
import { queryKeys } from '../constants';

const API_URL = `http://localhost:4000/graphql`;
//const API_URL = `http://192.168.0.107:4000/graphql`;

const graphQLClient = new GraphQLClient(API_URL, {
  headers: {
    Authorization: `Bearer ${process.env.API_KEY}`,
  },
});

async function getLocations() {
  const { allLocations } = await graphQLClient.request(gql`
    query {
      allLocations {
        loc_id
        loc_desp
      }
    }
  `);
  return allLocations;
}

export function useLocations() {
  const [locId, setLocId] = useState('');

  const fallback = [];
  const { data: locations = fallback } = useQuery({
    queryKey: [queryKeys.locations, locId],
    queryFn: () => getLocations(),
  });

  return { locations, setLocId };
}
