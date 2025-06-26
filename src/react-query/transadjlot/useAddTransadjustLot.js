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

async function addTranadjlot(data) {
  const { itemdata } = await graphQLClient.request(
    gql`
      mutation AddTranadjlot(
        $tal_batchno: String
        $tal_itemno: String
        $tal_lotno: String
        $tal_pono: String
        $tal_expirydate: Date
        $tal_qtyonhand: Float
        $tal_qtycount: Float
        $tal_qtyadjust: Float
      ) {
        addTranadjlot(
          tal_batchno: $tal_batchno
          tal_itemno: $tal_itemno
          tal_lotno: $tal_lotno
          tal_pono: $tal_pono
          tal_expirydate: $tal_expirydate
          tal_qtyonhand: $tal_qtyonhand
          tal_qtycount: $tal_qtycount
          tal_qtyadjust: $tal_qtyadjust
        ) {
          tal_id
        }
      }
    `,
    data
  );
  return itemdata;
}

export function useAddTransAdjustLot(data) {
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: data => addTranadjlot(data),
    onSuccess: () => {
      Toast({
        title: 'New Transaction Adjustment lot being added!',
        status: 'success',
        customId: 'tranadjlotAdd',
      });
    },
    onError: () => {
      Toast({
        title: 'Transaction adjustment lot Add Error!',
        status: 'warning',
        customId: 'tranadjustlotAddErr',
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries('tranadjustlot');
    },
  });

  return mutate;
}
