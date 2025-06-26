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

async function getAllReceivable() {
  const { allReceivable } = await graphQLClient.request(
    gql`
      query getAllReceivable {
        allReceivable {
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
    `
  );
  return allReceivable;
}

async function getReceivableByCustno(custno) {
  const { allReceivableByCustno } = await graphQLClient.request(
    gql`
      query getReceivable($custno: String) {
        allReceivableByCustno(custno: $custno) {
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
    { custno }
  );
  return allReceivableByCustno;
}

export function useReceivable() {
  const [arcustno, setARCustno] = useState('');

  const fallback = [];
  const { data: receivable = fallback } = useQuery({
    queryKey: [queryKeys.receivable, arcustno],
    queryFn: () =>
      arcustno ? getReceivableByCustno(arcustno) : getAllReceivable(),
  });

  return { receivable, setARCustno };
}
