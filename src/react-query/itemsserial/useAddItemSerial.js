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

async function addItemSerial(data) {
  const { itemdata } = await graphQLClient.request(
    gql`
      mutation AddItemSerial(
        $is_itemno: String
        $is_pono: String
        $is_podate: Date
        $is_serialno: String
        $is_post: String
      ) {
        addItemSerial(
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

export function useAddItemSerial(data) {
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: data => addItemSerial(data),
    onSuccess: () => {
      Toast({
        title: 'New Serial Item being added!',
        status: 'success',
        customId: 'itemserialAdd',
      });
    },
    onError: () => {
      Toast({
        title: 'Item Serial Add Error!',
        status: 'warning',
        customId: 'itemserialAddErr',
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries('itemsserial');
    },
  });

  return mutate;
}
