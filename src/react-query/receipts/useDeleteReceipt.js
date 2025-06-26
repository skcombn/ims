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

async function deleteReceipt(data) {
  const { itemdata } = await graphQLClient.request(
    gql`
      mutation DeleteReceipt($rcp_id: ID) {
        deleteReceipt(rcp_id: $rcp_id) {
          rcp_id
        }
      }
    `,
    data
  );
  return itemdata;
}

export function useDeleteReceipt(data) {
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: data => deleteReceipt(data),
    onSuccess: () => {
      Toast({
        title: 'Receipt being deleted!',
        status: 'warning',
        customId: 'reptDel',
      });
    },
    onError: () => {
      Toast({
        title: 'Receipt Delete Error! Please check your internet connection!',
        status: 'warning',
        customId: 'reptDelErr',
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries('receipts');
    },
  });

  return mutate;
}
