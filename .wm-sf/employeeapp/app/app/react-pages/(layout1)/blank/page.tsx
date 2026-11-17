import React from "react";
import { Metadata } from "next";
import Loader from "@/app/loading";
const BlankComponent = React.lazy(() => import('./blank.component'));

export const metadata: Metadata = {
  title: "Blank",
};

export default function Page() {
  return (
      <React.Suspense fallback={<Loader/>}>
        <BlankComponent />
      </React.Suspense>
  );
}