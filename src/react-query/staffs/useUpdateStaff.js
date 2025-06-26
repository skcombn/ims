import { useMutation, useQueryClient } from '@tanstack/react-query';
//import { items_url } from '../../utils/constants';
import { useCustomToast } from '../../helpers/useCustomToast';
import { GraphQLClient, gql } from 'graphql-request';
import { Toast } from '../../helpers/CustomToastify';

const API_URL = process.env.REACT_APP_API_URL;
//const API_URL = `http://localhost:4000/graphql`;
const graphQLClient = new GraphQLClient(API_URL, {
  headers: {
    Authorization: `Bearer ${process.env.API_KEY}`,
  },
});

async function updateStaff(data) {
  const { itemdata } = await graphQLClient.request(
    gql`
      mutation UpdateStaff(
        $s_id: ID
        $s_code: String
        $s_name: String
        $s_designation: String
        $s_comms: Float
        $s_area: String
      ) {
        updateStaff(
          s_id: $s_id
          s_code: $s_code
          s_name: $s_name
          s_designation: $s_designation
          s_comms: $s_comms
          s_area: $s_area
        ) {
          s_id
        }
      }
    `,
    data
  );
  return itemdata;
}

export function useUpdateStaff(data) {
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: data => updateStaff(data),
    onSuccess: () => {
      Toast({
        title: 'Staff being updated!',
        status: 'success',
        customId: 'staffUpd',
      });
    },
    onError: () => {
      Toast({
        title: 'Staff Update Error! Please check your internet connection!',
        status: 'warning',
        customId: 'staffUpdErr',
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries('staffs');
    },
  });

  return mutate;
}
