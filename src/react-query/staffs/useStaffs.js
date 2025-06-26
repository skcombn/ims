import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
//import { useQuery as useApolloQuery, useMutation } from "@apollo/react-hooks";
import { GraphQLClient, gql } from 'graphql-request';
//import { gql } from "@apollo/client";
//import { employees_url } from "../../utils/constants";
import { branch } from '../../utils/constants';
import axios from 'axios';
import { queryKeys } from '../constants';

const API_URL = process.env.REACT_APP_API_URL;
//const API_URL = `http://localhost:4000/graphql`;

const graphQLClient = new GraphQLClient(API_URL);

async function getStaffs() {
  const { allStaffs } = await graphQLClient.request(
    gql`
      query {
        allStaffs {
          s_id
          s_code
          s_name
          s_designation
          s_comms
          s_area
        }
      }
    `
  );
  return allStaffs;
}

export function useStaffs() {
  const [staffId, setStaffId] = useState('');

  const fallback = [];
  const { data: staffs = fallback } = useQuery({
    queryKey: [queryKeys.staffs, staffId],
    queryFn: () => getStaffs(),
  });

  return { staffs, setStaffId };
}
