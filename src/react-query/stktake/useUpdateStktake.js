import { useMutation, useQueryClient } from '@tanstack/react-query';
//import { items_url } from '../../utils/constants';
//import { useCustomToast } from '../../helpers/useCustomToast';
import { GraphQLClient, gql } from 'graphql-request';
import { Toast } from '../../helpers/CustomToastify';

//const API_URL = `http://localhost:4000/graphql`;
const API_URL = process.env.REACT_APP_API_URL;

const graphQLClient = new GraphQLClient(API_URL);

async function updateStktake(data) {
  const { itemdata } = await graphQLClient.request(
    gql`
      mutation UpdateStktake(
        $st_id: ID
        $st_batchno: String
        $st_date: Date
        $st_time: String
        $st_remark: String
        $st_userid: String
        $st_user: String
        $st_post: String
      ) {
        updateStktake(
          st_id: $st_id
          st_batchno: $st_batchno
          st_date: $st_date
          st_time: $st_time
          st_remark: $st_remark
          st_userid: $st_userid
          st_user: $st_user
          st_post: $st_post
        ) {
          st_id
        }
      }
    `,
    data
  );
  return itemdata;
}

export function useUpdateStktake(data) {
  const queryClient = useQueryClient();
  //const toast = useCustomToast();

  const { mutate } = useMutation({
    mutationFn: data => updateStktake(data),
    onSuccess: () => {
      Toast({
        title: 'Stock Take Batch  being updated!',
        status: 'success',
        customId: 'stktakebatchUpd',
      });
    },
    onError: () => {
      Toast({
        title:
          'Stock Take Batch Update Error! Please check your internet connection!',
        status: 'warning',
        customId: 'stktakebatchUpdErr',
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries('stktake');
    },
  });

  return mutate;
}
