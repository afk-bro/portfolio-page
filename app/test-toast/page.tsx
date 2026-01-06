"use client";

import { useToast } from "@/components/ui/Toast";
import { Button } from "@/components/ui/Button";

export default function TestToastPage() {
  const { addToast } = useToast();

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
          Toast Test Page
        </h1>
        <div className="flex flex-wrap gap-4 justify-center">
          <Button
            onClick={() =>
              addToast("Success! This is a success message.", "success", 5000)
            }
          >
            Show Success Toast
          </Button>
          <Button
            onClick={() =>
              addToast("Error! Something went wrong.", "error", 5000)
            }
            variant="outline"
          >
            Show Error Toast
          </Button>
          <Button
            onClick={() =>
              addToast("Info: Here is some information.", "info", 5000)
            }
            variant="outline"
          >
            Show Info Toast
          </Button>
          <Button
            onClick={() =>
              addToast("Warning! Please be careful.", "warning", 5000)
            }
            variant="outline"
          >
            Show Warning Toast
          </Button>
        </div>
      </div>
    </div>
  );
}
