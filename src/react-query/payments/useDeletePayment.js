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

async function deletePayment(data) {
  const { itemdata } = await graphQLClient.request(
    gql`
      mutation DeletePayment($pay_id: ID) {
        deletePayment(pay_id: $pay_id) {
          pay_id
        }
      }
    `,
    data
  );
  return itemdata;
}

export function useDeletePayment(data) {
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: data => deletePayment(data),
    onSuccess: () => {
      Toast({
        title: 'Payment being deleted!',
        status: 'warning',
        customId: 'payDel',
      });
    },
    onError: () => {
      Toast({
        title: 'Payment Delete Error! Please check your internet connection!',
        status: 'warning',
        customId: 'payDel',
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries('payments');
    },
  });

  return mutate;
}
