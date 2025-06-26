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

async function deleteUser(data) {
  const { itemdata } = await graphQLClient.request(
    gql`
      mutation DeleteUser($u_id: ID) {
        deleteUser(u_id: $u_id) {
          u_id
        }
      }
    `,
    data
  );
  return itemdata;
}

export function useDeleteUser(data) {
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: data => deleteUser(data),
    onSuccess: () => {
      Toast({
        title: 'User being deleted!',
        status: 'warning',
        customId: 'userDel',
      });
    },
    onError: () => {
      Toast({
        title: 'User Delete Error! Please check your internet connection!',
        status: 'warning',
        customId: 'userDelErr',
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries('users');
    },
  });

  return mutate;
}
