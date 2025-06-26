import { useMutation, useQueryClient } from '@tanstack/react-query';
//import { items_url } from '../../utils/constants';
import { useCustomToast } from '../../helpers/useCustomToast';
import { GraphQLClient, gql } from 'graphql-request';
import { Toast } from '../../helpers/CustomToastify';

//const API_URL = `http://localhost:4000/graphql`;
const API_URL = process.env.REACT_APP_API_URL;
const graphQLClient = new GraphQLClient(API_URL);

async function deleteStktakedetls(data) {
  const { itemdata } = await graphQLClient.request(
    gql`
      mutation DeleteStktakeDetls($std_id: ID) {
        deleteStktakeDetls(std_id: $std_id) {
          std_id
        }
      }
    `,
    data
  );
  return itemdata;
}

export function useDeleteStktakedetls(data) {
  const queryClient = useQueryClient();
  //const toast = useCustomToast();

  const { mutate } = useMutation({
    mutationFn: data => deleteStktakedetls(data),
    onSuccess: () => {
      Toast({
        title: 'Stock Take Details Batch being deleted!',
        status: 'warning',
        customId: 'stktakedetlsDel',
      });
    },
    onError: () => {
      Toast({
        title:
          'Stock Take Details Batch Delete Error! Please check your internet connection!',
        status: 'warning',
        customId: 'stktakedetlsDelErr',
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries('stktakedetls');
    },
  });

  return mutate;
}
