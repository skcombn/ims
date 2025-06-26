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
//const API_URL = `http://localhost:4000/graphql`;
//const API_URL = `http://192.168.0.107:4000/graphql`;

const graphQLClient = new GraphQLClient(API_URL, {
  headers: {
    Authorization: `Bearer ${process.env.API_KEY}`,
  },
});

async function getItemGroups(id) {
  const { allItemGroup } = await graphQLClient.request(gql`
    query {
      allItemGroup {
        group_id
        group_code
        group_desp
      }
    }
  `);
  return allItemGroup;
}

export function useItemGroups() {
  const [groupId, setGroupId] = useState('');

  const fallback = [];
  const { data: itemsgroups = fallback } = useQuery({
    queryKey: [queryKeys.itemsgroups, groupId],
    queryFn: () => getItemGroups(groupId),
  });

  return { itemsgroups, setGroupId };
}
