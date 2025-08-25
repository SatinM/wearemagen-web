"use client";
import { useEffect, useState } from "react";
import { supabaseBrowser } from "@/lib/supabaseClient";

export default function Links() {
  const [entities, setEntities] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [links, setLinks] = useState([]);
  const [eid, setEid] = useState("");
  const [aid, setAid] = useState("");

  const load = async () => {
    const sb = supabaseBrowser();
    const [{ data: es }, { data: as }, { data: ls }] = await Promise.all([
      sb.from("entities").select("entity_id,name").order("name"),
      sb.from("accounts").select("account_id,platform,handle").order("platform"),
      sb.from("entity_account_link").select("link_id,entity_id,account_id,confidence_score").order("last_seen_at", { ascending:false })
    ]);
    setEntities(es||[]); setAccounts(as||[]); setLinks(ls||[]);
  };
  useEffect(()=>{ load(); },[]);

  const add = async () => {
    if (!eid || !aid) return;
    await supabaseBrowser().from("entity_account_link")
      .insert({ entity_id: Number(eid), account_id: Number(aid), confidence_score: 0 });
    setEid(""); setAid("");
    load();
  };

  const nameOf = id => entities.find(e=>e.entity_id===id)?.name || id;
  const acctOf = id => {
    const a = accounts.find(x=>x.account_id===id);
    return a ? `${a.platform}:${a.handle}` : id;
  };

  return (
    <main>
      <h1>Links</h1>
      <div>
        <select value={eid} onChange={e=>setEid(e.target.value)}>
          <option value="">Select entity…</option>
          {entities.map(e=> <option key={e.entity_id} value={e.entity_id}>{e.name}</option>)}
        </select>
        <select value={aid} onChange={e=>setAid(e.target.value)}>
          <option value="">Select account…</option>
          {accounts.map(a=> <option key={a.account_id} value={a.account_id}>{a.platform}:{a.handle}</option>)}
        </select>
        <button onClick={add}>Link</button>
      </div>
      <ul>
        {links.map(l => (
          <li key={l.link_id}>
            {nameOf(l.entity_id)} ↔ {acctOf(l.account_id)} — conf: {Number(l.confidence_score).toFixed(2)}
          </li>
        ))}
      </ul>
    </main>
  );
}
