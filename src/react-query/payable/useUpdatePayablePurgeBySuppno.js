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

async function updatePayablePurgeBySuppno(data) {
  const { itemdata } = await graphQLClient.request(
    gql`
      mutation UpdatePayablePurgeBySuppno(
        $ap_suppno: String
        $ap_purge: Boolean
      ) {
        updatePayablePurgeBySuppno(ap_suppno: $ap_suppno, ap_purge: $ap_purge) {
          ap_pono
        }
      }
    `,
    data
  );
  return itemdata;
}

export function useUpdatePayablePurgeBySuppno(data) {
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: data => updatePayablePurgeBySuppno(data),
    onSuccess: () => {
      Toast({
        title: 'Payable being updated!',
        status: 'success',
        customId: 'payableUpd',
      });
    },
    onError: () => {
      Toast({
        title: 'Payable Update Error! Please check your internet connection!',
        status: 'warning',
        customId: 'payableUpdErr',
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries('payable');
    },
  });

  return mutate;
}
