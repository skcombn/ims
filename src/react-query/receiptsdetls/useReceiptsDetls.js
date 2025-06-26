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

async function getAllReceiptsDetls() {
  const { allReceiptsDetls } = await graphQLClient.request(
    gql`
      query getReceiptsDetls {
        allReceiptsDetls {
          rcpd_id
          rcpd_no
          rcpd_invno
          rcpd_invdate
          rcpd_invamt
          rcpd_last_bal
          rcpd_disc
          rcpd_amt
          rcpd_arid
          rcpd_recdate
        }
      }
    `,
    { branch }
  );
  return allReceiptsDetls;
}

async function getReceiptsDetlsByReptno(reptno) {
  const { allReceiptsDetlsByReptNo } = await graphQLClient.request(
    gql`
      query getReceiptsDetls($reptno: String) {
        allReceiptsDetlsByReptNo(reptno: $reptno) {
          rcpd_id
          rcpd_no
          rcpd_invno
          rcpd_invdate
          rcpd_invamt
          rcpd_last_bal
          rcpd_disc
          rcpd_amt
          rcpd_arid
        }
      }
    `,
    { reptno }
  );
  return allReceiptsDetlsByReptNo;
}

export function useReceiptsDetls() {
  const [reptno, setReptno] = useState('');

  const fallback = [];
  const { data: receiptsdetls = fallback } = useQuery({
    queryKey: [queryKeys.receiptsdetls, reptno],
    queryFn: () =>
      reptno ? getReceiptsDetlsByReptno(reptno) : getAllReceiptsDetls(),
  });

  return { receiptsdetls, setReptno };
}
