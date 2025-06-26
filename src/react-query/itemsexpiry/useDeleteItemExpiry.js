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

async function deleteItemExpiry(data) {
  const { itemdata } = await graphQLClient.request(
    gql`
      mutation DeleteItemExpiry($ie_id: ID) {
        deleteItemExpiry(ie_id: $ie_id) {
          ie_id
        }
      }
    `,
    data
  );
  return itemdata;
}

export function useDeleteItemExpiry(data) {
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: data => deleteItemExpiry(data),
    onSuccess: () => {
      Toast({
        title: 'Expiry Item being deleted!',
        status: 'warning',
        customId: 'itemexpdel',
      });
    },
    onError: () => {
      Toast({
        title: 'Expiry Item Delete Error!',
        status: 'warning',
        customId: 'itemexpdelErr',
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries('itemsexpiry');
    },
  });

  return mutate;
}
