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

async function updateDocStktake(data) {
  const { itemdata } = await graphQLClient.request(
    gql`
      mutation UpdateDocStktake($doc_id: ID, $doc_no: Int, $doc_abbre: String) {
        updateDocStktake(
          doc_id: $doc_id
          doc_no: $doc_no
          doc_abbre: $doc_abbre
        ) {
          doc_id
        }
      }
    `,
    data
  );
  return itemdata;
}

export function useUpdateDocStktake(data) {
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: data => updateDocStktake(data),
    onSuccess: () => {
      queryClient.invalidateQueries('docstktake');
      Toast({
        title: 'Stocktake No being updated!',
        status: 'success',
        customId: 'docUpdstktake',
      });
    },
    onError: () => {
      Toast({
        title:
          'Stocktake No Update Error! Please check your internet connection!',
        status: 'warning',
        customId: 'docUpdStktakeErr',
      });
    },
  });

  return mutate;
}
