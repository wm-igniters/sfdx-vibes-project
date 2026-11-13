import React from "react";
import { Metadata } from "next";
import Loader from "@/app/loading";
const PrintIllustrationComponent = React.lazy(() => import('./printIllustration.component'));

export const metadata: Metadata = {
  title: "printIllustration",
};

export default function Page() {
  return (
      <React.Suspense fallback={<Loader/>}>
        <PrintIllustrationComponent />
      </React.Suspense>
  );
}