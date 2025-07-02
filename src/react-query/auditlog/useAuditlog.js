import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
//import { useQuery as useApolloQuery, useMutation } from "@apollo/react-hooks";
import { GraphQLClient, gql } from 'graphql-request';
//import { gql } from "@apollo/client";
//import { employees_url } from "../../utils/constants";

import axios from 'axios';
import { queryKeys } from '../constants';

const API_URL = process.env.REACT_APP_API_URL;
//const API_URL = `http://localhost:4000/graphql`;

const graphQLClient = new GraphQLClient(API_URL, {
  headers: {
    Authorization: `Bearer ${process.env.API_KEY}`,
  },
});

async function getAuditlog() {
  const { allAuditlog } = await graphQLClient.request(gql`
    query {
      allAuditlog {
        al_id
        al_userid
        al_user
        al_date
        al_time
        al_timestr
        al_module
        al_action
        al_record
        al_remark
      }
    }
  `);
  return allAuditlog;
}

export function useAuditlog() {
  const [auditlogId, setAuditlogId] = useState('');

  const fallback = [];
  const { data: auditlog = fallback } = useQuery({
    queryKey: [queryKeys.auditlog, auditlogId],
    queryFn: () => getAuditlog(),
  });

  return { auditlog, setAuditlogId };
}
