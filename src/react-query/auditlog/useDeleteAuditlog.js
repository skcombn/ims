import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../constants';
import { Toast } from '../../helpers/CustomToastify';
import { GraphQLClient, gql } from 'graphql-request';

//const API_URL = `http://localhost:4000/graphql`;
const API_URL = process.env.REACT_APP_API_URL;

const graphQLClient = new GraphQLClient(API_URL, {
  headers: {
    Authorization: `Bearer ${process.env.API_KEY}`,
  },
});

async function deleteAuditlog(data) {
  const { itemdata } = await graphQLClient.request(
    gql`
      mutation DeleteAuditlog($at_id: ID) {
        deleteAuditlog(at_id: $at_id) {
          at_id
        }
      }
    `,
    data
  );
  return itemdata;
}
export function useDeleteAuditlog(data) {
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: data => deleteAuditlog(data),
    onSuccess: () => {
      Toast({
        title: 'Auditlog being deleted!',
        status: 'warning',
        customId: 'auditdel',
      });
    },
    onError: () => {
      Toast({
        title: 'Auditlog Delete Error!',
        status: 'warning',
        customId: 'auditdelErr',
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries('auditlog');
    },
  });

  return mutate;
}
