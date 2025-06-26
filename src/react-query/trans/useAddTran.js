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

async function addTran(data) {
  const { itemdata } = await graphQLClient.request(
    gql`
      mutation AddTran(
        $t_no: String
        $t_date: Date
        $t_type: String
        $t_docno: String
        $t_docdate: Date
        $t_scno: String
        $t_sc: String
        $t_add1: String
        $t_add2: String
        $t_add3: String
        $t_add4: String
        $t_term: Int
        $t_branch: String
        $t_remark: String
        $t_post: String
        $t_print: String
        $t_subtotal: Float
        $t_disc: Float
        $t_nettotal: Float
        $t_layout: String
        $t_postdate: Date
        $t_glcode: String
        $t_recdate: Date
        $t_createdby: String
        $t_updby: String
        $t_createddate: Date
        $t_createdtime: String
        $t_upddate: Date
        $t_updtime: String
        $t_dono: String
        $t_name: String
        $t_section: String
        $t_dodate: Date
      ) {
        addTran(
          t_no: $t_no
          t_date: $t_date
          t_type: $t_type
          t_docno: $t_docno
          t_docdate: $t_docdate
          t_scno: $t_scno
          t_sc: $t_sc
          t_add1: $t_add1
          t_add2: $t_add2
          t_add3: $t_add3
          t_add4: $t_add4
          t_term: $t_term
          t_branch: $t_branch
          t_remark: $t_remark
          t_post: $t_post
          t_print: $t_print
          t_subtotal: $t_subtotal
          t_disc: $t_disc
          t_nettotal: $t_nettotal
          t_layout: $t_layout
          t_postdate: $t_postdate
          t_glcode: $t_glcode
          t_recdate: $t_recdate
          t_createdby: $t_createdby
          t_updby: $t_updby
          t_createddate: $t_createddate
          t_createdtime: $t_createdtime
          t_upddate: $t_upddate
          t_updtime: $t_updtime
          t_dono: $t_dono
          t_name: $t_name
          t_section: $t_section
          t_dodate: $t_dodate
        ) {
          t_id
        }
      }
    `,
    data
  );
  return itemdata;
}
export function useAddTran(data) {
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: data => addTran(data),
    onSuccess: () => {
      Toast({
        title: 'New Transaction being added!',
        status: 'success',
        customId: 'tranAdd',
      });
    },
    onError: () => {
      Toast({
        title: 'Transaction Add Error!',
        status: 'warning',
        customId: 'tranAddErr',
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries('transactions');
    },
  });

  return mutate;
}
