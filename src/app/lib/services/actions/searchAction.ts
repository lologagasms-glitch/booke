
import { z } from 'zod';
import { actionClient } from '../../safe-action';
'use server';

const searchSchema = z.record(
  z.string(),
  z.union([z.string(), z.array(z.string())])
);
export const searchAction = actionClient
  .schema(searchSchema)
  .action(async ({ parsedInput: searchParams }) => {
    // Convert searchParams entries into a plain object
    const params = Object.fromEntries(
      Object.entries(searchParams).map(([key, value]) => [
        key,
        Array.isArray(value) ? value.join(',') : value,
      ])
    );

    // Build a query string from the entries
    const query = new URLSearchParams(params ).toString();
    

    // TODO: implement actual search logic here
    console.log('Search query:', query);

    return { success: true, query };
  });

const searchWithTabSchema = z.object({
  searchParams: z.object({
    q: z.string().optional(),
    filter: z.string().optional(),
  }),
  tab: z.string(),
});

export const searchWithTabAction = actionClient
  .schema(searchWithTabSchema)
  .action(async ({ parsedInput: { searchParams, tab } }) => {
    // Merge tab into searchParams
    const params = Object.fromEntries(
      Object.entries({ ...searchParams, tab }).map(([key, value]) => [
        key,
        Array.isArray(value) ? value.join(',') : value,
      ])
    );

    // Example: build a query string from the entries
    const query = new URLSearchParams(params).toString();

    // TODO: implement actual search logic here
    console.log('Search query with tab:', query);

    return { success: true, query, tab };
  });
