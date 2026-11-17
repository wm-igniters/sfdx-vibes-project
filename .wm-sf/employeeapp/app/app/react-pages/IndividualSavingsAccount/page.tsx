import React from "react";
import { Metadata } from "next";
import Loader from "@/app/loading";
const IndividualSavingsAccountComponent = React.lazy(() => import('./IndividualSavingsAccount.component'));

export const metadata: Metadata = {
  title: "IndividualSavingsAccount",
};

export default function Page() {
  return (
      <React.Suspense fallback={<Loader/>}>
        <IndividualSavingsAccountComponent />
      </React.Suspense>
  );
}