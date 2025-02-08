"use client";

import { UserProfile } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { useTheme } from "next-themes";

export default function Settings() {
  const { resolvedTheme } = useTheme();

  return (
    <div className="flex justify-start items-center flex-wrap px-4 pt-5 gap-4">
      <h2 className="mt-10 scroll-m-20 border-b pb-2 w-full text-3xl font-semibold tracking-tight transition-colors first:mt-0">
        Profile
      </h2>
      <UserProfile appearance={{ baseTheme: resolvedTheme === "dark" ? dark : undefined }} />
    </div>
  );
}
