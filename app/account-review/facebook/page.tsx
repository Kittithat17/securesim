import { Suspense } from "react";
import FacebookPage from "./FacebookPage";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <FacebookPage />
    </Suspense>
  );
}