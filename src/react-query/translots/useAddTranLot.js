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

async function addTranslot(data) {
  const { itemdata } = await graphQLClient.request(
    gql`
      mutation AddTranslot(
        $tl_tranno: String
        $tl_type: String
        $tl_itemno: String
        $tl_lotno: String
        $tl_datereceived: Date
        $tl_location: String
        $tl_dateexpiry: Date
        $tl_pono: String
        $tl_podate: Date
        $tl_qtyonhand: Float
        $tl_qtyreceived: Float
        $tl_ucost: Float
        $tl_post: String
        $tl_qty: Float
        $tl_trantype: String
      ) {
        addTranslot(
          tl_tranno: $tl_tranno
          tl_type: $tl_type
          tl_itemno: $tl_itemno
          tl_lotno: $tl_lotno
          tl_datereceived: $tl_datereceived
          tl_location: $tl_location
          tl_dateexpiry: $tl_dateexpiry
          tl_pono: $tl_pono
          tl_podate: $tl_podate
          tl_qtyonhand: $tl_qtyonhand
          tl_qtyreceived: $tl_qtyreceived
          tl_ucost: $tl_ucost
          tl_post: $tl_post
          tl_qty: $tl_qty
          tl_trantype: $tl_trantype
        ) {
          tl_id
        }
      }
    `,
    data
  );
  return itemdata;
}

export function useAddTranLot(data) {
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: data => addTranslot(data),
    onSuccess: () => {
      Toast({
        title: 'New Transaction lot being added!',
        status: 'success',
        customId: 'tranlotAdd',
      });
    },
    onError: () => {
      Toast({
        title: 'Transaction lot Add Error!',
        status: 'warning',
        customId: 'tranlotAddErr',
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries('translots');
    },
  });

  return mutate;
}
