import { useMutation, useQueryClient } from '@tanstack/react-query';
//import { items_url } from '../../utils/constants';
//import { useCustomToast } from '../../helpers/useCustomToast';
import { GraphQLClient, gql } from 'graphql-request';
import { Toast } from '../../helpers/CustomToastify';

//const API_URL = `http://localhost:4000/graphql`;
const API_URL = process.env.REACT_APP_API_URL;

const graphQLClient = new GraphQLClient(API_URL);

async function updateStktakedetls(data) {
  const { itemdata } = await graphQLClient.request(
    gql`
      mutation UpdateStktakedetls(
        $std_id: Int
        $std_batchno: String
        $std_itemno: String
        $std_desp: String
        $std_packing: String
        $std_qty: Int
        $std_price: Float
      ) {
        updateStktakeDetls(
          std_id: $std_id
          std_batchno: $std_batchno
          std_itemno: $std_itemno
          std_desp: $std_desp
          std_packing: $std_packing
          std_qty: $std_qty
          std_price: $std_price
        ) {
          std_id
        }
      }
    `,
    data
  );
  return itemdata;
}

export function useUpdateStktakedetls(data) {
  const queryClient = useQueryClient();
  //const toast = useCustomToast();

  const { mutate } = useMutation({
    mutationFn: data => updateStktakedetls(data),
    onSuccess: () => {
      /*   Toast({
        title: 'Stock Take Details Batch  being updated!',
        status: 'success',
        customId: 'stktakedetlsbatchUpd',
      }); */
    },
    onError: () => {
      Toast({
        title:
          'Stock Take Batch Details Update Error! Please check your internet connection!',
        status: 'warning',
        customId: 'stktakedetlsUpdErr',
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries('stktakedetls');
    },
  });

  return mutate;
}
