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

const graphQLClient = new GraphQLClient(API_URL, {
  headers: {
    Authorization: `Bearer ${process.env.API_KEY}`,
  },
});

async function getAllTrans(tranno) {
  if (tranno) {
    const { trans } = await graphQLClient.request(
      gql`
        query getTran($tranno: String) {
          trans(tranno: $tranno) {
            t_id
            t_no
            t_date
            t_type
            t_docno
            t_docdate
            t_scno
            t_sc
            t_add1
            t_add2
            t_add3
            t_add4
            t_term
            t_branch
            t_remark
            t_post
            t_print
            t_subtotal
            t_disc
            t_nettotal
            t_layout
            t_postdate
            t_glcode
            t_recdate
            t_createdby
            t_updby
            t_createddate
            t_createdtime
            t_upddate
            t_updtime
            t_dono
            t_name
            t_section
            t_dodate
          }
        }
      `,
      { tranno }
    );
    return trans;
  } else {
    const { allTrans } = await graphQLClient.request(gql`
      query {
        allTrans {
          t_id
          t_no
          t_date
          t_type
          t_docno
          t_docdate
          t_scno
          t_sc
          t_add1
          t_add2
          t_add3
          t_add4
          t_term
          t_branch
          t_remark
          t_post
          t_print
          t_subtotal
          t_disc
          t_nettotal
          t_layout
          t_postdate
          t_glcode
          t_recdate
          t_createdby
          t_updby
          t_createddate
          t_createdtime
          t_upddate
          t_updtime
          t_dono
          t_name
          t_section
          t_dodate
        }
      }
    `);
    return allTrans;
  }
}

export function useTrans() {
  const [tranId, setTranId] = useState('');

  const fallback = [];
  const { data: transactions = fallback } = useQuery({
    queryKey: [queryKeys.transactions, tranId],
    queryFn: () => getAllTrans(tranId),
  });

  return { transactions, setTranId };
}
