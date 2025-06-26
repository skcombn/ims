import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../constants';
import { Toast } from '../../helpers/CustomToastify';
import { GraphQLClient, gql } from 'graphql-request';

const API_URL = process.env.REACT_APP_API_URL;
//const API_URL = `http://localhost:4000/graphql`;
const graphQLClient = new GraphQLClient(API_URL, {
  headers: {
    Authorization: `Bearer ${process.env.API_KEY}`,
  },
});

async function deleteTran(data) {
  const { itemdata } = await graphQLClient.request(
    gql`
      mutation DeleteTran($t_id: ID) {
        deleteTran(t_id: $t_id) {
          t_id
        }
      }
    `,
    data
  );
  return itemdata;
}
export function useDeleteTran(data) {
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: data => deleteTran(data),
    onSuccess: () => {
      Toast({
        title: 'Transaction being deleted!',
        status: 'warning',
        customId: 'trandel',
      });
    },
    onError: () => {
      Toast({
        title: 'Transaction Delete Error!',
        status: 'warning',
        customId: 'trandelErr',
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries('transactions');
    },
  });

  return mutate;
}
