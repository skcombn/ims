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

async function deleteItemSerial(data) {
  const { itemdata } = await graphQLClient.request(
    gql`
      mutation DeleteItemSerial($is_id: ID) {
        deleteItemSerial(is_id: $is_id) {
          is_id
        }
      }
    `,
    data
  );
  return itemdata;
}

export function useDeleteItemSerial(data) {
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: data => deleteItemSerial(data),
    onSuccess: () => {
      Toast({
        title: 'Serial Item being deleted!',
        status: 'warning',
        customId: 'itemserialdel',
      });
    },
    onError: () => {
      Toast({
        title: 'Serial Item Delete Error!',
        status: 'warning',
        customId: 'itemserialdelErr',
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries('itemsserial');
    },
  });

  return mutate;
}
