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

async function addPeriod(data) {
  const { itemdata } = await graphQLClient.request(
    gql`
      mutation AddPeriod($p_period: String, $p_status: String) {
        addPeriod(p_period: $p_period, p_status: $p_status) {
          p_id
        }
      }
    `,
    data
  );
  return itemdata;
}

export function useAddPeriod(data) {
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: data => addPeriod(data),
    onSuccess: () => {
      Toast({
        title: 'New Period being added!',
        status: 'success',
        customId: 'periodAdd',
      });
    },
    onError: () => {
      Toast({
        title: 'Period Add Error! Please check your internet connection!',
        status: 'warning',
        customId: 'setupPeriodErr',
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries('periods');
    },
  });

  return mutate;
}
