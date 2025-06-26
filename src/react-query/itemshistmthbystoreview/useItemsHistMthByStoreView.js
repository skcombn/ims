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

async function getAllItemsHistMthByStoreView() {
  const { allItemsHistMthByStoreView } = await graphQLClient.request(
    gql`
      query getAllItemsHistMthByStoreView {
        allItemsHistMthByStoreView {
          it_itemno
          it_type
          it_store
          it_yearmonth
          it_totalqty
          it_totalamt
        }
      }
    `
  );
  return allItemsHistMthByStoreView;
}

async function getItemsHistMthByStoreViewByItemno(itemno) {
  const { allItemsHistMthByStoreViewByItemno } = await graphQLClient.request(
    gql`
      query getItemsHistMthByStoreViewByItemno($itemno: String) {
        allItemsHistMthByStoreViewByItemno(itemno: $itemno) {
          it_itemno
          it_type
          it_store
          it_yearmonth
          it_totalqty
          it_totalamt
        }
      }
    `,
    { itemno }
  );
  return allItemsHistMthByStoreViewByItemno;
}

export function useItemsHistMthByStoreView() {
  const [histmthbystoreviewitemno, setHistMthByStoreViewItemno] = useState('');

  const fallback = [];
  const { data: itemshistmthbystoreview = fallback } = useQuery({
    queryKey: [queryKeys.itemshistmthbystoreview, histmthbystoreviewitemno],
    queryFn: () =>
      histmthbystoreviewitemno
        ? getItemsHistMthByStoreViewByItemno(histmthbystoreviewitemno)
        : getAllItemsHistMthByStoreView(),
  });

  return { itemshistmthbystoreview, setHistMthByStoreViewItemno };
}
