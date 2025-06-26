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

async function updateReceivablePurgeByCustno(data) {
  const { itemdata } = await graphQLClient.request(
    gql`
      mutation UpdateReceivablePurgeByCustno(
        $ar_custno: String
        $ar_purge: Boolean
      ) {
        updateReceivablePurgeByCustno(
          ar_custno: $ar_custno
          ar_purge: $ar_purge
        ) {
          ar_id
        }
      }
    `,
    data
  );
  return itemdata;
}

export function useUpdateReceivablePurgeByCustno(data) {
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: data => updateReceivablePurgeByCustno(data),
    onSuccess: () => {
      Toast({
        title: 'Receivable being updated!',
        status: 'success',
        customId: 'recUpd',
      });
    },
    onError: () => {
      Toast({
        title:
          'Receivable Update Error! Please check your internet connection!',
        status: 'warning',
        customId: 'recUpdErr',
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries('receivable');
    },
  });

  return mutate;
}
