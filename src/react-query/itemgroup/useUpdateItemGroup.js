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

async function updateItemGroup(data) {
  const { itemdata } = await graphQLClient.request(
    gql`
      mutation UpdateItemGroup(
        $group_id: ID
        $group_code: String
        $group_desp: String
      ) {
        updateItemGroup(
          group_id: $group_id
          group_code: $group_code
          group_desp: $group_desp
        ) {
          group_id
        }
      }
    `,
    data
  );
  return itemdata;
}

export function useUpdateItemGroup(data) {
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: data => updateItemGroup(data),
    onSuccess: () => {
      Toast({
        title: 'Item Group being updated!',
        status: 'success',
        customId: 'itemgrpUpd',
      });
    },
    onError: () => {
      Toast({
        title:
          'Item Group Update Error! Please check your internet connection!',
        status: 'warning',
        customId: 'itemgrp_UpdErr',
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries('itemsgroups');
    },
  });

  return mutate;
}
