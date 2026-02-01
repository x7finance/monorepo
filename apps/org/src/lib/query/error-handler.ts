import type { Query, QueryCache, MutationCache, Mutation } from "@tanstack/react-query";

import { LogCodes } from "@x7/utils";

import { log } from "~/lib/utils/log";

/**
 * Handles query errors with structured logging
 */
export function handleQueryError(
  error: Error,
  query: Query<unknown, unknown, unknown, readonly unknown[]>,
): void {
  const queryKey = JSON.stringify(query.queryKey);

  log.error(LogCodes.QUERY_ERROR, "Query failed", {
    queryKey,
    error: error.message,
    state: query.state.status,
  });
}

/**
 * Handles mutation errors with structured logging
 */
export function handleMutationError(
  error: Error,
  variables: unknown,
  _context: unknown,
  mutation: Mutation<unknown, unknown, unknown, unknown>,
): void {
  log.error(LogCodes.QUERY_ERROR, "Mutation failed", {
    mutationKey: mutation.options.mutationKey
      ? JSON.stringify(mutation.options.mutationKey)
      : "unknown",
    error: error.message,
    variables: typeof variables === "object" ? JSON.stringify(variables) : variables,
  });
}

/**
 * Creates QueryCache configuration with error handling
 */
export function createQueryCacheConfig(): ConstructorParameters<typeof QueryCache>[0] {
  return {
    onError: handleQueryError,
  };
}

/**
 * Creates MutationCache configuration with error handling
 */
export function createMutationCacheConfig(): ConstructorParameters<typeof MutationCache>[0] {
  return {
    onError: handleMutationError,
  };
}
