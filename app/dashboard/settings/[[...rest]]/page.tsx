"use client";

import { UserProfile } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { useTheme } from "next-themes";

export default function Settings() {
  const { resolvedTheme } = useTheme();

  return (
    <div>
      <div className="flex items-center gap-2w">
        <h1 className="text-3xl font-semibold tracking-tight">Settings</h1>
      </div>
      <p className="leading-7 text-sm text-muted-foreground mb-4">
        Manage your account settings here.
      </p>
      <UserProfile appearance={{ baseTheme: resolvedTheme === "dark" ? dark : undefined }} />
    </div>
  );
}
