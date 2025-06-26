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

async function getPeriods() {
  const { allPeriods } = await graphQLClient.request(
    gql`
      query {
        allPeriods {
          p_id
          p_period
          p_status
        }
      }
    `
  );
  return allPeriods;
}

export function usePeriod() {
  const [periodId, setPeriodId] = useState('');

  const fallback = [];
  const { data: periods = fallback } = useQuery({
    queryKey: [queryKeys.periods],
    queryFn: () => getPeriods(),
  });

  return { periods, setPeriodId };
}
