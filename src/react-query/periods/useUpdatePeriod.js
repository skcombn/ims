import { useMutation, useQueryClient } from '@tanstack/react-query';
//import { items_url } from '../../utils/constants';
import { useCustomToast } from '../../helpers/useCustomToast';
import { GraphQLClient, gql } from 'graphql-request';
import { Toast } from '../../helpers/CustomToastify';

const API_URL = process.env.REACT_APP_API_URL;
//const API_URL = `http://localhost:4000/graphql`;
const graphQLClient = new GraphQLClient(API_URL, {
  headers: {
    Authorization: `Bearer ${process.env.API_KEY}`,
  },
});

async function updatePeriod(data) {
  const { itemdata } = await graphQLClient.request(
    gql`
      mutation UpdatePeriod($p_id: ID, $p_period: String, $p_status: String) {
        updatePeriod(p_id: $p_id, p_period: $p_period, p_status: $p_status) {
          p_id
        }
      }
    `,
    data
  );
  return itemdata;
}

export function useUpdatePeriod(data) {
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: data => updatePeriod(data),
    onSuccess: () => {
      Toast({
        title: 'Period being updated!',
        status: 'success',
        customId: 'periodUpd',
      });
    },
    onError: () => {
      Toast({
        title: 'Period Update Error! Please check your internet connection!',
        status: 'warning',
        customId: 'periodUpdErr',
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries('periods');
    },
  });

  return mutate;
}
