import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
//import { useQuery as useApolloQuery, useMutation } from "@apollo/react-hooks";
import { GraphQLClient, gql } from 'graphql-request';
//import { gql } from "@apollo/client";
//import { employees_url } from "../../utils/constants";
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

async function getAllItemsHistMthView() {
  const { allItemsHistMthView } = await graphQLClient.request(
    gql`
      query getAllItemsHistMthView {
        allItemsHistMthView {
          it_itemno
          it_type
          it_yearmonth
          it_totalqty
          it_totalamt
        }
      }
    `
  );
  return allItemsHistMthView;
}

async function getItemsHistMthViewByItemno(itemno) {
  const { allItemsHistMthViewByItemno } = await graphQLClient.request(
    gql`
      query getItemsHistMthViewByItemno($itemno: String) {
        allItemsHistMthViewByItemno(itemno: $itemno) {
          it_itemno
          it_type
          it_yearmonth
          it_totalqty
          it_totalamt
        }
      }
    `,
    { itemno }
  );
  return allItemsHistMthViewByItemno;
}

export function useItemsHistMthView() {
  const [histmthviewitemno, setHistMthViewItemno] = useState('');

  const fallback = [];
  const { data: itemshistmthview = fallback } = useQuery({
    queryKey: [queryKeys.itemshistmthview, histmthviewitemno],
    queryFn: () =>
      histmthviewitemno
        ? getItemsHistMthViewByItemno(histmthviewitemno)
        : getAllItemsHistMthView(),
  });

  return { itemshistmthview, setHistMthViewItemno };
}
