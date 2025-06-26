import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Toast } from '../../helpers/CustomToastify';
import { GraphQLClient, gql } from 'graphql-request';

//const API_URL = `http://localhost:4000/graphql`;
const API_URL = process.env.REACT_APP_API_URL;

const graphQLClient = new GraphQLClient(API_URL, {
  headers: {
    Authorization: `Bearer ${process.env.API_KEY}`,
  },
});

async function deleteItemGroup(data) {
  const { itemdata } = await graphQLClient.request(
    gql`
      mutation DeleteItemGroup($group_id: ID) {
        deleteItemGroup(group_id: $group_id) {
          group_id
        }
      }
    `,
    data
  );
  return itemdata;
}

export function useDeleteItemGroup(data) {
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: data => deleteItemGroup(data),
    onSuccess: () => {
      Toast({
        title: 'Item Group being deleted!',
        status: 'warning',
        customId: 'itemgrpDel',
      });
    },
    onError: () => {
      Toast({
        title:
          'Item Group Delete Error! Please check your internet connection!',
        status: 'warning',
        customId: 'itemgrpDelErr',
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries('itemsgroups');
    },
  });

  return mutate;
}
