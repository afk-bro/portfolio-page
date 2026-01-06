import { Suspense } from "react";
import { TestErrorComponent } from "@/components/TestErrorComponent";
import { ErrorBoundary } from "@/components/ErrorBoundary";

export default function TestErrorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
          Error Boundary Test Page
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Click the button below to trigger an error and test the error
          boundary. Or add ?error=true to the URL.
        </p>
        <ErrorBoundary>
          <Suspense fallback={<div>Loading...</div>}>
            <TestErrorComponent />
          </Suspense>
        </ErrorBoundary>
      </div>
    </div>
  );
}
