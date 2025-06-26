import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
//import { useQuery as useApolloQuery, useMutation } from "@apollo/react-hooks";
import { GraphQLClient, gql } from 'graphql-request';
//import { gql } from "@apollo/client";
//import { items_url } from "../constants";

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

async function getDocumentno(id) {
  const { documentno } = await graphQLClient.request(gql`
    query {
      documentno {
        doc_id
        doc_invoice
        doc_purchase
        doc_despatch
        doc_receipt
        doc_payment
        doc_trans
        doc_branch
        doc_stktake
        doc_stkadjust
        doc_prefix
        doc_abbre
      }
    }
  `);
  return documentno;
}

export function useDocumentNo() {
  const [docId, setDocId] = useState('');

  const fallback = [];
  const { data: documentno = fallback } = useQuery({
    queryKey: [queryKeys.documentno, docId],
    queryFn: () => getDocumentno(docId),
  });

  return { documentno, setDocId };
}
