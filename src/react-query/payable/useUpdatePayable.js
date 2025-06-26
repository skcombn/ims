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

async function updatePayable(data) {
  const { itemdata } = await graphQLClient.request(
    gql`
      mutation UpdatePayable(
        $ap_id: ID
        $ap_pono: String
        $ap_podate: Date
        $ap_invno: String
        $ap_invdate: Date
        $ap_recdate: Date
        $ap_suppno: String
        $ap_supplier: String
        $ap_type: String
        $ap_subtotal: Float
        $ap_nettotal: Float
        $ap_paid_amt: Float
        $ap_disc_amt: Float
        $ap_disc_taken: Float
        $ap_dc: String
        $ap_acc: String
        $ap_paid: Boolean
        $ap_balance: Float
        $ap_glcode: String
        $ap_paid_disc: Float
        $ap_refno: String
        $ap_loc: String
        $ap_smno: String
        $ap_age: Int
        $ap_purge: Boolean
        $ap_doctype: String
        $ap_docno: String
        $ap_docref: String
        $ap_disc_acc: String
        $ap_bfbal: Float
      ) {
        updatePayable(
          ap_id: $ap_id
          ap_pono: $ap_pono
          ap_podate: $ap_podate
          ap_invno: $ap_invno
          ap_invdate: $ap_invdate
          ap_recdate: $ap_recdate
          ap_suppno: $ap_suppno
          ap_supplier: $ap_supplier
          ap_type: $ap_type
          ap_subtotal: $ap_subtotal
          ap_nettotal: $ap_nettotal
          ap_paid_amt: $ap_paid_amt
          ap_disc_amt: $ap_disc_amt
          ap_disc_taken: $ap_disc_taken
          ap_dc: $ap_dc
          ap_acc: $ap_acc
          ap_paid: $ap_paid
          ap_balance: $ap_balance
          ap_glcode: $ap_glcode
          ap_paid_disc: $ap_paid_disc
          ap_refno: $ap_refno
          ap_loc: $ap_loc
          ap_smno: $ap_smno
          ap_age: $ap_age
          ap_purge: $ap_purge
          ap_doctype: $ap_doctype
          ap_docno: $ap_docno
          ap_docref: $ap_docref
          ap_disc_acc: $ap_disc_acc
          ap_bfbal: $ap_bfbal
        ) {
          ap_pono
        }
      }
    `,
    data
  );
  return itemdata;
}

export function useUpdatePayable(data) {
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: data => updatePayable(data),
    onSuccess: () => {
      Toast({
        title: 'Payable being updated!',
        status: 'success',
        customId: 'payableUpd',
      });
    },
    onError: () => {
      Toast({
        title: 'Payable Update Error! Please check your internet connection!',
        status: 'warning',
        customId: 'payableUpdErr',
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries('payable');
    },
  });

  return mutate;
}
