import { Suspense } from "react";
import TrainingPage from "./TrainingPage";

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <div className="text-white">Loading training...</div>
    </div>}>
      <TrainingPage />
    </Suspense>
  );
}
