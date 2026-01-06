"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";

// This component is for testing error boundary functionality only
// It throws an error when triggered via button click or ?error=true query param
export function TestErrorComponent() {
  const searchParams = useSearchParams();
  const [shouldThrow, setShouldThrow] = useState(false);

  // Throw immediately if error param is in URL
  const errorParam = searchParams.get("error");
  if (errorParam === "true") {
    throw new Error("This is a test error triggered by URL parameter");
  }

  if (shouldThrow) {
    throw new Error("This is a test error to verify ErrorBoundary");
  }

  return (
    <button
      onClick={() => setShouldThrow(true)}
      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
    >
      Trigger Test Error
    </button>
  );
}
