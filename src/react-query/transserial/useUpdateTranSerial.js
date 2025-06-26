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

async function updateTranSerial(data) {
  const { itemdata } = await graphQLClient.request(
    gql`
      mutation UpdateTranserial(
        $ts_id: ID
        $ts_tranno: String
        $ts_serialno: String
        $ts_pono: String
        $ts_invno: String
        $ts_podate: Date
        $ts_invdate: Date
        $ts_post: String
        $ts_trantype: String
      ) {
        updateTranserial(
          ts_id: $ts_id
          ts_tranno: $ts_tranno
          ts_serialno: $ts_serialno
          ts_pono: $ts_pono
          ts_invno: $ts_invno
          ts_podate: $ts_podate
          ts_invdate: $ts_invdate
          ts_post: $ts_post
          ts_trantype: $ts_trantype
        ) {
          ts_id
        }
      }
    `,
    data
  );
  return itemdata;
}

export function useUpdateTranSerial(data) {
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: data => updateTranSerial(data),
    onSuccess: () => {
      Toast({
        title: 'Transaction serial being updated!',
        status: 'success',
        customId: 'transerialupd',
      });
    },
    onError: () => {
      Toast({
        title: 'Transaction serial Update Error! ',
        status: 'warning',
        customId: 'transerialupdErr',
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries('transserial');
    },
  });

  return mutate;
}
