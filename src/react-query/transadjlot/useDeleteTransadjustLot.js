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

async function deleteTranadjlot(data) {
  const { itemdata } = await graphQLClient.request(
    gql`
      mutation DeleteTranadjlot($tal_id: ID) {
        deleteTranadjlot(tal_id: $tal_id) {
          tal_id
        }
      }
    `,
    data
  );
  return itemdata;
}

export function useDeleteTransAdjustLot(data) {
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: data => deleteTranadjlot(data),
    onSuccess: () => {
      Toast({
        title: 'Transaction adjustment lot being deleted!',
        status: 'warning',
        customId: 'tranadjlotdel',
      });
    },
    onError: () => {
      Toast({
        title: 'Transaction adjustment lot Delete Error!',
        status: 'warning',
        customId: 'tranadjlotdelErr',
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries('tranadjustlot');
    },
  });

  return mutate;
}
