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

async function deletePurchaseDetls(data) {
  const { itemdata } = await graphQLClient.request(
    gql`
      mutation DeletePurchaseDetls($pl_id: ID) {
        deletePurchaseDetls(pl_id: $pl_id) {
          pl_id
        }
      }
    `,
    data
  );
  return itemdata;
}

export function useDeletePurchaseDetls(data) {
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: data => deletePurchaseDetls(data),
    onSuccess: () => {
      Toast({
        title: 'Purchase Details being deleted!',
        status: 'warning',
        customId: 'podetlDel',
      });
    },
    onError: () => {
      Toast({
        title:
          'Purchase Details Delete Error! Please check your internet connection!',
        status: 'warning',
        customId: 'podetlDelErr',
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries('purchasesdetls');
    },
  });

  return mutate;
}
