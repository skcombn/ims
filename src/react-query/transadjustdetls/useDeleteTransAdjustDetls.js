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

async function deleteTranadjdetls(data) {
  const { itemdata } = await graphQLClient.request(
    gql`
      mutation DeleteTranadjdetls($tad_id: ID) {
        deleteTranadjdetls(tad_id: $tad_id) {
          tad_id
        }
      }
    `,
    data
  );
  return itemdata;
}

export function useDeleteTransAdjustDetls(data) {
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: data => deleteTranadjdetls(data),
    onSuccess: () => {
      Toast({
        title: 'Transaction adjustment details being deleted!',
        status: 'warning',
        customId: 'tranadjdetldel',
      });
    },
    onError: () => {
      Toast({
        title: 'Transaction adjustment details Delete Error!',
        status: 'warning',
        customId: 'tranadjdetldelErr',
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries('tranadjustdetls');
    },
  });

  return mutate;
}
