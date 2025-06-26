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

async function updatePaymentsDetls(data) {
  const { itemdata } = await graphQLClient.request(
    gql`
      mutation UpdatePaymentsDetls(
        $payd_id: ID
        $payd_no: String
        $payd_invno: String
        $payd_invdate: Date
        $payd_pono: String
        $payd_podate: Date
        $payd_invamt: Float
        $payd_last_bal: Float
        $payd_disc: Float
        $payd_amt: Float
        $payd_apid: String
        $payd_recdate: Date
        $payd_branch: String
        $payd_paydate: Date
      ) {
        updatePaymentDetls(
          payd_id: $payd_id
          payd_no: $payd_no
          payd_invno: $payd_invno
          payd_invdate: $payd_invdate
          payd_pono: $payd_pono
          payd_podate: $payd_podate
          payd_invamt: $payd_invamt
          payd_last_bal: $payd_last_bal
          payd_disc: $payd_disc
          payd_amt: $payd_amt
          payd_apid: $payd_apid
          payd_recdate: $payd_recdate
          payd_branch: $payd_branch
          payd_paydate: $payd_paydate
        ) {
          payd_id
        }
      }
    `,
    data
  );
  return itemdata;
}

export function useUpdatePaymentsDetls(data) {
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: data => updatePaymentsDetls(data),
    onSuccess: () => {
      Toast({
        title: 'Payment Details being updated!',
        status: 'success',
        customId: 'paydetlUpd',
      });
    },
    onError: () => {
      Toast({
        title:
          'Payment Details Update Error! Please check your internet connection!',
        status: 'warning',
        customId: 'paydetlUpdErr',
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries('paymentsdetls');
    },
  });

  return mutate;
}
