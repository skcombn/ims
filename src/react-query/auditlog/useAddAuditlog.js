import { useMutation, useQueryClient } from '@tanstack/react-query';
//import { items_url } from '../../utils/constants';
//import { useCustomToast } from '../../helpers/useCustomToast';
import { GraphQLClient, gql } from 'graphql-request';
import { Toast } from '../../helpers/CustomToastify';

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
        $al_userid: String
        $al_user: String
        $al_date: Date
        $al_time: String
        $al_timestr: String
        $al_module: String
        $al_action: String
        $al_record: String
        $al_remark: String
      ) {
        addAuditlog(
          al_userid: $al_userid
          al_user: $al_user
          al_date: $al_date
          al_time: $al_time
          al_timestr: $al_timestr
          al_module: $al_module
          al_action: $al_action
          al_record: $al_record
          al_remark: $al_remark
        ) {
          al_id
        }
      }
    `,
    data
  );
  return itemdata;
}

export function useAddAuditlog(data) {
  const queryClient = useQueryClient();
  //const toast = useCustomToast();

  const { mutate } = useMutation({
    mutationFn: data => addAuditlog(data),
    onSuccess: () => {
      Toast({
        title: 'New audit log being added!',
        status: 'success',
        customId: 'auditlogAdd',
      });
    },
    onError: () => {
      Toast({
        title: 'Auditlog Add Error! Please check your internet connection!',
        status: 'warning',
        customId: 'auditlogAddErr',
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries('auditlog');
    },
  });

  return mutate;
}
