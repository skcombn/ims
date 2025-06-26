import { useMutation, useQueryClient } from '@tanstack/react-query';
//import { items_url } from '../../utils/constants';
import { useCustomToast } from '../../helpers/useCustomToast';
import { GraphQLClient, gql } from 'graphql-request';
import { Toast } from '../../helpers/CustomToastify';

//const API_URL = `http://localhost:4000/graphql`;
const API_URL = process.env.REACT_APP_API_URL;
const graphQLClient = new GraphQLClient(API_URL);

async function deleteStktake(data) {
  const { itemdata } = await graphQLClient.request(
    gql`
      mutation DeleteStktake($st_id: ID) {
        deleteStktake(st_id: $st_id) {
          st_id
        }
      }
    `,
    data
  );
  return itemdata;
}

export function useDeleteStktake(data) {
  const queryClient = useQueryClient();
  //const toast = useCustomToast();

  const { mutate } = useMutation({
    mutationFn: data => deleteStktake(data),
    onSuccess: () => {
      Toast({
        title: 'Stock Take Batch being deleted!',
        status: 'warning',
        customId: 'stktakeDel',
      });
    },
    onError: () => {
      Toast({
        title:
          'Stock Take Batch Delete Error! Please check your internet connection!',
        status: 'warning',
        customId: 'stktakebatchDelErr',
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries('stktake');
    },
  });

  return mutate;
}
