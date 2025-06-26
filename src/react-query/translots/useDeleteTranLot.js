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

async function deleteTranslot(data) {
  const { itemdata } = await graphQLClient.request(
    gql`
      mutation DeleteTranslot($tl_id: ID) {
        deleteTranslot(tl_id: $tl_id) {
          tl_id
        }
      }
    `,
    data
  );
  return itemdata;
}

export function useDeleteTranLot(data) {
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: data => deleteTranslot(data),
    onSuccess: () => {
      Toast({
        title: 'Transaction lot being deleted!',
        status: 'warning',
        customId: 'tranlotdel',
      });
    },
    onError: () => {
      Toast({
        title: 'Transaction lot Delete Error!',
        status: 'warning',
        customId: 'tranlotdelErr',
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries('translots');
    },
  });

  return mutate;
}
