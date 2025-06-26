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

async function updateReceipt(data) {
  const { itemdata } = await graphQLClient.request(
    gql`
      mutation UpdateReceipt(
        $rcp_id: ID
        $rcp_no: String
        $rcp_date: Date
        $rcp_bank: String
        $rcp_refno: String
        $rcp_remark: String
        $rcp_custno: String
        $rcp_customer: String
        $rcp_total: Float
        $rcp_disc: Float
        $rcp_nettotal: Float
        $rcp_post: String
        $rcp_reptno: String
        $rcp_smno: String
        $rcp_age: Int
        $rcp_chkno: String
        $rcp_chkno2: String
        $rcp_bfbal: Float
        $rcp_balcurr: Float
        $rcp_bal30: Float
        $rcp_bal60: Float
        $rcp_bal90: Float
        $rcp_totbal: Float
        $rcp_add1: String
        $rcp_add2: String
        $rcp_add3: String
        $rcp_tel: String
        $rcp_agedate: Date
      ) {
        updateReceipt(
          rcp_id: $rcp_id
          rcp_no: $rcp_no
          rcp_date: $rcp_date
          rcp_bank: $rcp_bank
          rcp_refno: $rcp_refno
          rcp_remark: $rcp_remark
          rcp_custno: $rcp_custno
          rcp_customer: $rcp_customer
          rcp_total: $rcp_total
          rcp_disc: $rcp_disc
          rcp_nettotal: $rcp_nettotal
          rcp_post: $rcp_post
          rcp_reptno: $rcp_reptno
          rcp_smno: $rcp_smno
          rcp_age: $rcp_age
          rcp_chkno: $rcp_chkno
          rcp_chkno2: $rcp_chkno2
          rcp_bfbal: $rcp_bfbal
          rcp_balcurr: $rcp_balcurr
          rcp_bal30: $rcp_bal30
          rcp_bal60: $rcp_bal60
          rcp_bal90: $rcp_bal90
          rcp_totbal: $rcp_totbal
          rcp_add1: $rcp_add1
          rcp_add2: $rcp_add2
          rcp_add3: $rcp_add3
          rcp_tel: $rcp_tel
          rcp_agedate: $rcp_agedate
        ) {
          rcp_id
        }
      }
    `,
    data
  );
  return itemdata;
}

export function useUpdateReceipt(data) {
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: data => updateReceipt(data),
    onSuccess: () => {
      Toast({
        title: 'Receipt being updated!',
        status: 'success',
        customId: 'reptUpd',
      });
    },
    onError: () => {
      Toast({
        title: 'Receipt Update Error! Please check your internet connection!',
        status: 'warning',
        customId: 'reptUpdErr',
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries('receipts');
    },
  });

  return mutate;
}
