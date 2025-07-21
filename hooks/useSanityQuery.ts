import { useState, useEffect } from "react";
import { client } from "@/sanity/lib/client";

interface QueryResult<T> {
  data: T[] | null;
  loading: boolean;
  error: Error | null;
}

export function useSanityQuery<T>(query: string): QueryResult<T> {
  const [data, setData] = useState<T[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await client.fetch(query);
        setData(result);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("An error occurred"));
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [query]);

  return { data, loading, error };
}
