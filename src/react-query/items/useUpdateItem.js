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

async function updateItem(data) {
  const { itemdata } = await graphQLClient.request(
    gql`
      mutation UpdateItem(
        $item_id: ID
        $item_no: String
        $item_desp: String
        $item_pack: String
        $item_group: String
        $item_unit: String
        $item_price: Float
        $item_cost: Float
        $item_qtyonhand: Float
        $item_minlvl: Float
        $item_pfactor: Float
        $item_brand: String
        $item_manufacturer: String
        $item_lotno: String
        $item_grade: String
        $item_location: String
        $item_condition: String
        $item_size: String
        $item_suppno: String
        $item_supplier: String
        $item_type: String
        $item_trackexpiry: Boolean
        $item_trackserial: Boolean
        $item_remark: String
        $item_productno: String
        $item_inactive: Boolean
        $item_cat: String
      ) {
        updateItem(
          item_id: $item_id
          item_no: $item_no
          item_desp: $item_desp
          item_pack: $item_pack
          item_group: $item_group
          item_unit: $item_unit
          item_price: $item_price
          item_cost: $item_cost
          item_qtyonhand: $item_qtyonhand
          item_minlvl: $item_minlvl
          item_pfactor: $item_pfactor
          item_brand: $item_brand
          item_manufacturer: $item_manufacturer
          item_lotno: $item_lotno
          item_grade: $item_grade
          item_location: $item_location
          item_condition: $item_condition
          item_size: $item_size
          item_suppno: $item_suppno
          item_supplier: $item_supplier
          item_type: $item_type
          item_trackexpiry: $item_trackexpiry
          item_trackserial: $item_trackserial
          item_remark: $item_remark
          item_productno: $item_productno
          item_inactive: $item_inactive
          item_cat: $item_cat
        ) {
          item_id
        }
      }
    `,
    data
  );
  return itemdata;
}
export function useUpdateItem(data) {
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: data => updateItem(data),
    onSuccess: () => {
      Toast({
        title: 'Item being updated!',
        status: 'success',
        customId: 'itemupd',
      });
    },
    onError: () => {
      Toast({
        title: 'Item Update Error! ',
        status: 'warning',
        customId: 'itemupdErr',
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries('items');
    },
  });

  return mutate;
}
