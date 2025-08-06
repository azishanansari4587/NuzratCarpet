"use client";
import { Suspense } from "react";
import VerifyClient from "./VerifyClient";

export default function VerifyPage() {


  return (
    <Suspense fallback={<div className="text-center py-10">Loading...</div>}>
      <VerifyClient/>
    </Suspense>
  );
}
