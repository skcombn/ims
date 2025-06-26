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

async function getAllSalesDetls() {
  const { allSalesDetls } = await graphQLClient.request(
    gql`
      query getAllSalesDetls {
        allSalesDetls {
          sld_id
          sld_no
          sld_itemno
          sld_desp
          sld_pack
          sld_pfactor
          sld_qty
          sld_unit
          sld_price
          sld_total
          sld_acc
          sld_order
          sld_sitemno
          sld_ucost
          sld_itemtype
          sld_error
          sld_type
          sld_brand
          sld_store
          sld_custno
          sld_ctype
          sld_tqty
          sld_upd
          sld_date
        }
      }
    `
  );
  return allSalesDetls;
}

async function getSalesDetlsByDate({ sldfromdate, sldtodate }) {
  const { allSalesDetlsByDate } = await graphQLClient.request(
    gql`
      query getSalesDetlsByDate($sldfromdate: Date, $sldtodate: Date) {
        allSalesDetlsByDate(sldfromdate: $sldfromdate, sldtodate: $sldtodate) {
          sld_id
          sld_no
          sld_itemno
          sld_desp
          sld_pack
          sld_pfactor
          sld_qty
          sld_unit
          sld_price
          sld_total
          sld_acc
          sld_order
          sld_sitemno
          sld_ucost
          sld_itemtype
          sld_error
          sld_type
          sld_brand
          sld_store
          sld_custno
          sld_ctype
          sld_tqty
          sld_upd
          sld_date
        }
      }
    `,
    { sldfromdate, sldtodate }
  );
  return allSalesDetlsByDate;
}

export function useSalesDetlsByDate() {
  const [sldfromdate, setSldFromDate] = useState('');
  const [sldtodate, setSldToDate] = useState('');

  const fallback = [];
  const { data: salesdetlsbydate = fallback } = useQuery({
    queryKey: [queryKeys.salesdetlsbydate, sldfromdate, sldtodate],
    queryFn: () => getSalesDetlsByDate({ sldfromdate, sldtodate }),
  });

  return { salesdetlsbydate, setSldFromDate, setSldToDate };
}
