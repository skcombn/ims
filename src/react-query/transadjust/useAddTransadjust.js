import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../constants';
import { Toast } from '../../helpers/CustomToastify';
import { GraphQLClient, gql } from 'graphql-request';

const API_URL = process.env.REACT_APP_API_URL;
//const API_URL = `http://localhost:4000/graphql`;
const graphQLClient = new GraphQLClient(API_URL, {
  headers: {
    Authorization: `Bearer ${process.env.API_KEY}`,
  },
});

async function addTranadj(data) {
  const { itemdata } = await graphQLClient.request(
    gql`
      mutation AddTranadj(
        $ta_batchno: String
        $ta_date: Date
        $ta_userid: String
        $ta_remark: String
        $ta_post: String
        $ta_branch: String
        $ta_type: String
        $ta_user: String
      ) {
        addTranadj(
          ta_batchno: $ta_batchno
          ta_date: $ta_date
          ta_userid: $ta_userid
          ta_remark: $ta_remark
          ta_post: $ta_post
          ta_branch: $ta_branch
          ta_type: $ta_type
          ta_user: $ta_user
        ) {
          ta_id
        }
      }
    `,
    data
  );
  return itemdata;
}

export function useAddTransadjust(data) {
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: data => addTranadj(data),
    onSuccess: () => {
      Toast({
        title: 'New Transaction Adjustment being added!',
        status: 'success',
        customId: 'tranadjAdd',
      });
    },
    onError: () => {
      Toast({
        title: 'Transaction adjustment Add Error!',
        status: 'warning',
        customId: 'tranadjustAddErr',
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries('tranadjust');
    },
  });

  return mutate;
}
