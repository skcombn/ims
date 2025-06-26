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

async function deleteTranItem(data) {
  const { itemdata } = await graphQLClient.request(
    gql`
      mutation DeleteTranItem($tl_id: ID) {
        deleteTranItem(tl_id: $tl_id) {
          tl_id
        }
      }
    `,
    data
  );
  return itemdata;
}

export function useDeleteTranDetls(data) {
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: data => deleteTranItem(data),
    onSuccess: () => {
      Toast({
        title: 'Transaction details being deleted!',
        status: 'warning',
        customId: 'trandetldel',
      });
    },
    onError: () => {
      Toast({
        title: 'Transaction Details Delete Error!',
        status: 'warning',
        customId: 'trandetldelErr',
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries('transdetls');
    },
  });

  return mutate;
}
