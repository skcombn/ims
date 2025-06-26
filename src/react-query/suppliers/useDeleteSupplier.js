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

async function deleteSupplier(data) {
  const { itemdata } = await graphQLClient.request(
    gql`
      mutation DeleteSupplier($s_id: ID) {
        deleteSupplier(s_id: $s_id) {
          s_id
        }
      }
    `,
    data
  );
  return itemdata;
}

export function useDeleteSupplier(data) {
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: data => deleteSupplier(data),
    onSuccess: () => {
      Toast({
        title: 'Supplier being deleted!',
        status: 'warning',
        customId: 'suppDel',
      });
    },
    onError: () => {
      Toast({
        title: 'Supplier Delete Error! Please check your internet connection!',
        status: 'warning',
        customId: 'suppDelErr',
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries('suppliers');
    },
  });

  return mutate;
}
