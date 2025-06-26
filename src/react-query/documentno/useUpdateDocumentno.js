import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../constants';
import { Toast } from '../../helpers/CustomToastify';
import { GraphQLClient, gql } from 'graphql-request';

//const API_URL = `http://localhost:4000/graphql`;
const API_URL = process.env.REACT_APP_API_URL;

const graphQLClient = new GraphQLClient(API_URL, {
  headers: {
    Authorization: `Bearer ${process.env.API_KEY}`,
  },
});

async function updateDocumentno(data) {
  const { itemdata } = await graphQLClient.request(
    gql`
      mutation UpdateDocumentno(
        $doc_id: ID
        $doc_invoice: Int
        $doc_purchase: Int
        $doc_despatch: Int
        $doc_receipt: Int
        $doc_payment: Int
        $doc_trans: Int
        $doc_branch: String
        $doc_stktake: Int
        $doc_stkadjust: Int
        $doc_prefix: String
        $doc_abbre: String
      ) {
        updateDocumentno(
          doc_id: $doc_id
          doc_invoice: $doc_invoice
          doc_purchase: $doc_purchase
          doc_despatch: $doc_despatch
          doc_receipt: $doc_receipt
          doc_payment: $doc_payment
          doc_trans: $doc_trans
          doc_branch: $doc_branch
          doc_stktake: $doc_stktake
          doc_stkadjust: $doc_stkadjust
          doc_prefix: $doc_prefix
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

export function useUpdateDocumentno(data) {
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: data => updateDocumentno(data),
    onSuccess: () => {
      Toast({
        title: 'Document being updated!',
        status: 'success',
        customId: 'docupd',
      });
    },
    onError: () => {
      Toast({
        title: 'Document Update Error! ',
        status: 'warning',
        customId: 'docupdErr',
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries('documentno');
    },
  });

  return mutate;
}
