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

async function getAllAPMthView() {
  const { allAPMthView } = await graphQLClient.request(
    gql`
      query getAllAPMthView {
        allAPMthView {
          ap_suppno
          ap_yearmonth
          ap_doctype
          ap_totalamt
        }
      }
    `
  );
  return allAPMthView;
}

async function getAllAPMthViewBySuppno(suppno) {
  const { allAPMthViewBySuppno } = await graphQLClient.request(
    gql`
      query getAllAPMthViewBySuppno($suppno: String) {
        allAPMthViewBySuppno(suppno: $suppno) {
          ap_suppno
          ap_yearmonth
          ap_doctype
          ap_totalamt
        }
      }
    `,
    { suppno }
  );
  return allAPMthViewBySuppno;
}

export function useAPMthView() {
  const [apmthviewsuppno, setAPMthViewSuppno] = useState('');

  const fallback = [];
  const { data: apmthview = fallback } = useQuery({
    queryKey: [queryKeys.apmthview, apmthviewsuppno],
    queryFn: () =>
      apmthviewsuppno
        ? getAllAPMthViewBySuppno(apmthviewsuppno)
        : getAllAPMthView(),
  });

  return { apmthview, setAPMthViewSuppno };
}
