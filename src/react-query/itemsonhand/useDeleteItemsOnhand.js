import { useMutation, useQueryClient } from '@tanstack/react-query';
//import { items_url } from '../../utils/constants';
import { Toast } from '../../helpers/CustomToastify';
import { GraphQLClient, gql } from 'graphql-request';

//const API_URL = `http://localhost:4000/graphql`;
const API_URL = process.env.REACT_APP_API_URL;
const graphQLClient = new GraphQLClient(API_URL, {
  headers: {
    Authorization: `Bearer ${process.env.API_KEY}`,
  },
});

async function deleteItemsOnhand(data) {
  const { itemdata } = await graphQLClient.request(
    gql`
      mutation DeleteItemsOnhand($it_id: ID) {
        deleteItem(it_id: $it_id) {
          it_id
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
    mutationFn: data => deleteItemsOnhand(data),
    onSuccess: () => {
      Toast({
        title: 'Item onhand being deleted!',
        status: 'warning',
        customId: 'itemonhandDel',
      });
    },
    onError: () => {
      Toast({
        title:
          'Items Onhand Delete Error! Please check your internet connection!',
        status: 'warning',
        customId: 'itemonhandDelErr',
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries('itemsonhand');
    },
  });

  return mutate;
}
