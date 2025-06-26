import { useMutation, useQueryClient } from '@tanstack/react-query';
//import { items_url } from '../../utils/constants';
import { Toast } from '../../helpers/CustomToastify';
import { GraphQLClient, gql } from 'graphql-request';

//const API_URL = `http://localhost:4000/graphql`;
const API_URL = process.env.REACT_APP_API_URL;

const graphQLClient = new GraphQLClient(API_URL);

async function addStktake(data) {
  const { itemdata } = await graphQLClient.request(
    gql`
      mutation AddStktake(
        $st_batchno: String
        $st_date: Date
        $st_time: String
        $st_remark: String
        $st_userid: String
        $st_user: String
        $st_post: String
      ) {
        addStktake(
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

export function useAddStktake(data) {
  const queryClient = useQueryClient();
  //const toast = useCustomToast();

  const { mutate } = useMutation({
    mutationFn: data => addStktake(data),
    onSuccess: () => {
      Toast({
        title: 'New StockTake Batch being added!',
        status: 'success',
        customId: 'stktakebatchAdd',
      });
    },
    onError: () => {
      Toast({
        title:
          'Stock Take Batch Add Error! Please check your internet connection!',
        status: 'warning',
        customId: 'stktakebatchAddErr',
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries('stktake');
    },
  });

  return mutate;
}
