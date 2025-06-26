import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
//import { useQuery as useApolloQuery, useMutation } from "@apollo/react-hooks";
import { GraphQLClient, gql } from 'graphql-request';
//import { gql } from "@apollo/client";
//import { employees_url } from "../../utils/constants";

import { queryKeys } from '../constants';

const API_URL = process.env.REACT_APP_API_URL;
//const API_URL = `http://localhost:4000/graphql`;

const graphQLClient = new GraphQLClient(API_URL, {
  headers: {
    Authorization: `Bearer ${process.env.API_KEY}`,
  },
});

async function getDocStktake() {
  const { docstktake } = await graphQLClient.request(
    gql`
      query getDocStktake {
        docstktake {
          doc_id
          doc_no
          doc_abbre
        }
      }
    `
  );
  return docstktake;
}

export function useDocStktake() {
  const [filter, setFilter] = useState('all');
  const [docId, setDocId] = useState('');

  const fallback = [];
  const { data: docstktake = fallback } = useQuery({
    queryKey: [queryKeys.docstktake, docId],
    queryFn: () => getDocStktake(docId),
  });

  return { docstktake, filter, setFilter, setDocId };
}
