import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../constants';
import { Toast } from '../../helpers/CustomToastify';
import { GraphQLClient, gql } from 'graphql-request';

const API_URL = process.env.REACT_APP_API_URL;
//const API_URL = `http://localhost:4000/graphql`;
const graphQLClient = new GraphQLClient(API_URL, {
  headers: {
    Authorization: `Bearer ${process.env.API_KEY}`,
  },
});

async function addAuditlog(data) {
  const { itemdata } = await graphQLClient.request(
    gql`
      mutation AddAuditlog(
        $at_userid: String
        $at_user: String
        $at_date: Date
        $at_time: String
        $at_module: String
        $at_record: String
        $at_remark: String
        $at_timestr: String
      ) {
        addAuditlog(
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

export function useAddAuditlog(data) {
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: data => addAuditlog(data),
    onSuccess: () => {
      Toast({
        title: 'New Auditlog being added!',
        status: 'success',
        customId: 'auditAdd',
      });
    },
    onError: () => {
      Toast({
        title: 'Auditlog Add Error!',
        status: 'warning',
        customId: 'auditAddErr',
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries('auditlog');
    },
  });

  return mutate;
}
