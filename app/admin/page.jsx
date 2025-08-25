"use client";
import { useEffect, useState } from "react";
import { supabaseBrowser } from "@/lib/supabaseClient";

export default function Admin() {
  const [email, setEmail] = useState("");
  useEffect(() => {
    supabaseBrowser().auth.getUser().then(({ data }) => {
      setEmail(data.user?.email || "");
    });
  }, []);
  return (
    <main>
      <h1>Admin</h1>
      <p>Signed in as {email}</p>
      <ul>
        <li><a href="/admin/entities">Entities</a></li>
        <li><a href="/admin/accounts">Accounts</a></li>
        <li><a href="/admin/links">Links</a></li>
        <li><a href="/admin/evidence">Evidence</a></li>
      </ul>
    </main>
  );
}
