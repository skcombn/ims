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

async function addGroup(data) {
  const { itemdata } = await graphQLClient.request(
    gql`
      mutation AddGroup($group_desp: String, $group_category: String) {
        addGroup(group_desp: $group_desp, group_category: $group_category) {
          group_id
        }
      }
    `,
    data
  );
  return itemdata;
}

export function useAddGroup(data) {
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: data => addGroup(data),
    onSuccess: () => {
      Toast({
        title: 'New Group being added!',
        status: 'success',
        customId: 'groupAdd',
      });
    },
    onError: () => {
      Toast({
        title: 'Group Add Error! Please check your internet connection!',
        status: 'warning',
        customId: 'groupAddErr',
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries('groups');
    },
  });

  return mutate;
}
