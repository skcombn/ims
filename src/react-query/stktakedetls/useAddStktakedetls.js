import { useMutation, useQueryClient } from '@tanstack/react-query';
//import { items_url } from '../../utils/constants';
import { useCustomToast } from '../../helpers/useCustomToast';
import { GraphQLClient, gql } from 'graphql-request';
import { Toast } from '../../helpers/CustomToastify';

//const API_URL = `http://localhost:4000/graphql`;
const API_URL = process.env.REACT_APP_API_URL;

const graphQLClient = new GraphQLClient(API_URL);

async function addStktakedetls(data) {
  const { itemdata } = await graphQLClient.request(
    gql`
      mutation AddStktakeDetls(
        $std_batchno: String
        $std_itemno: String
        $std_desp: String
        $std_packing: String
        $std_qty: Float
        $std_price: Float
      ) {
        addStktakeDetls(
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

export function useAddStktakedetls(data) {
  const queryClient = useQueryClient();
  //const toast = useCustomToast();

  const { mutate } = useMutation({
    mutationFn: data => addStktakedetls(data),
    onSuccess: () => {
      /*   Toast({
        title: 'New StockTake Details Batch being added!',
        status: 'success',
        customId: 'stktakedetlsbatchAdd',
      }); */
    },
    onError: () => {
      Toast({
        title:
          'Stock Take Batch Details Add Error! Please check your internet connection!',
        status: 'warning',
        customId: 'stktakedetlsAddErr',
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries('stktakedetls');
    },
  });

  return mutate;
}
