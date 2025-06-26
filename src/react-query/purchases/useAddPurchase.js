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

async function addPurchase(data) {
  const { itemdata } = await graphQLClient.request(
    gql`
      mutation AddPurchase(
        $po_no: String
        $po_date: Date
        $po_type: String
        $po_suppno: String
        $po_supp: String
        $po_add1: String
        $po_add2: String
        $po_add3: String
        $po_tel: String
        $po_term: Int
        $po_invno: String
        $po_remark: String
        $po_post: String
        $po_print: String
        $po_subtotal: Float
        $po_disc: Float
        $po_nettotal: Float
        $po_layout: String
        $po_postdate: Date
        $po_glcode: String
        $po_dodate: Date
        $po_invdate: Date
        $po_recdate: Date
        $po_sono: String
        $po_createdby: String
        $po_updby: String
        $po_createddate: Date
        $po_createdtime: String
        $po_upddate: Date
        $po_updtime: String
        $po_oref: String
        $po_yref: String
        $po_area: String
        $po_loc: String
        $po_age: Int
      ) {
        addPurchase(
          po_no: $po_no
          po_date: $po_date
          po_type: $po_type
          po_suppno: $po_suppno
          po_supp: $po_supp
          po_add1: $po_add1
          po_add2: $po_add2
          po_add3: $po_add3
          po_tel: $po_tel
          po_term: $po_term
          po_invno: $po_invno
          po_remark: $po_remark
          po_post: $po_post
          po_print: $po_print
          po_subtotal: $po_subtotal
          po_disc: $po_disc
          po_nettotal: $po_nettotal
          po_layout: $po_layout
          po_postdate: $po_postdate
          po_glcode: $po_glcode
          po_dodate: $po_dodate
          po_invdate: $po_invdate
          po_recdate: $po_recdate
          po_sono: $po_sono
          po_createdby: $po_createdby
          po_updby: $po_updby
          po_createddate: $po_createddate
          po_createdtime: $po_createdtime
          po_upddate: $po_upddate
          po_updtime: $po_updtime
          po_oref: $po_oref
          po_yref: $po_yref
          po_area: $po_area
          po_loc: $po_loc
          po_age: $po_age
        ) {
          po_no
        }
      }
    `,
    data
  );
  return itemdata;
}

export function useAddPurchase(data) {
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: data => addPurchase(data),
    onSuccess: () => {
      Toast({
        title: 'New Purchase being added!',
        status: 'success',
        customId: 'poAdd',
      });
    },
    onError: () => {
      Toast({
        title: 'Purchase Add Error! Please check your internet connection!',
        status: 'warning',
        customId: 'poAddErr',
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries('purchases');
    },
  });

  return mutate;
}
