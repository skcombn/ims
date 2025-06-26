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

async function updateSupplier(data) {
  const { itemdata } = await graphQLClient.request(
    gql`
      mutation UpdateSupplier(
        $s_id: ID
        $s_suppno: String
        $s_supp: String
        $s_add1: String
        $s_add2: String
        $s_add3: String
        $s_add4: String
        $s_phone: String
        $s_fax: String
        $s_email: String
        $s_contact: String
        $s_crlimit: Float
        $s_terms: Int
        $s_glcode: String
        $s_branch: String
        $s_bankname: String
        $s_bankacno: String
      ) {
        updateSupplier(
          s_id: $s_id
          s_suppno: $s_suppno
          s_supp: $s_supp
          s_add1: $s_add1
          s_add2: $s_add2
          s_add3: $s_add3
          s_add4: $s_add4
          s_phone: $s_phone
          s_fax: $s_fax
          s_email: $s_email
          s_contact: $s_contact
          s_crlimit: $s_crlimit
          s_terms: $s_terms
          s_glcode: $s_glcode
          s_branch: $s_branch
          s_bankname: $s_bankname
          s_bankacno: $s_bankacno
        ) {
          s_id
        }
      }
    `,
    data
  );
  return itemdata;
}

export function useUpdateSupplier(data) {
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: data => updateSupplier(data),
    onSuccess: () => {
      Toast({
        title: 'Supplier being updated!',
        status: 'success',
        customId: 'suppUpd',
      });
    },
    onError: () => {
      Toast({
        title: 'Supplier Update Error! Please check your internet connection!',
        status: 'warning',
        customId: 'suppUpdErr',
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries('suppliers');
    },
  });

  return mutate;
}
