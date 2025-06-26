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

async function updateGroup(data) {
  const { itemdata } = await graphQLClient.request(
    gql`
      mutation UpdateGroup(
        $group_id: ID
        $group_desp: String
        $group_category: String
      ) {
        updateGroup(
          group_id: $group_id
          group_desp: $group_desp
          group_category: $group_category
        ) {
          group_id
        }
      }
    `,
    data
  );
  return itemdata;
}

export function useUpdateGroup(data) {
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: data => updateGroup(data),
    onSuccess: () => {
      Toast({
        title: 'Group being updated!',
        status: 'success',
        customId: 'groupUpd',
      });
    },
    onError: () => {
      Toast({
        title: 'Group Update Error! Please check your internet connection!',
        status: 'warning',
        customId: 'groupUpdErr',
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries('groups');
    },
  });

  return mutate;
}
