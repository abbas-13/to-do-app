import { useContext, useEffect, useRef, useState } from "react";

import { ToDoContext } from "@/Context/ToDoContext";
import type { AnalyticsType } from "@/assets/Types";

export const useAnalytics = (listId?: string) => {
  const [data, setData] = useState<AnalyticsType | null>(null);
  const [loading, setLoading] = useState(true);
  const { toDos } = useContext(ToDoContext);

  const scopeRef = useRef<string | undefined>(listId);

  useEffect(() => {
    let cancelled = false;

    if (scopeRef.current !== listId) {
      scopeRef.current = listId;
      setData(null);
      setLoading(true);
    }

    const fetchAnalytics = async () => {
      try {
        const url = listId
          ? `/api/analytics?listId=${encodeURIComponent(listId)}`
          : "/api/analytics";

        const response = await fetch(url, {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const analytics: AnalyticsType = await response.json();
        if (!cancelled) setData(analytics);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Unkown error occurred";
        console.error("Fetching analytics failed: ", errorMessage);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchAnalytics();

    return () => {
      cancelled = true;
    };
  }, [toDos, listId]);

  return { data, loading };
};
