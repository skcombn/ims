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

async function deleteTranserial(data) {
  const { itemdata } = await graphQLClient.request(
    gql`
      mutation DeleteTranserial($ts_id: ID) {
        deleteTranserial(ts_id: $ts_id) {
          ts_id
        }
      }
    `,
    data
  );
  return itemdata;
}

export function useDeleteTranSerial(data) {
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: data => deleteTranserial(data),
    onSuccess: () => {
      Toast({
        title: 'Transaction serial being deleted!',
        status: 'warning',
        customId: 'transerialdel',
      });
    },
    onError: () => {
      Toast({
        title: 'Transaction serial Delete Error!',
        status: 'warning',
        customId: 'transerialdelErr',
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries('transserial');
    },
  });

  return mutate;
}
