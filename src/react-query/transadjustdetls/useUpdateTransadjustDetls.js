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

async function updateTranadjdetls(data) {
  const { itemdata } = await graphQLClient.request(
    gql`
      mutation UpdateTranadjdetls(
        $tad_id: ID
        $tad_batchno: String
        $tad_itemno: String
        $tad_desp: String
        $tad_packing: String
        $tad_qtyonhand: Float
        $tad_qtycount: Float
        $tad_qtyadjust: Float
        $tad_branch: String
        $tad_unit: String
        $tad_trackexpiry: Boolean
      ) {
        updateTranadjdetls(
          tad_id: $tad_id
          tad_batchno: $tad_batchno
          tad_itemno: $tad_itemno
          tad_desp: $tad_desp
          tad_packing: $tad_packing
          tad_qtyonhand: $tad_qtyonhand
          tad_qtycount: $tad_qtycount
          tad_qtyadjust: $tad_qtyadjust
          tad_branch: $tad_branch
          tad_unit: $tad_unit
          tad_trackexpiry: $tad_trackexpiry
        ) {
          tad_id
        }
      }
    `,
    data
  );
  return itemdata;
}

export function useUpdateTransadjustDetls(data) {
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: data => updateTranadjdetls(data),
    onSuccess: () => {
      Toast({
        title: 'Transaction adjustment details being updated!',
        status: 'success',
        customId: 'tranadjdetlupd',
      });
    },
    onError: () => {
      Toast({
        title: 'Transaction adjustment details Update Error! ',
        status: 'warning',
        customId: 'tranadjdetlupdErr',
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries('tranadjustdetls');
    },
  });

  return mutate;
}
