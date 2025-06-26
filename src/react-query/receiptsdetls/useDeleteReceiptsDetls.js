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

async function deleteReceiptsDetls(data) {
  const { itemdata } = await graphQLClient.request(
    gql`
      mutation DeleteReceiptsDetls($rcpd_no: String) {
        deleteReceiptsDetls(rcpd_no: $rcpd_no) {
          rcpd_no
        }
      }
    `,
    data
  );
  return itemdata;
}

export function useDeleteReceiptsDetls(data) {
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: data => deleteReceiptsDetls(data),
    onSuccess: () => {
      Toast({
        title: 'Receipt Details being deleted!',
        status: 'warning',
        customId: 'reptdetlDel',
      });
    },
    onError: () => {
      Toast({
        title:
          'Receipt Details Delete Error! Please check your internet connection!',
        status: 'warning',
        customId: 'reptdetlDelErr',
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries('receiptsdetls');
    },
  });

  return mutate;
}
