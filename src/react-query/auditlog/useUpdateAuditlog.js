import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../constants';
import { Toast } from '../../helpers/CustomToastify';
import { GraphQLClient, gql } from 'graphql-request';

const API_URL = process.env.REACT_APP_API_URL;

const graphQLClient = new GraphQLClient(API_URL, {
  headers: {
    Authorization: `Bearer ${process.env.API_KEY}`,
  },
});

async function updateAuditlog(data) {
  const { itemdata } = await graphQLClient.request(
    gql`
      mutation UpdateAuditlog(
        $at_id: ID
        $at_userid: String
        $at_user: String
        $at_date: Date
        $at_time: String
        $at_module: String
        $at_record: String
        $at_remark: String
        $at_timestr: String
      ) {
        updateAuditlog(
          at_id: $at_id
          at_userid: $at_userid
          at_user: $at_user
          at_date: $at_date
          at_time: $at_time
          at_module: $at_module
          at_record: $at_record
          at_remark: $at_remark
          at_timestr: $at_timestr
        ) {
          at_id
        }
      }
    `,
    data
  );
  return itemdata;
}

export function useUpdateAuditlog(data) {
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: data => updateAuditlog(data),
    onSuccess: () => {
      Toast({
        title: 'Auditlog being updated!',
        status: 'success',
        customId: 'auditupd',
      });
    },
    onError: () => {
      Toast({
        title: 'Auditlog Update Error! ',
        status: 'warning',
        customId: 'auditupdErr',
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries('auditlog');
    },
  });

  return mutate;
}
