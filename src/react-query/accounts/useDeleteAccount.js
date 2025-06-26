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

async function deleteAccount(data) {
  const { itemdata } = await graphQLClient.request(
    gql`
      mutation DeleteAccount($acc_id: ID) {
        deleteAccount(acc_id: $acc_id) {
          accc_id
        }
      }
    `,
    data
  );
  return itemdata;
}

export function useDeleteAccount(data) {
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: data => deleteAccount(data),
    onSuccess: () => {
      Toast({
        title: 'Account being deleted!',
        status: 'warning',
        customId: 'accDel',
      });
    },
    onError: () => {
      Toast({
        title: 'Account Delete Error! Please check your internet connection!',
        status: 'warning',
        customId: 'accDelErr',
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries('accounts');
    },
  });

  return mutate;
}
