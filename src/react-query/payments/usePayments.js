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

async function getPayment() {
  const { allPayments } = await graphQLClient.request(
    gql`
      query getPayment {
        allPayments {
          pay_id
          pay_no
          pay_date
          pay_bank
          pay_refno
          pay_remark
          pay_suppno
          pay_supplier
          pay_total
          pay_disc
          pay_nettotal
          pay_post
          pay_glcode
          pay_glname
          pay_payno
          pay_chkno
          pay_chkno2
          pay_age
          pay_bfbal
          pay_balcurr
          pay_bal30
          pay_bal60
          pay_bal90
          pay_totbal
        }
      }
    `
  );
  return allPayments;
}

async function getPaymentBySuppno(suppno) {
  const { allPaymentsBySuppno } = await graphQLClient.request(
    gql`
      query getPayment($suppno: String) {
        allPaymentsBySuppno(suppno: $suppno) {
          pay_id
          pay_no
          pay_date
          pay_bank
          pay_refno
          pay_remark
          pay_suppno
          pay_supplier
          pay_total
          pay_disc
          pay_nettotal
          pay_post
          pay_glcode
          pay_glname
          pay_payno
          pay_chkno
          pay_chkno2
          pay_age
          pay_bfbal
          pay_balcurr
          pay_bal30
          pay_bal60
          pay_bal90
          pay_totbal
        }
      }
    `,
    { suppno }
  );
  return allPaymentsBySuppno;
}

export function usePayments() {
  const [paysuppno, setPaySuppno] = useState('');

  const fallback = [];
  const { data: payments = fallback } = useQuery({
    queryKey: [queryKeys.payments, paysuppno],
    queryFn: () => (paysuppno ? getPaymentBySuppno(paysuppno) : getPayment()),
  });

  return { payments, setPaySuppno };
}
