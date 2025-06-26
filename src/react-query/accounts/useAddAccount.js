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

async function addAccount(data) {
  const { itemdata } = await graphQLClient.request(
    gql`
      mutation AddAccount(
        $acc_code: String
        $acc_name: String
        $acc_cat: String
        $acc_type: String
        $acc_last_year: Float
        $acc_temp_bal: Float
        $acc_groupitem: Boolean
        $acc_class: String
      ) {
        addAccount(
          acc_code: $acc_code
          acc_name: $acc_name
          acc_cat: $acc_cat
          acc_type: $acc_type
          acc_last_year: $acc_last_year
          acc_temp_bal: $acc_temp_bal
          acc_groupitem: $acc_groupitem
          acc_class: $acc_class
        ) {
          acc_id
        }
      }
    `,
    data
  );
  return itemdata;
}

export function useAddAccount(data) {
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: data => addAccount(data),
    onSuccess: () => {
      Toast({
        title: 'New Account being added!',
        status: 'success',
        customId: 'accAdd',
      });
    },
    onError: () => {
      Toast({
        title: 'Account Add Error! Please check your internet connection!',
        status: 'warning',
        customId: 'accAddErr',
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries('accounts');
    },
  });

  return mutate;
}
