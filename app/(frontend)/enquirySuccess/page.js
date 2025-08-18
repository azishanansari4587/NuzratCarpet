"use client";
import { Suspense } from "react";
import EnquirySuccess from "./EnquirySuccess";


export default function EnquirySuccess() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
          <EnquirySuccess />
        </Suspense>
    );
}
