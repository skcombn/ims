import { useMutation, useQueryClient } from '@tanstack/react-query';
//import { items_url } from '../../utils/constants';
import { Toast } from '../../helpers/CustomToastify';
import { GraphQLClient, gql } from 'graphql-request';

//const API_URL = `http://localhost:4000/graphql`;
const API_URL = process.env.REACT_APP_API_URL;
const graphQLClient = new GraphQLClient(API_URL, {
  headers: {
    Authorization: `Bearer ${process.env.API_KEY}`,
  },
});

async function addItemsOnhand(data) {
  const { itemdata } = await graphQLClient.request(
    gql`
      mutation AddItemsOnhand(
        $item_no: String
        $item_branch: String
        $item_qoh_pc: Float
        $item_qoh_ctn: Float
        $item_ucost_pc: Float
        $item_ucost_ctn: Float
        $item_onorder_pc: Float
        $item_onorder_ctn: Float
        $item_uprice_pc: Float
        $item_uprice_ctn: Float
        $item_remark: String
        $item_pfactor: Float
        $item_outlet_pc: Float
        $item_outlet_ctn: Float
        $item_offeruprice: Float
        $item_cooluprice: Float
        $item_minlvlqty: Float
        $item_suppno: String
        $item_supplier: String
        $item_openqty: Float
        $item_openamt: Float
        $item_updated: Date
        $item_lastsalesdate: Date
        $item_lastpodate: Date
        $item_lastpoqty: Float
        $item_lastsalesqty: Float
        $item_inactive: Boolean
        $item_olducost: Float
        $item_memuprice: Float
        $item_allowposaddon: Boolean
      ) {
        addItemsOnhand(
          item_no: $item_no
          item_branch: $item_branch
          item_qoh_pc: $item_qoh_pc
          item_qoh_ctn: $item_qoh_ctn
          item_ucost_pc: $item_ucost_pc
          item_ucost_ctn: $item_ucost_ctn
          item_onorder_pc: $item_onorder_pc
          item_onorder_ctn: $item_onorder_ctn
          item_uprice_pc: $item_uprice_pc
          item_uprice_ctn: $item_uprice_ctn
          item_remark: $item_remark
          item_pfactor: $item_pfactor
          item_outlet_pc: $item_outlet_pc
          item_outlet_ctn: $item_outlet_ctn
          item_offeruprice: $item_offeruprice
          item_cooluprice: $item_cooluprice
          item_minlvlqty: $item_minlvlqty
          item_suppno: $item_suppno
          item_supplier: $item_supplier
          item_openqty: $item_openqty
          item_openamt: $item_openamt
          item_updated: $item_updated
          item_lastsalesdate: $item_lastsalesdate
          item_lastpodate: $item_lastpodate
          item_lastpoqty: $item_lastpoqty
          item_lastsalesqty: $item_lastsalesqty
          item_inactive: $item_inactive
          item_olducost: $item_olducost
          item_memuprice: $item_memuprice
          item_allowposaddon: $item_allowposaddon
        ) {
          item_no
        }
      }
    `,
    data
  );
  return itemdata;
}

export function useAddItemsOnhand(data) {
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: data => addItemsOnhand(data),
    onSuccess: () => {
      Toast({
        title: 'New items onhand being added!',
        status: 'success',
        customId: 'itemonhandAdd',
      });
    },
    onError: () => {
      Toast({
        title: 'Item Onhand Add Error! Please check your internet connection!',
        status: 'warning',
        customId: 'itemonhandAddErr',
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries('itemsonhand');
    },
  });

  return mutate;
}
