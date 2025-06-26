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

async function deleteStaff(data) {
  const { itemdata } = await graphQLClient.request(
    gql`
      mutation DeleteStaff($s_id: ID) {
        deleteStaff(s_id: $s_id) {
          s_id
        }
      }
    `,
    data
  );
  return itemdata;
}

export function useDeleteStaff(data) {
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: data => deleteStaff(data),
    onSuccess: () => {
      Toast({
        title: 'Staff being deleted!',
        status: 'warning',
        customId: 'staffDel',
      });
    },
    onError: () => {
      Toast({
        title: 'Staff Delete Error! Please check your internet connection!',
        status: 'warning',
        customId: 'staffDelErr',
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries('staffs');
    },
  });

  return mutate;
}
