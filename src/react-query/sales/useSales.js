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
          sls_agedate
        }
      }
    `
  );
  return allSales;
}

async function getSalesByCustno(custno) {
  const { allSalesByCustno } = await graphQLClient.request(
    gql`
      query getSales($custno: String) {
        allSalesByCustno(custno: $custno) {
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
          sls_agedate
        }
      }
    `,
    { custno }
  );
  return allSalesByCustno;
}

export function useSales() {
  const [salescustno, setSalesCustno] = useState('');

  const fallback = [];
  const { data: sales = fallback } = useQuery({
    queryKey: [queryKeys.sales, salescustno],
    queryFn: () => (salescustno ? getSalesByCustno(salescustno) : getSales()),
  });

  return { sales, setSalesCustno };
}
