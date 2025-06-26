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

async function addTranDetls(data) {
  const { itemdata } = await graphQLClient.request(
    gql`
      mutation AddTranItem(
        $tl_tranno: String
        $tl_type: String
        $tl_itemno: String
        $tl_qty: Float
        $tl_ucost: Float
        $tl_unit: String
        $tl_desp: String
        $tl_packing: String
        $tl_pfactor: Float
        $tl_netucost: Float
        $tl_disc: Float
        $tl_amount: Float
        $tl_remark: String
        $tl_order: Int
        $tl_branch: String
        $tl_lotno: String
        $tl_dateexpiry: Date
        $tl_trackexpiry: Boolean
        $tl_uprice: Float
        $tl_location: String
        $tl_uoldcost: Float
        $tl_brand: String
        $tl_trantype: String
        $tl_post: String
        $tl_trandate: Date
        $tl_trackserial: Boolean
      ) {
        addTranItem(
          tl_tranno: $tl_tranno
          tl_type: $tl_type
          tl_itemno: $tl_itemno
          tl_qty: $tl_qty
          tl_ucost: $tl_ucost
          tl_unit: $tl_unit
          tl_desp: $tl_desp
          tl_packing: $tl_packing
          tl_pfactor: $tl_pfactor
          tl_netucost: $tl_netucost
          tl_disc: $tl_disc
          tl_amount: $tl_amount
          tl_remark: $tl_remark
          tl_order: $tl_order
          tl_branch: $tl_branch
          tl_lotno: $tl_lotno
          tl_dateexpiry: $tl_dateexpiry
          tl_trackexpiry: $tl_trackexpiry
          tl_uprice: $tl_uprice
          tl_location: $tl_location
          tl_uoldcost: $tl_uoldcost
          tl_brand: $tl_brand
          tl_trantype: $tl_trantype
          tl_post: $tl_post
          tl_trandate: $tl_trandate
          tl_trackserial: $tl_trackserial
        ) {
          tl_id
        }
      }
    `,
    data
  );
  return itemdata;
}

export function useAddTranDetls(data) {
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: data => addTranDetls(data),
    onSuccess: () => {
      Toast({
        title: 'New Transaction details being added!',
        status: 'success',
        customId: 'trandetlAdd',
      });
    },
    onError: () => {
      Toast({
        title: 'Transaction details Add Error!',
        status: 'warning',
        customId: 'trandetlAddErr',
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries('transdetls');
    },
  });

  return mutate;
}
