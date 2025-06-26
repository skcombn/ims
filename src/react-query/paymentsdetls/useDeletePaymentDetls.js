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

async function deletePaymentsDetls(data) {
  const { itemdata } = await graphQLClient.request(
    gql`
      mutation DeletePaymentDetls($payd_no: String) {
        deletePaymentDetls(payd_no: $payd_no) {
          payd_no
        }
      }
    `,
    data
  );
  return itemdata;
}

export function useDeletePaymentDetls(data) {
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: data => deletePaymentsDetls(data),
    onSuccess: () => {
      Toast({
        title: 'Payment Details being deleted!',
        status: 'warning',
        customId: 'paydetlDel',
      });
    },
    onError: () => {
      Toast({
        title:
          'Payment Details Delete Error! Please check your internet connection!',
        status: 'warning',
        customId: 'paydetlDelErr',
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries('paymentsdetls');
    },
  });

  return mutate;
}
