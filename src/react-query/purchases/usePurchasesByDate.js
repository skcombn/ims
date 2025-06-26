import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
//import { useQuery as useApolloQuery, useMutation } from "@apollo/react-hooks";
import { GraphQLClient, gql } from 'graphql-request';
//import { gql } from "@apollo/client";
//import { employees_url } from "../../utils/constants";
import { filterById } from './utils';

import axios from 'axios';
import { queryKeys } from '../constants';
import { branch } from '../../utils/constants';

const API_URL = process.env.REACT_APP_API_URL;
//const API_URL = `http://localhost:4000/graphql`;

const graphQLClient = new GraphQLClient(API_URL, {
  headers: {
    Authorization: `Bearer ${process.env.API_KEY}`,
  },
});

async function getAllPurchases() {
  const { allPurchases } = await graphQLClient.request(
    gql`
      query getAllPurchases {
        allPurchases {
          po_id
          po_no
          po_date
          po_type
          po_suppno
          po_supp
          po_add1
          po_add2
          po_add3
          po_tel
          po_term
          po_invno
          po_remark
          po_post
          po_print
          po_subtotal
          po_disc
          po_nettotal
          po_layout
          po_postdate
          po_glcode
          po_dodate
          po_invdate
          po_recdate
          po_sono
          po_createdby
          po_updby
          po_createddate
          po_createdtime
          po_upddate
          po_updtime
          po_oref
          po_yref
          po_area
          po_loc
          po_age
        }
      }
    `
  );
  return allPurchases;
}

async function getPurchasesByDate({ pofromdate, potodate }) {
  const { allPurchasesByDate } = await graphQLClient.request(
    gql`
      query getPurchasesByDate($pofromdate: Date, $potodate: Date) {
        allPurchasesByDate(pofromdate: $pofromdate, potodate: $potodate) {
          po_id
          po_no
          po_date
          po_type
          po_suppno
          po_supp
          po_add1
          po_add2
          po_add3
          po_tel
          po_term
          po_invno
          po_remark
          po_post
          po_print
          po_subtotal
          po_disc
          po_nettotal
          po_layout
          po_postdate
          po_glcode
          po_dodate
          po_invdate
          po_recdate
          po_sono
          po_createdby
          po_updby
          po_createddate
          po_createdtime
          po_upddate
          po_updtime
          po_oref
          po_yref
          po_area
          po_loc
          po_age
        }
      }
    `,
    { pofromdate, potodate }
  );
  return allPurchasesByDate;
}

export function usePurchasesByDate() {
  const [pofromdate, setPoFromDate] = useState('');
  const [potodate, setPoToDate] = useState('');

  const fallback = [];
  const { data: purchasesbydate = fallback } = useQuery({
    queryKey: [queryKeys.purchasesbydate, pofromdate, potodate],
    queryFn: () => getPurchasesByDate({ pofromdate, potodate }),
  });

  return { purchasesbydate, setPoFromDate, setPoToDate };
}
