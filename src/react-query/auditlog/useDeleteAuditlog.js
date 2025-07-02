import { useMutation, useQueryClient } from '@tanstack/react-query';
//import { items_url } from '../../utils/constants';
//import { useCustomToast } from '../../helpers/useCustomToast';
import { GraphQLClient, gql } from 'graphql-request';
import { Toast } from '../../helpers/CustomToastify';

const API_URL = process.env.REACT_APP_API_URL;

const graphQLClient = new GraphQLClient(API_URL, {
  headers: {
    Authorization: `Bearer ${process.env.API_KEY}`,
  },
});

async function deleteAuditlog(data) {
  const { itemdata } = await graphQLClient.request(
    gql`
      mutation DeleteAuditlog($al_id: ID) {
        deleteAuditlog(al_id: $al_id) {
          al_id
        }
      }
    `,
    data
  );
  return itemdata;
}

export function useDeleteAuditlog(data) {
  const queryClient = useQueryClient();
  //const toast = useCustomToast();

  const { mutate } = useMutation({
    mutationFn: data => deleteAuditlog(data),
    onSuccess: () => {
      Toast({
        title: 'Auditlog being deleted!',
        status: 'warning',
        customId: 'auditDel',
      });
    },
    onError: () => {
      Toast({
        title: 'Auditlog Delete Error! Please check your internet connection!',
        status: 'warning',
        customId: 'auditDelErr',
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries('auditlog');
    },
  });

  return mutate;
}
