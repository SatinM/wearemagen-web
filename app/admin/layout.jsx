"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "../../lib/supabaseClient";

export default function AdminLayout({ children }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    supabaseBrowser().auth.getUser()
      .then(({ data: { user } }) => {
        if (!user) router.replace("/login");
        else setReady(true);
      })
      .catch(() => router.replace("/login"));
  }, [router]);

  if (!ready) return null; // or a small spinner
  return <>{children}</>;
}
