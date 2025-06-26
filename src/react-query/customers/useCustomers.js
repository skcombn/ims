import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
//import { useQuery as useApolloQuery, useMutation } from "@apollo/react-hooks";
import { GraphQLClient, gql } from 'graphql-request';
//import { gql } from "@apollo/client";
//import { items_url } from "../constants";

import axios from 'axios';
import { queryKeys } from '../constants';

const API_URL = process.env.REACT_APP_API_URL;

const graphQLClient = new GraphQLClient(API_URL, {
  headers: {
    Authorization: `Bearer ${process.env.API_KEY}`,
  },
});

async function getCustomers() {
  const { allCustomers } = await graphQLClient.request(gql`
    query {
      allCustomers {
        c_id
        c_custno
        c_cust
        c_add1
        c_add2
        c_add3
        c_add4
        c_phone
        c_fax
        c_email
        c_crlimit
        c_terms
        c_contact
        c_post
        c_branch
        c_glcode
        c_area
        c_type
      }
    }
  `);
  return allCustomers;
}

export function useCustomers() {
  const [custId, setCustId] = useState('');

  const fallback = [];
  const { data: customers = fallback } = useQuery({
    queryKey: [queryKeys.customers, custId],
    queryFn: () => getCustomers(),
  });

  return { customers, setCustId };
}
