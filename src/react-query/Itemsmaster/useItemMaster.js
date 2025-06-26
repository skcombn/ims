import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
//import { useQuery as useApolloQuery, useMutation } from "@apollo/react-hooks";
import { GraphQLClient, gql } from 'graphql-request';
//import { gql } from "@apollo/client";
//import { employees_url } from "../../utils/constants";
import { filterById } from './utils';
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

async function getAllItemsMaster() {
  const { allItemsMaster } = await graphQLClient.request(
    gql`
      query getItemsMaster {
        allItemsMaster {
          item_no
          item_group
          item_desp
          item_packing
          item_category
          item_unit
          item_brand
          item_dept
          item_smcode
          item_package
          item_warehouse
          item_type
          item_nonstock
          item_location
          item_prtreptlabel
          item_lock
          item_inactive
          item_branch
          item_qoh_pc
          item_qoh_ctn
          item_ucost_pc
          item_ucost_ctn
          item_onorder_pc
          item_onorder_ctn
          item_uprice_pc
          item_uprice_ctn
          item_remark
          item_pfactor
          item_outlet_pc
          item_outlet_ctn
          item_offeruprice
          item_cooluprice
          item_minlvlqty
          item_suppno
          item_supplier
          item_openqty
          item_openamt
          item_updated
          item_lastsalesdate
          item_lastpodate
          item_lastpoqty
          item_lastsalesqty
          item_memuprice
          item_groupname
          item_olducost
          item_allowposaddon
        }
      }
    `
  );
  return allItemsMaster;
}

async function getItemsMaster(itemno) {
  const { itemsMaster } = await graphQLClient.request(
    gql`
      query ItemsMaster($itemno: String) {
        itemsMaster(itemno: $itemno) {
          item_no
          item_group
          item_desp
          item_packing
          item_category
          item_unit
          item_brand
          item_dept
          item_smcode
          item_package
          item_warehouse
          item_type
          item_nonstock
          item_location
          item_prtreptlabel
          item_lock
          item_inactive
          item_branch
          item_qoh_pc
          item_qoh_ctn
          item_ucost_pc
          item_ucost_ctn
          item_onorder_pc
          item_onorder_ctn
          item_uprice_pc
          item_uprice_ctn
          item_remark
          item_pfactor
          item_outlet_pc
          item_outlet_ctn
          item_offeruprice
          item_cooluprice
          item_minlvlqty
          item_suppno
          item_supplier
          item_openqty
          item_openamt
          item_updated
          item_lastsalesdate
          item_lastpodate
          item_lastpoqty
          item_lastsalesqty
          item_memuprice
          item_groupname
          item_olducost
          item_allowposaddon
        }
      }
    `,
    { itemno }
  );
  return itemsMaster;
}

export function useItemsMaster() {
  const [itemmasterno, setItemMasterNo] = useState('');

  const fallback = [];
  const { data: itemsmaster = fallback } = useQuery({
    queryKey: [queryKeys.itemsmaster, itemmasterno],
    queryFn: () =>
      itemmasterno ? getItemsMaster(itemmasterno) : getAllItemsMaster(),
  });

  return { itemsmaster, setItemMasterNo };
}
