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

/* async function getAllReceivableByMonth() {
  const { allReceivableByMonth } = await graphQLClient.request(
    gql`
      query getAllReceivableByMonth {
        allReceivableByMonth {
          ar_id
          ar_invno
          ar_date
          ar_custno
          ar_cust
          ar_type
          ar_subtotal
          ar_paid_amt
          ar_disc_amt
          ar_disc_taken
          ar_balance
          ar_total
          ar_paid
          ar_glcode
          ar_paid_disc
          ar_refno
          ar_smno
          ar_loc
          ar_age
          ar_print
          ar_doctype
          ar_docno
          ar_purge
          ar_bfbal
        }
      }
    `
  );
  return allReceivableByMonth;
} */

async function getAllReceivableByMonth(period) {
  const { allReceivableByMonth } = await graphQLClient.request(
    gql`
      query getAllReceivableByMonth($period: String) {
        allReceivableByMonth(period: $period) {
          ar_id
          ar_invno
          ar_date
          ar_custno
          ar_cust
          ar_type
          ar_subtotal
          ar_paid_amt
          ar_disc_amt
          ar_disc_taken
          ar_balance
          ar_total
          ar_paid
          ar_glcode
          ar_paid_disc
          ar_refno
          ar_smno
          ar_loc
          ar_age
          ar_print
          ar_doctype
          ar_docno
          ar_purge
          ar_bfbal
          ar_agedate
        }
      }
    `,
    { period }
  );
  return allReceivableByMonth;
}

export function useReceivableByMth() {
  const [arperiod, setARPeriod] = useState('');

  const fallback = [];
  const { data: receivablebymth = fallback } = useQuery({
    queryKey: [queryKeys.receivablebymth, arperiod],
    queryFn: () => getAllReceivableByMonth(arperiod),
  });

  return { receivablebymth, setARPeriod };
}
