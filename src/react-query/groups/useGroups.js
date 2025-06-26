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

async function getGroups(category) {
  if (category) {
    const { allGroup } = await graphQLClient.request(
      gql`
        query AllGroup($category: String) {
          allGroupsByCategory(category: $category) {
            group_id
            group_desp
            group_category
          }
        }
      `,
      { category }
    );
    return allGroup;
  } else {
    const { allGroups } = await graphQLClient.request(
      gql`
        query AllGroups {
          allGroups {
            group_id
            group_desp
            group_category
          }
        }
      `
    );
    return allGroups;
  }
}

export function useGroups() {
  const [groupId, setGroupId] = useState('');

  const fallback = [];
  const { data: groups = fallback } = useQuery({
    queryKey: [queryKeys.groups, groupId],
    queryFn: () => getGroups(groupId),
  });

  return { groups, setGroupId };
}
