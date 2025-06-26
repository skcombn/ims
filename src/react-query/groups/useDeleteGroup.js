import { useMutation, useQueryClient } from '@tanstack/react-query';
//import { items_url } from '../../utils/constants';
import { Toast } from '../../helpers/CustomToastify';
import { GraphQLClient, gql } from 'graphql-request';

//const API_URL = `http://localhost:4000/graphql`;
const API_URL = process.env.REACT_APP_API_URL;

const graphQLClient = new GraphQLClient(API_URL, {
  headers: {
    Authorization: `Bearer ${process.env.API_KEY}`,
  },
});

async function deleteGroup(data) {
  const { itemdata } = await graphQLClient.request(
    gql`
      mutation DeleteGroup($group_id: ID) {
        deleteGroup(group_id: $group_id) {
          group_id
        }
      }
    `,
    data
  );
  return itemdata;
}

export function useDeleteGroup(data) {
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: data => deleteGroup(data),
    onSuccess: () => {
      Toast({
        title: 'Group being deleted!',
        status: 'warning',
        customId: 'groupDel',
      });
    },
    onError: () => {
      Toast({
        title: 'Group Delete Error! Please check your internet connection!',
        status: 'warning',
        customId: 'groupDelErr',
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries('groups');
    },
  });

  return mutate;
}
