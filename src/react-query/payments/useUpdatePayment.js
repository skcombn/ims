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

async function updatePayment(data) {
  const { itemdata } = await graphQLClient.request(
    gql`
      mutation UpdatePayment(
        $pay_id: ID
        $pay_no: String
        $pay_date: Date
        $pay_bank: String
        $pay_refno: String
        $pay_remark: String
        $pay_suppno: String
        $pay_supplier: String
        $pay_total: Float
        $pay_disc: Float
        $pay_nettotal: Float
        $pay_post: String
        $pay_glcode: String
        $pay_glname: String
        $pay_payno: String
        $pay_chkno: String
        $pay_chkno2: String
        $pay_age: Int
        $pay_bfbal: Float
        $pay_balcurr: Float
        $pay_bal30: Float
        $pay_bal60: Float
        $pay_bal90: Float
        $pay_totbal: Float
      ) {
        updatePayment(
          pay_id: $pay_id
          pay_no: $pay_no
          pay_date: $pay_date
          pay_bank: $pay_bank
          pay_refno: $pay_refno
          pay_remark: $pay_remark
          pay_suppno: $pay_suppno
          pay_supplier: $pay_supplier
          pay_total: $pay_total
          pay_disc: $pay_disc
          pay_nettotal: $pay_nettotal
          pay_post: $pay_post
          pay_glcode: $pay_glcode
          pay_glname: $pay_glname
          pay_payno: $pay_payno
          pay_chkno: $pay_chkno
          pay_chkno2: $pay_chkno2
          pay_age: $pay_age
          pay_bfbal: $pay_bfbal
          pay_balcurr: $pay_balcurr
          pay_bal30: $pay_bal30
          pay_bal60: $pay_bal60
          pay_bal90: $pay_bal90
          pay_totbal: $pay_totbal
        ) {
          pay_id
        }
      }
    `,
    data
  );
  return itemdata;
}

export function useUpdatePayment(data) {
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: data => updatePayment(data),
    onSuccess: () => {
      Toast({
        title: 'Payment being updated!',
        status: 'success',
        customId: 'payUpd',
      });
    },
    onError: () => {
      Toast({
        title: 'Payment Update Error! Please check your internet connection!',
        status: 'warning',
        customId: 'payUpdErr',
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries('payments');
    },
  });

  return mutate;
}
