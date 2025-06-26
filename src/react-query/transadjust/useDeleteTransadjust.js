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

async function deleteTranadj(data) {
  const { itemdata } = await graphQLClient.request(
    gql`
      mutation DeleteTranadj($ta_id: ID) {
        deleteTranadj(ta_id: $ta_id) {
          ta_id
        }
      }
    `,
    data
  );
  return itemdata;
}

export function useDeleteTransadjust(data) {
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: data => deleteTranadj(data),
    onSuccess: () => {
      Toast({
        title: 'Transaction adjustment being deleted!',
        status: 'warning',
        customId: 'tranadjdel',
      });
    },
    onError: () => {
      Toast({
        title: 'Transaction adjustment Delete Error!',
        status: 'warning',
        customId: 'tranadjdelErr',
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries('tranadjust');
    },
  });

  return mutate;
}
