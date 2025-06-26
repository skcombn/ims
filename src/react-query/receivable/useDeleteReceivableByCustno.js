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

async function deleteReceivableByCustno(data) {
  const { itemdata } = await graphQLClient.request(
    gql`
      mutation DeleteReceivableByCustno($ar_custno: String) {
        deleteReceivableByCustno(ar_custno: $ar_custno) {
          ar_id
        }
      }
    `,
    data
  );
  return itemdata;
}

export function useDeleteReceivableByCustno(data) {
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: data => deleteReceivableByCustno(data),
    onSuccess: () => {
      Toast({
        title: 'Receivable being deleted!',
        status: 'warning',
        customId: 'recDel',
      });
    },
    onError: () => {
      Toast({
        title:
          'Receivable Delete Error! Please check your internet connection!',
        status: 'warning',
        customId: 'recDelErr',
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries('receivable');
    },
  });

  return mutate;
}
