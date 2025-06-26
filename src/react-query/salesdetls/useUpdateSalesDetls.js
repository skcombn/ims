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

async function updateSalesDetls(data) {
  const { itemdata } = await graphQLClient.request(
    gql`
      mutation UpdateSalesDetls(
        $sld_id: ID
        $sld_no: String
        $sld_itemno: String
        $sld_desp: String
        $sld_pack: String
        $sld_pfactor: Float
        $sld_qty: Float
        $sld_unit: String
        $sld_price: Float
        $sld_total: Float
        $sld_acc: String
        $sld_order: Int
        $sld_sitemno: String
        $sld_ucost: Float
        $sld_itemtype: String
        $sld_error: Boolean
        $sld_type: String
        $sld_brand: String
        $sld_store: String
        $sld_custno: String
        $sld_ctype: String
        $sld_tqty: String
        $sld_upd: Boolean
        $sld_date: Date
      ) {
        updateSalesDetls(
          sld_id: $sld_id
          sld_no: $sld_no
          sld_itemno: $sld_itemno
          sld_desp: $sld_desp
          sld_pack: $sld_pack
          sld_pfactor: $sld_pfactor
          sld_qty: $sld_qty
          sld_unit: $sld_unit
          sld_price: $sld_price
          sld_total: $sld_total
          sld_acc: $sld_acc
          sld_order: $sld_order
          sld_sitemno: $sld_sitemno
          sld_ucost: $sld_ucost
          sld_itemtype: $sld_itemtype
          sld_error: $sld_error
          sld_type: $sld_type
          sld_brand: $sld_brand
          sld_store: $sld_store
          sld_custno: $sld_custno
          sld_ctype: $sld_ctype
          sld_tqty: $sld_tqty
          sld_upd: $sld_upd
          sld_date: $sld_date
        ) {
          sld_no
        }
      }
    `,
    data
  );
  return itemdata;
}

export function useUpdateSalesDetls(data) {
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: data => updateSalesDetls(data),
    onSuccess: () => {
      Toast({
        title: 'Sales Details being updated!',
        status: 'success',
        customId: 'salesdetlUpd',
      });
    },
    onError: () => {
      Toast({
        title:
          'Sales Details Update Error! Please check your internet connection!',
        status: 'warning',
        customId: 'salesdetlUpdErr',
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries('salesdetls');
    },
  });

  return mutate;
}
