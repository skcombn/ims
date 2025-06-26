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

async function addCustomer(data) {
  const { itemdata } = await graphQLClient.request(
    gql`
      mutation AddCustomer(
        $c_custno: String
        $c_cust: String
        $c_add1: String
        $c_add2: String
        $c_add3: String
        $c_add4: String
        $c_phone: String
        $c_fax: String
        $c_email: String
        $c_crlimit: Float
        $c_terms: Int
        $c_contact: String
        $c_post: String
        $c_glcode: String
        $c_branch: String
        $c_area: String
        $c_type: String
      ) {
        addCustomer(
          c_custno: $c_custno
          c_cust: $c_cust
          c_add1: $c_add1
          c_add2: $c_add2
          c_add3: $c_add3
          c_add4: $c_add4
          c_phone: $c_phone
          c_fax: $c_fax
          c_email: $c_email
          c_crlimit: $c_crlimit
          c_terms: $c_terms
          c_contact: $c_contact
          c_post: $c_post
          c_glcode: $c_glcode
          c_branch: $c_branch
          c_area: $c_area
          c_type: $c_type
        ) {
          c_id
        }
      }
    `,
    data
  );
  return itemdata;
}

export function useAddCustomer(data) {
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: data => addCustomer(data),
    onSuccess: () => {
      Toast({
        title: 'New Customer being added!',
        status: 'success',
        customId: 'CustAdd',
      });
    },
    onError: () => {
      Toast({
        title: 'Customer Add Error! Please check your internet connection!',
        status: 'warning',
        customId: 'CustAddErr',
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries('customers');
    },
  });

  return mutate;
}
