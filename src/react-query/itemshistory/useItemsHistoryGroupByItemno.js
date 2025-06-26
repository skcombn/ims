import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
//import { useQuery as useApolloQuery, useMutation } from "@apollo/react-hooks";
import { GraphQLClient, gql } from 'graphql-request';
//import { gql } from "@apollo/client";
//import { employees_url } from "../../utils/constants";
import { filterByItemId } from './utils';
import axios from 'axios';
import { queryKeys } from '../constants';
import { branch } from '../../utils/constants';

const API_URL = process.env.REACT_APP_API_URL;
//const API_URL = `http://localhost:4000/graphql`;
//const API_URL = `http://192.168.0.107:4000/graphql`;

const graphQLClient = new GraphQLClient(API_URL, {
  headers: {
    Authorization: `Bearer ${process.env.API_KEY}`,
  },
});

async function getAllItemsHistoryGroup(itemno) {
  const { allItemsHistoryGroup } = await graphQLClient.request(
    gql`
      query getAllItemsHistoryGroup {
        allItemsHistoryGroup {
          itemno
          type
          txn_year
          txn_month
          mtdqty
          mtdamt
        }
      }
    `
  );
  return allItemsHistoryGroup;
}

async function getItemsHistoryGroupByItemno(itemno) {
  const { allItemsHistoryGroupByItemno } = await graphQLClient.request(
    gql`
      query getItemsHistoryGroup($itemno: String) {
        allItemsHistoryGroupByItemno(itemno: $itemno) {
          itemno
          type
          txn_year
          txn_month
          mtdqty
          mtdamt
        }
      }
    `,
    { itemno }
  );
  return allItemsHistoryGroupByItemno;
}

export function useItemsHistoryGroupByItemno() {
  const [histgrpitemno, setHistGrpItemno] = useState('');

  const fallback = [];
  const { data: itemshistorygroup = fallback } = useQuery({
    queryKey: [queryKeys.itemshistorygroup, histgrpitemno],
    queryFn: () => getItemsHistoryGroupByItemno(histgrpitemno),
  });

  return { itemshistorygroup, setHistGrpItemno };
}
