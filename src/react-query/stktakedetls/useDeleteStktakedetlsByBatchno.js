import { useMutation, useQueryClient } from '@tanstack/react-query';
//import { items_url } from '../../utils/constants';
import { useCustomToast } from '../../helpers/useCustomToast';
import { GraphQLClient, gql } from 'graphql-request';
import { Toast } from '../../helpers/CustomToastify';

//const API_URL = `http://localhost:4000/graphql`;
const API_URL = process.env.REACT_APP_API_URL;
const graphQLClient = new GraphQLClient(API_URL);

async function deleteStktakedetlsByBatchno(data) {
  const { itemdata } = await graphQLClient.request(
    gql`
      mutation DeleteStktakeDetlsByBatchno($std_batchno: String) {
        deleteStktakeDetlsByBatchno(std_batchno: $std_batchno) {
          std_batchno
        }
      }
    `,
    data
  );
  return itemdata;
}

export function useDeleteStktakedetlsByBatchno(data) {
  const queryClient = useQueryClient();
  //const toast = useCustomToast();

  const { mutate } = useMutation({
    mutationFn: data => deleteStktakedetlsByBatchno(data),
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
