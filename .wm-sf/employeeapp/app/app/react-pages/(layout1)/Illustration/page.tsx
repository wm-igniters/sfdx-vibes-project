import React from "react";
import { Metadata } from "next";
import Loader from "@/app/loading";
const IllustrationComponent = React.lazy(() => import('./Illustration.component'));

export const metadata: Metadata = {
  title: "Illustration",
};

export default function Page() {
  return (
      <React.Suspense fallback={<Loader/>}>
        <IllustrationComponent />
      </React.Suspense>
  );
}