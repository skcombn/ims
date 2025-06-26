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

async function getPaymentsDetls() {
  const { allPaymentsDetlsByBranch } = await graphQLClient.request(
    gql`
      query getPaymentsDetls($branch: String) {
        allPaymentsDetlsByBranch(branch: $branch) {
          payd_id
          payd_no
          payd_invno
          payd_invdate
          payd_pono
          payd_podate
          payd_invamt
          payd_last_bal
          payd_disc
          payd_amt
          payd_apid
          payd_recdate
          payd_branch
          payd_paydate
        }
      }
    `,
    { branch }
  );
  return allPaymentsDetlsByBranch;
}

async function getPaymentsDetlsByPayno(payno) {
  const { allPaymentsDetlsByPayno } = await graphQLClient.request(
    gql`
      query getPaymentsDetls($payno: String, $branch: String) {
        allPaymentsDetlsByPayNo(payno: $payno, branch: $branch) {
          payd_id
          payd_no
          payd_invno
          payd_invdate
          payd_pono
          payd_podate
          payd_invamt
          payd_last_bal
          payd_disc
          payd_amt
          payd_apid
          payd_recdate
          payd_branch
          payd_paydate
        }
      }
    `,
    { payno, branch }
  );
  return allPaymentsDetlsByPayno;
}

export function usePaymentsDetls() {
  const [payno, setPayno] = useState('');

  const fallback = [];
  const { data: paymentsdetls = fallback } = useQuery({
    queryKey: [queryKeys.paymentsdetls, payno],
    queryFn: () =>
      payno ? getPaymentsDetlsByPayno(payno) : getPaymentsDetls(),
  });

  return { paymentsdetls, setPayno };
}
