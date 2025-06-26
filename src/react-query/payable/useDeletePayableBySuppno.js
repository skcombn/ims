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

async function deletePayableBySuppno(data) {
  const { itemdata } = await graphQLClient.request(
    gql`
      mutation DeletePayableBySuppno($ap_suppno: String) {
        deletePayableBySuppno(ap_suppno: $ap_suppno) {
          ap_id
        }
      }
    `,
    data
  );
  return itemdata;
}

export function useDeletePayableBySuppno(data) {
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: data => deletePayableBySuppno(data),
    onSuccess: () => {
      Toast({
        title: 'Payable being deleted!',
        status: 'warning',
        customId: 'payableDel',
      });
    },
    onError: () => {
      Toast({
        title: 'Payable Delete Error! Please check your internet connection!',
        status: 'warning',
        customId: 'payableDelErr',
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries('payable');
    },
  });

  return mutate;
}
