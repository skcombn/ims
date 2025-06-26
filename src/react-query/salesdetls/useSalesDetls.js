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

async function getSalesDetlsByInvno(invno) {
  const { allSalesDetlsByInvno } = await graphQLClient.request(
    gql`
      query getSalesDetlsByInvno($invno: String) {
        allSalesDetlsByInvno(invno: $invno) {
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
    { invno }
  );
  return allSalesDetlsByInvno;
}

export function useSalesDetls() {
  const [salesinvno, setSalesInvno] = useState('');

  const fallback = [];
  const { data: salesdetls = fallback } = useQuery({
    queryKey: [queryKeys.salesdetls, salesinvno],
    queryFn: () =>
      salesinvno ? getSalesDetlsByInvno(salesinvno) : getAllSalesDetls(),
  });

  return { salesdetls, setSalesInvno };
}
