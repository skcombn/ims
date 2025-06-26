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

async function addPaymentDetls(data) {
  const { itemdata } = await graphQLClient.request(
    gql`
      mutation AddPaymentDetls(
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
        $payd_paydate: Date
      ) {
        addPaymentDetls(
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
          payd_no
        }
      }
    `,
    data
  );
  return itemdata;
}

export function useAddPaymentDetls(data) {
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: data => addPaymentDetls(data),
    onSuccess: () => {
      Toast({
        title: 'New Payment Details being added!',
        status: 'success',
        customId: 'paydetlAdd',
      });
    },
    onError: () => {
      Toast({
        title:
          'Payment Details Add Error! Please check your internet connection!',
        status: 'warning',
        customId: 'paydetlAddErr',
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries('paymentsdetls');
    },
  });

  return mutate;
}
