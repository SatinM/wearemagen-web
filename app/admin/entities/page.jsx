"use client";
import { useEffect, useState } from "react";
import { supabaseBrowser } from "@/lib/supabaseClient";

export default function Entities() {
  const [items, setItems] = useState([]);
  const [name, setName] = useState("");
  const [etype, setEtype] = useState("individual");

  const load = async () => {
    const supabase = supabaseBrowser();
    const { data } = await supabase
      .from("entities")
      .select("entity_id,name,entity_type")
      .order("created_at", { ascending: false });
    setItems(data || []);
  };
  useEffect(() => { load(); }, []);

  const add = async () => {
    if (!name.trim()) return;
    const supabase = supabaseBrowser();
    await supabase.from("entities").insert({ name, entity_type: etype });
    setName("");
    load();
  };

  return (
    <main>
      <h1>Entities</h1>
      <div>
        <input placeholder="Name" value={name} onChange={e=>setName(e.target.value)} />
        <select value={etype} onChange={e=>setEtype(e.target.value)}>
          <option value="individual">individual</option>
          <option value="group">group</option>
          <option value="organization">organization</option>
        </select>
        <button onClick={add}>Add</button>
      </div>
      <ul>
        {items.map(i => (
          <li key={i.entity_id}>{i.name} ({i.entity_type})</li>
        ))}
      </ul>
    </main>
  );
}
