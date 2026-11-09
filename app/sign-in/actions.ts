"use server";

import { redirect } from "next/navigation";
import { getAuth } from "@/lib/auth/server";
import { readConfig } from "@/lib/config";

export async function signOutAction() {
  if (readConfig(process.env).auth.ready) await getAuth().signOut();
  redirect("/sign-in");
}
