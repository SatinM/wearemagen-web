"use client";
import { useEffect, useState } from "react";
import { supabaseBrowser } from "@/lib/supabaseClient";

export default function EvidencePage() {
  const [links, setLinks] = useState([]);
  const [types, setTypes] = useState([]);
  const [linkId, setLinkId] = useState("");
  const [etype, setEtype] = useState("");
  const [weight, setWeight] = useState("0.30");
  const [url, setUrl] = useState("");

  const load = async () => {
    const sb = supabaseBrowser();
    const [{ data: ls }, { data: ts }] = await Promise.all([
      sb.from("entity_account_link").select("link_id,entity_id,account_id").order("link_id", { ascending:false }),
      sb.from("evidence_types").select("*").order("label")
    ]);
    setLinks(ls||[]); setTypes(ts||[]);
  };
  useEffect(()=>{ load(); },[]);

  const ensureDefaultTypes = async () => {
    await supabaseBrowser().from("evidence_types").upsert([
      { code:"manual", label:"Manual" },
      { code:"cross_post", label:"Cross-post" },
      { code:"screenshot", label:"Screenshot" }
    ], { onConflict: "code" });
    load();
  };

  const add = async () => {
    if (!linkId || !etype) return;
    const w = Math.max(0, Math.min(1, Number(weight)));
    await supabaseBrowser().from("evidence").insert({
      link_id: Number(linkId),
      evidence_type_id: Number(etype),
      weight: w,
      source_url: url || null
    });
    setUrl(""); setWeight("0.30");
  };

  return (
    <main>
      <h1>Evidence</h1>
      <div>
        <select value={linkId} onChange={e=>setLinkId(e.target.value)}>
          <option value="">Select link…</option>
          {links.map(l=> <option key={l.link_id} value={l.link_id}>link #{l.link_id}</option>)}
        </select>
        <select value={etype} onChange={e=>setEtype(e.target.value)}>
          <option value="">Type…</option>
          {types.map(t=> <option key={t.evidence_type_id} value={t.evidence_type_id}>{t.label}</option>)}
        </select>
        <input placeholder="source url (optional)" value={url} onChange={e=>setUrl(e.target.value)} />
        <input placeholder="weight 0..1" value={weight} onChange={e=>setWeight(e.target.value)} />
        <button onClick={add}>Add Evidence</button>
        <button onClick={ensureDefaultTypes}>Ensure Types</button>
      </div>
      <p style={{opacity:.7, fontSize:12}}>
        Weights combine as 1 − Π(1−wᵢ). Adding evidence recomputes link confidence.
      </p>
    </main>
  );
}
