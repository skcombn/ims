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

async function addItemGroup(data) {
  const { itemdata } = await graphQLClient.request(
    gql`
      mutation AddItemGroup($group_code: String, $group_desp: String) {
        addItem(group_code: $group_code, group_desp: $group_desp) {
          group_code
        }
      }
    `,
    data
  );
  return itemdata;
}

export function useAddItemGroup(data) {
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: data => addItemGroup(data),
    onSuccess: () => {
      Toast({
        title: 'New item Group being added!',
        status: 'success',
        customId: 'itemgrpAdd',
      });
    },
    onError: () => {
      Toast({
        title: 'Item Group Add Error! Please check your internet connection!',
        status: 'warning',
        customId: 'itemgrpAddErr',
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries('itemsgroups');
    },
  });

  return mutate;
}
