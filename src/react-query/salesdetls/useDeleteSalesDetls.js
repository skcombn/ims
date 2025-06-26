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

async function deleteSalesDetls(data) {
  const { itemdata } = await graphQLClient.request(
    gql`
      mutation DeleteSalesDetls($sld_id: ID) {
        deleteSalesDetls(sld_id: $sld_id) {
          sld_id
        }
      }
    `,
    data
  );
  return itemdata;
}

export function useDeleteSalesDetls(data) {
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: data => deleteSalesDetls(data),
    onSuccess: () => {
      Toast({
        title: 'Sales Details being deleted!',
        status: 'warning',
        customId: 'salesdetlDel',
      });
    },
    onError: () => {
      Toast({
        title:
          'Sales Details Delete Error! Please check your internet connection!',
        status: 'warning',
        customId: 'salesdetlDelErr',
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries('salesdetls');
    },
  });

  return mutate;
}
