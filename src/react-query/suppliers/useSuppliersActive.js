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

async function getSuppliersActive() {
  const { allSuppliersActive } = await graphQLClient.request(gql`
    query {
      allSuppliersActive {
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
  return allSuppliersActive;
}

export function useSuppliersActive() {
  const [suppactiveId, setSuppActiveId] = useState('');

  const fallback = [];
  const { data: suppliersactive = fallback } = useQuery({
    queryKey: [queryKeys.suppliersactive, suppactiveId],
    queryFn: () => getSuppliersActive(),
  });

  return { suppliersactive, setSuppActiveId };
}
