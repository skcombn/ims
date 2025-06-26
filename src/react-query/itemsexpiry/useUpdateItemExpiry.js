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

async function updateItemExpiry(data) {
  const { itemdata } = await graphQLClient.request(
    gql`
      mutation UpdateItemExpiry(
        $ie_id: ID
        $ie_itemno: String
        $ie_lotno: String
        $ie_datereceived: Date
        $ie_location: String
        $ie_dateexpiry: Date
        $ie_pono: String
        $ie_podate: Date
        $ie_qtyonhand: Float
        $ie_qtyreceived: Float
        $ie_ucost: Float
        $ie_post: String
      ) {
        updateItemExpiry(
          ie_id: $ie_id
          ie_itemno: $ie_itemno
          ie_lotno: $ie_lotno
          ie_datereceived: $ie_datereceived
          ie_location: $ie_location
          ie_dateexpiry: $ie_dateexpiry
          ie_pono: $ie_pono
          ie_podate: $ie_podate
          ie_qtyonhand: $ie_qtyonhand
          ie_qtyreceived: $ie_qtyreceived
          ie_ucost: $ie_ucost
          ie_post: $ie_post
        ) {
          ie_id
        }
      }
    `,
    data
  );
  return itemdata;
}

export function useUpdateItemExpiry(data) {
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: data => updateItemExpiry(data),
    onSuccess: () => {
      Toast({
        title: 'Expiry Item being updated!',
        status: 'success',
        customId: 'itemexpupd',
      });
    },
    onError: () => {
      Toast({
        title: 'Expiry Item Update Error! ',
        status: 'warning',
        customId: 'itemexpupdErr',
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries('itemsexpiry');
    },
  });

  return mutate;
}
