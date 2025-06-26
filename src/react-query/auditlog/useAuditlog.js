import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
//import { useQuery as useApolloQuery, useMutation } from "@apollo/react-hooks";
import { GraphQLClient, gql } from 'graphql-request';
//import { gql } from "@apollo/client";
//import { items_url } from "../constants";

import axios from 'axios';
import { queryKeys } from '../constants';

const API_URL = process.env.REACT_APP_API_URL;
//const API_URL = `http://192.168.0.107:4000/graphql`;

const graphQLClient = new GraphQLClient(API_URL, {
  headers: {
    Authorization: `Bearer ${process.env.API_KEY}`,
  },
});

async function getAllAuditlog(userid) {
  if (userid) {
    const { auditlog } = await graphQLClient.request(
      gql`
        query Auditlog($userid: String) {
          auditlog(userid: $userid) {
            at_id
            at_userid
            at_user
            at_date
            at_time
            at_module
            at_record
            at_remark
            at_timestr
          }
        }
      `,
      { userid }
    );
    return auditlog;
  } else {
    const { allAuditlog } = await graphQLClient.request(gql`
      query {
        allAuditlog {
          at_id
          at_userid
          at_user
          at_date
          at_time
          at_module
          at_record
          at_remark
          at_timestr
        }
      }
    `);
    return allAuditlog;
  }
}

export function useAuditlog() {
  const [audituserId, setAuditUserId] = useState('');

  const fallback = [];
  const { data: auditlog = fallback } = useQuery({
    queryKey: [queryKeys.auditlog, audituserId],
    queryFn: () => getAllAuditlog(audituserId),
  });

  return { auditlog, setAuditUserId };
}
