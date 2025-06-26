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

async function getAccounts() {
  const { allAccounts } = await graphQLClient.request(gql`
    query {
      allAccounts {
        acc_id
        acc_code
        acc_name
        acc_cat
        acc_type
        acc_last_year
        acc_temp_bal
        acc_groupitem
        acc_class
      }
    }
  `);
  return allAccounts;
}

export function useAccounts() {
  const [accId, setAccId] = useState('');

  const fallback = [];
  const { data: accounts = fallback } = useQuery({
    queryKey: [queryKeys.accounts, accId],
    queryFn: () => getAccounts(),
  });

  return { accounts, setAccId };
}
