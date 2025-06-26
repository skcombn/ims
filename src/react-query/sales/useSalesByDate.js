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

async function getSales() {
  const { allSales } = await graphQLClient.request(
    gql`
      query getSales {
        allSales {
          sls_id
          sls_no
          sls_date
          sls_so
          sls_remark
          sls_term
          sls_duedate
          sls_custno
          sls_cust
          sls_add1
          sls_add2
          sls_add3
          sls_tel
          sls_subtotal
          sls_disc
          sls_freight
          sls_total
          sls_post
          sls_bank
          sls_check
          sls_received
          sls_type
          sls_shipfrom
          sls_shipmenttype
          sls_postdate
          sls_layout
          sls_glcode
          sls_createdby
          sls_updby
          sls_createddate
          sls_createdtime
          sls_upddate
          sls_updtime
          sls_oref
          sls_yref
          sls_loc
          sls_smno
          sls_age
          sls_area
          sls_print
        }
      }
    `
  );
  return allSales;
}

async function getSalesByDate({ slsfromdate, slstodate }) {
  const { allSalesByDate } = await graphQLClient.request(
    gql`
      query getSalesByDate($slsfromdate: Date, $slstodate: Date) {
        allSalesByDate(slsfromdate: $slsfromdate, slstodate: $slstodate) {
          sls_id
          sls_no
          sls_date
          sls_so
          sls_remark
          sls_term
          sls_duedate
          sls_custno
          sls_cust
          sls_add1
          sls_add2
          sls_add3
          sls_tel
          sls_subtotal
          sls_disc
          sls_freight
          sls_total
          sls_post
          sls_bank
          sls_check
          sls_received
          sls_type
          sls_shipfrom
          sls_shipmenttype
          sls_postdate
          sls_layout
          sls_glcode
          sls_createdby
          sls_updby
          sls_createddate
          sls_createdtime
          sls_upddate
          sls_updtime
          sls_oref
          sls_yref
          sls_loc
          sls_smno
          sls_age
          sls_area
          sls_print
        }
      }
    `,
    { slsfromdate, slstodate }
  );
  return allSalesByDate;
}

export function useSalesByDate() {
  const [slsfromdate, setSlsFromDate] = useState('');
  const [slstodate, setSlsToDate] = useState('');

  const fallback = [];
  const { data: salesbydate = fallback } = useQuery({
    queryKey: [queryKeys.salesbydate, slsfromdate, slstodate],
    queryFn: () => getSalesByDate({ slsfromdate, slstodate }),
  });

  return { salesbydate, setSlsFromDate, setSlsToDate };
}
