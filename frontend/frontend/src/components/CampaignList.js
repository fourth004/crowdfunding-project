import React, {useEffect, useState} from 'react';
import axios from 'axios';
export default function CampaignList(){
const [items, setItems] = useState([]);
useEffect(()=>{ fetchList(); },[]);
async function fetchList(){
const res = await axios.get('/api/campaigns/');
setItems(res.data || []);
}
return (
<div style={{marginTop:10}}>
<h3>Campaigns</h3>
{items.map(it=> (
<div key={it.id} style={{padding:12, border:'1px solid #ddd',
marginBottom:8}}>
<h4>{it.title} {it.chain ? (it.chain[7] ? ' ' : '') : ''}</h4>
<div>{it.description}</div>
<div>Goal: {it.goal}</div>
<div>Contract ID: {it.contract_id}</div>
</div>
))}
</div>
)
}
