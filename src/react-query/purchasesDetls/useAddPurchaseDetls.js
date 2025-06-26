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

async function addPurchaseDetls(data) {
  const { itemdata } = await graphQLClient.request(
    gql`
      mutation AddPurchaseDetls(
        $pl_pono: String
        $pl_type: String
        $pl_itemno: String
        $pl_desp: String
        $pl_pack: String
        $pl_qty: Float
        $pl_ucost: Float
        $pl_unit: String
        $pl_pfactor: Float
        $pl_netucost: Float
        $pl_disc: Float
        $pl_excost: Float
        $pl_remark: String
        $pl_order: Int
        $pl_uoldcost: Float
        $pl_brand: String
        $pl_store: String
        $pl_upd: Boolean
        $pl_podate: Date
      ) {
        addPurchaseDetls(
          pl_pono: $pl_pono
          pl_type: $pl_type
          pl_itemno: $pl_itemno
          pl_desp: $pl_desp
          pl_pack: $pl_pack
          pl_qty: $pl_qty
          pl_ucost: $pl_ucost
          pl_unit: $pl_unit
          pl_pfactor: $pl_pfactor
          pl_netucost: $pl_netucost
          pl_disc: $pl_disc
          pl_excost: $pl_excost
          pl_remark: $pl_remark
          pl_order: $pl_order
          pl_uoldcost: $pl_uoldcost
          pl_brand: $pl_brand
          pl_store: $pl_store
          pl_upd: $pl_upd
          pl_podate: $pl_podate
        ) {
          pl_pono
        }
      }
    `,
    data
  );
  return itemdata;
}

export function useAddPurchaseDetls(data) {
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: data => addPurchaseDetls(data),
    onSuccess: () => {
      Toast({
        title: 'New Purchase Details being added!',
        status: 'success',
        customId: 'podetlAdd',
      });
    },
    onError: () => {
      Toast({
        title:
          'Purchase Details Add Error! Please check your internet connection!',
        status: 'warning',
        customId: 'podetlAddErr',
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries('purchasesdetails');
    },
  });

  return mutate;
}
