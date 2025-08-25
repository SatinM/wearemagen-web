"use client";
import { useState } from "react";
import { supabaseBrowser } from "@/lib/supabaseClient";

export default function Login() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const onSubmit = async (e) => {
    e.preventDefault();
    const supabase = supabaseBrowser();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: window.location.origin + "/admin" },
    });
    setMsg(error ? error.message : "Check your email for a login link.");
  };
  return (
    <main>
      <h1>Team Login</h1>
      <form onSubmit={onSubmit}>
        <input
          placeholder="mike@hamishmarhaatik.org"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ padding: 8, border: "1px solid #ccc", borderRadius: 6 }}
        />
        <button style={{ marginLeft: 8 }} type="submit">Send Magic Link</button>
      </form>
      <p>{msg}</p>
    </main>
  );
}
