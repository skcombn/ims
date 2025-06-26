import { useMutation, useQueryClient } from '@tanstack/react-query';
//import { items_url } from '../../utils/constants';
import { Toast } from '../../helpers/CustomToastify';
import { GraphQLClient, gql } from 'graphql-request';

const API_URL = process.env.REACT_APP_API_URL;
//const API_URL = `http://localhost:4000/graphql`;
const graphQLClient = new GraphQLClient(API_URL, {
  headers: {
    Authorization: `Bearer ${process.env.API_KEY}`,
  },
});

async function updateSales(data) {
  const { itemdata } = await graphQLClient.request(
    gql`
      mutation UpdateSales(
        $sls_id: ID
        $sls_no: String
        $sls_date: Date
        $sls_so: String
        $sls_remark: String
        $sls_term: Int
        $sls_duedate: Date
        $sls_custno: String
        $sls_cust: String
        $sls_add1: String
        $sls_add2: String
        $sls_add3: String
        $sls_tel: String
        $sls_subtotal: Float
        $sls_disc: Float
        $sls_freight: Float
        $sls_total: Float
        $sls_post: String
        $sls_bank: String
        $sls_check: String
        $sls_received: String
        $sls_type: String
        $sls_shipfrom: String
        $sls_shipmenttype: String
        $sls_postdate: Date
        $sls_layout: String
        $sls_glcode: String
        $sls_createdby: String
        $sls_updby: String
        $sls_createddate: Date
        $sls_createdtime: String
        $sls_upddate: Date
        $sls_updtime: String
        $sls_oref: String
        $sls_yref: String
        $sls_loc: String
        $sls_smno: String
        $sls_age: Int
        $sls_area: String
        $sls_print: Int
        $sls_agedate: Date
      ) {
        updateSales(
          sls_id: $sls_id
          sls_no: $sls_no
          sls_date: $sls_date
          sls_so: $sls_so
          sls_remark: $sls_remark
          sls_term: $sls_term
          sls_duedate: $sls_duedate
          sls_custno: $sls_custno
          sls_cust: $sls_cust
          sls_add1: $sls_add1
          sls_add2: $sls_add2
          sls_add3: $sls_add3
          sls_tel: $sls_tel
          sls_subtotal: $sls_subtotal
          sls_disc: $sls_disc
          sls_freight: $sls_freight
          sls_total: $sls_total
          sls_post: $sls_post
          sls_bank: $sls_bank
          sls_check: $sls_check
          sls_received: $sls_received
          sls_type: $sls_type
          sls_shipfrom: $sls_shipfrom
          sls_shipmenttype: $sls_shipmenttype
          sls_postdate: $sls_postdate
          sls_layout: $sls_layout
          sls_glcode: $sls_glcode
          sls_createdby: $sls_createdby
          sls_updby: $sls_updby
          sls_createddate: $sls_createddate
          sls_createdtime: $sls_createdtime
          sls_upddate: $sls_upddate
          sls_updtime: $sls_updtime
          sls_oref: $sls_oref
          sls_yref: $sls_yref
          sls_loc: $sls_loc
          sls_smno: $sls_smno
          sls_age: $sls_age
          sls_area: $sls_area
          sls_print: $sls_print
          sls_agedate: $sls_agedate
        ) {
          sls_no
        }
      }
    `,
    data
  );
  return itemdata;
}

export function useUpdateSales(data) {
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: data => updateSales(data),
    onSuccess: () => {
      Toast({
        title: 'Sales being updated!',
        status: 'success',
        customId: 'salesUpd',
      });
    },
    onError: () => {
      Toast({
        title: 'Sales Update Error! Please check your internet connection!',
        status: 'warning',
        customId: 'salesUpdErr',
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries('sales');
    },
  });

  return mutate;
}
