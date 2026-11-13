import React from "react";
import { Metadata } from "next";
import Loader from "@/app/loading";
const ClientIllustrationListComponent = React.lazy(() => import('./clientIllustrationList.component'));

export const metadata: Metadata = {
  title: "Client Illustration List",
};

export default function Page() {
  return (
      <React.Suspense fallback={<Loader/>}>
        <ClientIllustrationListComponent />
      </React.Suspense>
  );
}