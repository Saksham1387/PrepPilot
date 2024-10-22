"use client";
import { Button } from "@/components/ui/button";
import { signOut, useSession } from "next-auth/react";

export function Landing() {
  const session = useSession();
  return (
    <div>
      <Button>Get Started</Button>
      <Button
        onClick={() => {
          signOut();
        }}
      >
        Logout
      </Button>
      Landind Page
    </div>
  );
}
