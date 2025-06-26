import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
//import { useQuery as useApolloQuery, useMutation } from "@apollo/react-hooks";
import { GraphQLClient, gql } from 'graphql-request';
//import { gql } from "@apollo/client";
//import { employees_url } from "../../utils/constants";
import { filterById } from './utils';
import { branch } from '../../utils/constants';

import axios from 'axios';
import { queryKeys } from '../constants';

const API_URL = process.env.REACT_APP_API_URL;
//const API_URL = `http://localhost:4000/graphql`;

const graphQLClient = new GraphQLClient(API_URL, {
  headers: {
    Authorization: `Bearer ${process.env.API_KEY}`,
  },
});

async function getAllReceipts() {
  const { allReceipts } = await graphQLClient.request(
    gql`
      query getAllReceipts {
        allReceipts {
          rcp_id
          rcp_no
          rcp_date
          rcp_bank
          rcp_refno
          rcp_remark
          rcp_custno
          rcp_customer
          rcp_total
          rcp_disc
          rcp_nettotal
          rcp_post
          rcp_reptno
          rcp_smno
          rcp_age
          rcp_chkno
          rcp_chkno2
          rcp_bfbal
          rcp_balcurr
          rcp_bal30
          rcp_bal60
          rcp_bal90
          rcp_totbal
          rcp_add1
          rcp_add2
          rcp_add3
          rcp_tel
          rcp_agedate
        }
      }
    `
  );
  return allReceipts;
}

async function getReceiptsByCustno(custno) {
  const { allReceiptsByCustno } = await graphQLClient.request(
    gql`
      query getReceipts($custno: String) {
        allReceiptsByCustno(custno: $custno) {
          rcp_id
          rcp_no
          rcp_date
          rcp_bank
          rcp_refno
          rcp_remark
          rcp_custno
          rcp_customer
          rcp_total
          rcp_disc
          rcp_nettotal
          rcp_post
          rcp_reptno
          rcp_smno
          rcp_age
          rcp_chkno
          rcp_chkno2
          rcp_bfbal
          rcp_balcurr
          rcp_bal30
          rcp_bal60
          rcp_bal90
          rcp_totbal
          rcp_add1
          rcp_add2
          rcp_add3
          rcp_tel
          rcp_agedate
        }
      }
    `,
    { custno }
  );
  return allReceiptsByCustno;
}

export function useReceipts() {
  const [rcpcustno, setRcpCustno] = useState('');

  const fallback = [];
  const { data: receipts = fallback } = useQuery({
    queryKey: [queryKeys.receipts, rcpcustno],
    queryFn: () =>
      rcpcustno ? getReceiptsByCustno(rcpcustno) : getAllReceipts(),
  });

  return { receipts, setRcpCustno };
}
