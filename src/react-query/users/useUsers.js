import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
//import { useQuery as useApolloQuery, useMutation } from "@apollo/react-hooks";
import { GraphQLClient, gql } from 'graphql-request';
//import { gql } from "@apollo/client";
//import { employees_url } from "../../utils/constants";
import { filterById } from './utils';

import axios from 'axios';
import { queryKeys } from '../constants';

const API_URL = process.env.REACT_APP_API_URL;
//const API_URL = `http://localhost:4000/graphql`;

const graphQLClient = new GraphQLClient(API_URL, {
  headers: {
    Authorization: `Bearer ${process.env.API_KEY}`,
  },
});

async function getUsers() {
  const { allUsers } = await graphQLClient.request(gql`
    query {
      allUsers {
        u_id
        u_userid
        u_name
        u_email
        u_password
        u_lastlogindate
        u_level
        u_usergroup
        u_jobtitle
      }
    }
  `);
  return allUsers;
}

export function useUsers() {
  const [userId, setUserId] = useState('');

  const fallback = [];
  const { data: users = fallback } = useQuery({
    queryKey: [queryKeys.users, userId],
    queryFn: () => getUsers(),
  });

  return { users, setUserId };
}
