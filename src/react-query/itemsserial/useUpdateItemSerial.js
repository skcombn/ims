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

async function updateItemSerial(data) {
  const { itemdata } = await graphQLClient.request(
    gql`
      mutation UpdateItemSerial(
        $is_id: ID
        $is_itemno: String
        $is_pono: String
        $is_podate: Date
        $is_serialno: String
        $is_post: String
      ) {
        updateItemSerial(
          is_id: $is_id
          is_itemno: $is_itemno
          is_pono: $is_pono
          is_podate: $is_podate
          is_serialno: $is_serialno
          is_post: $is_post
        ) {
          is_id
        }
      }
    `,
    data
  );
  return itemdata;
}

export function useUpdateItemSerial(data) {
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: data => updateItemSerial(data),
    onSuccess: () => {
      Toast({
        title: 'Serial Item being updated!',
        status: 'success',
        customId: 'itemserialupd',
      });
    },
    onError: () => {
      Toast({
        title: 'Serial Item Update Error! ',
        status: 'warning',
        customId: 'itemserialupdErr',
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries('itemsserial');
    },
  });

  return mutate;
}
