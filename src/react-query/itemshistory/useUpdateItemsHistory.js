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

async function updateItemHistory(data) {
  const { itemdata } = await graphQLClient.request(
    gql`
      mutation UpdateItemHistory(
        $it_id: ID
        $it_transno: String
        $it_itemno: String
        $it_transdate: Date
        $it_qty: Float
        $it_value: Float
        $it_disc: Float
        $it_netvalue: Float
        $it_extvalue: Float
        $it_pfactor: Float
        $it_transtype: String
        $it_scno: String
        $it_sc: String
        $it_branch: String
        $it_postdate: Date
        $it_remark: String
        $it_desp: String
        $it_packing: String
        $it_lotno: String
      ) {
        updateItemHistory(
          it_id: $it_id
          it_transno: $it_transno
          it_itemno: $it_itemno
          it_transdate: $it_transdate
          it_qty: $it_qty
          it_value: $it_value
          it_disc: $it_disc
          it_netvalue: $it_netvalue
          it_extvalue: $it_extvalue
          it_pfactor: $it_pfactor
          it_transtype: $it_transtype
          it_scno: $it_scno
          it_sc: $it_sc
          it_branch: $it_branch
          it_postdate: $it_postdate
          it_remark: $it_remark
          it_desp: $it_desp
          it_packing: $it_packing
          it_lotno: $it_lotno
        ) {
          it_id
        }
      }
    `,
    data
  );
  return itemdata;
}

export function useUpdateItemsHistory(data) {
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: data => updateItemHistory(data),
    onSuccess: () => {
      Toast({
        title: 'Item history being updated!',
        status: 'success',
        customId: 'itemhistupd',
      });
    },
    onError: () => {
      Toast({
        title: 'Item History Update Error! ',
        status: 'warning',
        customId: 'itemhistupdErr',
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries('itemshistory');
    },
  });

  return mutate;
}
