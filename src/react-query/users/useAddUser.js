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

async function addUser(data) {
  const { itemdata } = await graphQLClient.request(
    gql`
      mutation AddUser(
        $u_userid: String
        $u_name: String
        $u_email: String
        $u_password: String
        $u_lastlogindate: Date
        $u_level: String
        $u_usergroup: String
        $u_jobtitle: String
      ) {
        addUser(
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

export function useAddUser(data) {
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: data => addUser(data),
    onSuccess: () => {
      Toast({
        title: 'New User being added!',
        status: 'success',
        customId: 'userAdd',
      });
    },
    onError: () => {
      Toast({
        title: 'User Add Error! Please check your internet connection!',
        status: 'warning',
        customId: 'userAddErr',
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries('users');
    },
  });

  return mutate;
}
