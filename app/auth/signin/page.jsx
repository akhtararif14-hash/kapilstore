import { Suspense } from "react";
import SignInClient from "./SignInClient";

export default function SignInPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#22323c] flex items-center justify-center">
          <div className="text-[#17d492]">Loading...</div>
        </div>
      }
    >
      <SignInClient />
    </Suspense>
  );
}
