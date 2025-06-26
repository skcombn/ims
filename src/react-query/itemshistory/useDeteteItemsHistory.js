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

async function deleteItemHistory(data) {
  const { itemdata } = await graphQLClient.request(
    gql`
      mutation DeleteItemHistory($it_id: ID) {
        deleteItemHistory(it_id: $it_id) {
          it_id
        }
      }
    `,
    data
  );
  return itemdata;
}

export function useDeleteItemsHistory(data) {
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: data => deleteItemHistory(data),
    onSuccess: () => {
      Toast({
        title: 'Item history being deleted!',
        status: 'warning',
        customId: 'itemhistdel',
      });
    },
    onError: () => {
      Toast({
        title: 'Item History Delete Error!',
        status: 'warning',
        customId: 'itemhistdelErr',
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries('itemshistory');
    },
  });

  return mutate;
}
