import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../constants';
import { Toast } from '../../helpers/CustomToastify';
import { GraphQLClient, gql } from 'graphql-request';

//const API_URL = `http://localhost:4000/graphql`;
const API_URL = process.env.REACT_APP_API_URL;

const graphQLClient = new GraphQLClient(API_URL, {
  headers: {
    Authorization: `Bearer ${process.env.API_KEY}`,
  },
});

async function deleteItem(data) {
  const { itemdata } = await graphQLClient.request(
    gql`
      mutation DeleteItem($item_id: ID) {
        deleteItem(item_id: $item_id) {
          item_id
        }
      }
    `,
    data
  );
  return itemdata;
}

export function useDeleteItem(data) {
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: data => deleteItem(data),
    onSuccess: () => {
      Toast({
        title: 'Item being deleted!',
        status: 'warning',
        customId: 'itemdel',
      });
    },
    onError: () => {
      Toast({
        title: 'Item Delete Error!',
        status: 'warning',
        customId: 'itemdelErr',
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries('items');
    },
  });

  return mutate;
}
