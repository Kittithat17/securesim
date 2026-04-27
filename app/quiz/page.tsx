import { Suspense } from "react";
import QuizPage from "./QuizPage";

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <div className="text-white">Loading quiz...</div>
    </div>}>
      <QuizPage />
    </Suspense>
  );
}
