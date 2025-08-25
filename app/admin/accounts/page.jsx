"use client";
import { useEffect, useState } from "react";
import { supabaseBrowser } from "@/lib/supabaseClient";

export default function Accounts() {
  const [items, setItems] = useState([]);
  const [platform, setPlatform] = useState("bsky");
  const [handle, setHandle] = useState("");
  const [url, setUrl] = useState("");

  const load = async () => {
    const { data } = await supabaseBrowser()
      .from("accounts")
      .select("account_id,platform,handle,url,status")
      .order("created_at", { ascending: false });
    setItems(data || []);
  };
  useEffect(() => { load(); }, []);

  const add = async () => {
    if (!handle.trim()) return;
    await supabaseBrowser()
      .from("accounts")
      .insert({ platform, handle, url: url || null });
    setHandle(""); setUrl("");
    load();
  };

  return (
    <main>
      <h1>Accounts</h1>
      <div>
        <select value={platform} onChange={e=>setPlatform(e.target.value)}>
          <option>bsky</option><option>x</option><option>instagram</option>
          <option>youtube</option><option>tiktok</option><option>facebook</option>
        </select>
        <input placeholder="@handle" value={handle} onChange={e=>setHandle(e.target.value)} />
        <input placeholder="https://… (optional)" value={url} onChange={e=>setUrl(e.target.value)} />
        <button onClick={add}>Add</button>
      </div>
      <ul>
        {items.map(a => (
          <li key={a.account_id}>
            {a.platform} — {a.handle} {a.url ? (<a href={a.url} target="_blank">link</a>) : null} &nbsp;
            <span style={{opacity:.6}}>{a.status}</span>
          </li>
        ))}
      </ul>
    </main>
  );
}
