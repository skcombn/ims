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

async function addStaff(data) {
  const { itemdata } = await graphQLClient.request(
    gql`
      mutation AddStaff(
        $s_code: String
        $s_name: String
        $s_designation: String
        $s_comms: Float
        $s_area: String
      ) {
        addStaff(
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

export function useAddStaff(data) {
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: data => addStaff(data),
    onSuccess: () => {
      Toast({
        title: 'New Staff being added!',
        status: 'success',
        customId: 'staffAdd',
      });
    },
    onError: () => {
      Toast({
        title: 'Staff Add Error! Please check your internet connection!',
        status: 'warning',
        customId: 'staffAddErr',
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries('staffs');
    },
  });

  return mutate;
}
