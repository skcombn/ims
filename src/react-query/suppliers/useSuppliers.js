import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
//import { useQuery as useApolloQuery, useMutation } from "@apollo/react-hooks";
import { GraphQLClient, gql } from 'graphql-request';
//import { gql } from "@apollo/client";
//import { employees_url } from "../../utils/constants";

import axios from 'axios';
import { queryKeys } from '../constants';

const API_URL = process.env.REACT_APP_API_URL;
//const API_URL = `http://localhost:4000/graphql`;

const graphQLClient = new GraphQLClient(API_URL, {
  headers: {
    Authorization: `Bearer ${process.env.API_KEY}`,
  },
});

async function getSuppliers() {
  const { allSuppliers } = await graphQLClient.request(gql`
    query {
      allSuppliers {
        s_id
        s_suppno
        s_supp
        s_add1
        s_add2
        s_add3
        s_add4
        s_phone
        s_fax
        s_email
        s_contact
        s_crlimit
        s_terms
        s_glcode
        s_branch
        s_bankname
        s_bankacno
      }
    }
  `);
  return allSuppliers;
}

export function useSuppliers() {
  const [suppId, setSuppId] = useState('');

  const fallback = [];
  const { data: suppliers = fallback } = useQuery({
    queryKey: [queryKeys.suppliers, suppId],
    queryFn: () => getSuppliers(),
  });

  return { suppliers, setSuppId };
}
