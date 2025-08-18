import { Suspense } from "react";
import EnquiryClient from "./enquiryClient";



export default function EnquirySuccess() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
          <EnquiryClient />
        </Suspense>
    );
}
