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

async function addReceivable(data) {
  const { itemdata } = await graphQLClient.request(
    gql`
      mutation AddReceivable(
        $ar_invno: String
        $ar_date: Date
        $ar_custno: String
        $ar_cust: String
        $ar_type: String
        $ar_subtotal: Float
        $ar_paid_amt: Float
        $ar_disc_amt: Float
        $ar_disc_taken: Float
        $ar_balance: Float
        $ar_total: Float
        $ar_paid: Boolean
        $ar_glcode: String
        $ar_paid_disc: Float
        $ar_refno: String
        $ar_smno: String
        $ar_loc: String
        $ar_age: Int
        $ar_print: Int
        $ar_doctype: String
        $ar_docno: String
        $ar_purge: Boolean
        $ar_bfbal: Float
        $ar_agedate: Date
      ) {
        addReceivable(
          ar_invno: $ar_invno
          ar_date: $ar_date
          ar_custno: $ar_custno
          ar_cust: $ar_cust
          ar_type: $ar_type
          ar_subtotal: $ar_subtotal
          ar_paid_amt: $ar_paid_amt
          ar_disc_amt: $ar_disc_amt
          ar_disc_taken: $ar_disc_taken
          ar_balance: $ar_balance
          ar_total: $ar_total
          ar_paid: $ar_paid
          ar_glcode: $ar_glcode
          ar_paid_disc: $ar_paid_disc
          ar_refno: $ar_refno
          ar_smno: $ar_smno
          ar_loc: $ar_loc
          ar_age: $ar_age
          ar_print: $ar_print
          ar_doctype: $ar_doctype
          ar_docno: $ar_docno
          ar_purge: $ar_purge
          ar_bfbal: $ar_bfbal
          ar_agedate: $ar_agedate
        ) {
          ar_invno
        }
      }
    `,
    data
  );
  return itemdata;
}

export function useAddReceivable(data) {
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: data => addReceivable(data),
    onSuccess: () => {
      Toast({
        title: 'New Receivable being added!',
        status: 'success',
        customId: 'recAdd',
      });
    },
    onError: () => {
      Toast({
        title: 'Receivable Add Error! Please check your internet connection!',
        status: 'warning',
        customId: 'recAddErr',
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries('receivable');
    },
  });

  return mutate;
}
