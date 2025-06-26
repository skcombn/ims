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

async function deleteSales(data) {
  const { itemdata } = await graphQLClient.request(
    gql`
      mutation DeleteSales($sls_id: ID) {
        deleteSales(sls_id: $sls_id) {
          sls_id
        }
      }
    `,
    data
  );
  return itemdata;
}

export function useDeleteSales(data) {
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: data => deleteSales(data),
    onSuccess: () => {
      Toast({
        title: 'Sales being deleted!',
        status: 'warning',
        customId: 'salesDel',
      });
    },
    onError: () => {
      Toast({
        title: 'Sales Delete Error! Please check your internet connection!',
        status: 'warning',
        customId: 'salesDelErr',
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries('sales');
    },
  });

  return mutate;
}
