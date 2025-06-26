import { useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
//import { useQuery as useApolloQuery, useMutation } from "@apollo/react-hooks";
//import { GraphQLClient, gql } from "graphql-request";
//import { gql } from "@apollo/client";
//import { items_url } from "../constants";

import axios from "axios";
import { queryKeys } from "../constants";

async function getAllSetup(itemId) {
  if (itemId) {
    const { data } = await axios.get(`${queryKeys.setup}?fv=${itemId}`);
    return data;
  } else {
    const { data } = await axios.get(`${queryKeys.setup}`);
    return data;
  }
}

export function useSetup() {
  const [setupId, setSetupId] = useState("");

  const fallback = [];
  const { data: setup = fallback } = useQuery({
    queryKey: [queryKeys.setup, setupId],
    queryFn: () => getAllSetup(setupId),
  });

  return { setup, setSetupId };
}
