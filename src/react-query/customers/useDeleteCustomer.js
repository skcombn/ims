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

async function deleteCustomer(data) {
  const { itemdata } = await graphQLClient.request(
    gql`
      mutation DeleteCustomer($c_id: ID) {
        deleteCustomer(c_id: $c_id) {
          c_id
        }
      }
    `,
    data
  );
  return itemdata;
}

export function useDeleteCustomer(data) {
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: data => deleteCustomer(data),
    onSuccess: () => {
      Toast({
        title: 'Customer being deleted!',
        status: 'warning',
        customId: 'custDel',
      });
    },
    onError: () => {
      Toast({
        title: 'Customer Delete Error! Please check your internet connection!',
        status: 'warning',
        customId: 'custDelErr',
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries('customers');
    },
  });

  return mutate;
}
