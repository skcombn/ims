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

async function addReceiptsDetls(data) {
  const { itemdata } = await graphQLClient.request(
    gql`
      mutation AddReceiptsDetls(
        $rcpd_no: String
        $rcpd_invno: String
        $rcpd_invdate: Date
        $rcpd_invamt: Float
        $rcpd_last_bal: Float
        $rcpd_disc: Float
        $rcpd_amt: Float
        $rcpd_arid: String
      ) {
        addReceiptsDetls(
          rcpd_no: $rcpd_no
          rcpd_invno: $rcpd_invno
          rcpd_invdate: $rcpd_invdate
          rcpd_invamt: $rcpd_invamt
          rcpd_last_bal: $rcpd_last_bal
          rcpd_disc: $rcpd_disc
          rcpd_amt: $rcpd_amt
          rcpd_arid: $rcpd_arid
        ) {
          rcpd_no
        }
      }
    `,
    data
  );
  return itemdata;
}

export function useAddReceiptsDetls(data) {
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: data => addReceiptsDetls(data),
    onSuccess: () => {
      Toast({
        title: 'New Receipt Details being added!',
        status: 'success',
        customId: 'reptdetlAdd',
      });
    },
    onError: () => {
      Toast({
        title:
          'Receipt Details Add Error! Please check your internet connection!',
        status: 'warning',
        customId: 'reptdetlAddErr',
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries('receiptsdetls');
    },
  });

  return mutate;
}
