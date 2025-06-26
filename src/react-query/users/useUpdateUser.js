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

async function updateUser(data) {
  const { itemdata } = await graphQLClient.request(
    gql`
      mutation UpdateUser(
        $u_id: ID
        $u_userid: String
        $u_name: String
        $u_email: String
        $u_password: String
        $u_lastlogindate: Date
        $u_level: String
        $u_usergroup: String
        $u_jobtitle: String
      ) {
        updateUser(
          u_id: $u_id
          u_userid: $u_userid
          u_name: $u_name
          u_email: $u_email
          u_password: $u_password
          u_lastlogindate: $u_lastlogindate
          u_level: $u_level
          u_usergroup: $u_usergroup
          u_jobtitle: $u_jobtitle
        ) {
          u_id
        }
      }
    `,
    data
  );
  return itemdata;
}

export function useUpdateUser(data) {
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: data => updateUser(data),
    onSuccess: () => {
      Toast({
        title: 'User being updated!',
        status: 'success',
        customId: 'userUpd',
      });
    },
    onError: () => {
      Toast({
        title: 'User Update Error! Please check your internet connection!',
        status: 'warning',
        customId: 'userUpdErr',
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries('users');
    },
  });

  return mutate;
}
