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

async function deletePurchase(data) {
  const { itemdata } = await graphQLClient.request(
    gql`
      mutation DeletePurchase($po_id: ID) {
        deletePurchase(po_id: $po_id) {
          po_id
        }
      }
    `,
    data
  );
  return itemdata;
}

export function useDeletePurchase(data) {
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: data => deletePurchase(data),
    onSuccess: () => {
      Toast({
        title: 'Purchase being deleted!',
        status: 'warning',
        customId: 'poDel',
      });
    },
    onError: () => {
      Toast({
        title: 'Purchase Delete Error! Please check your internet connection!',
        status: 'poDelErr',
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries('purchases');
    },
  });

  return mutate;
}
