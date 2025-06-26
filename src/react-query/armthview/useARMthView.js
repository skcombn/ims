import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
//import { useQuery as useApolloQuery, useMutation } from "@apollo/react-hooks";
import { GraphQLClient, gql } from 'graphql-request';
//import { gql } from "@apollo/client";
//import { employees_url } from "../../utils/constants";
import axios from 'axios';
import { queryKeys } from '../constants';
import { branch } from '../../utils/constants';

const API_URL = process.env.REACT_APP_API_URL;
//const API_URL = `http://localhost:4000/graphql`;
//const API_URL = `http://192.168.0.107:4000/graphql`;

const graphQLClient = new GraphQLClient(API_URL, {
  headers: {
    Authorization: `Bearer ${process.env.API_KEY}`,
  },
});

async function getAllARMthView() {
  const { allARMthView } = await graphQLClient.request(
    gql`
      query getAllARMthView {
        allARMthView {
          ar_custno
          ar_yearmonth
          ar_doctype
          ar_totalamt
        }
      }
    `
  );
  return allARMthView;
}

async function getAllARMthViewByCustno(custno) {
  const { allARMthViewByCustno } = await graphQLClient.request(
    gql`
      query getAllARMthViewByCustno($custno: String) {
        allARMthViewByCustno(custno: $custno) {
          ar_custno
          ar_yearmonth
          ar_doctype
          ar_totalamt
        }
      }
    `,
    { custno }
  );
  return allARMthViewByCustno;
}

export function useARMthView() {
  const [armthviewcustno, setARMthViewCustno] = useState('');

  const fallback = [];
  const { data: armthview = fallback } = useQuery({
    queryKey: [queryKeys.armthview, armthviewcustno],
    queryFn: () =>
      armthviewcustno
        ? getAllARMthViewByCustno(armthviewcustno)
        : getAllARMthView(),
  });

  return { armthview, setARMthViewCustno };
}
