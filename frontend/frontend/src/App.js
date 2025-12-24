/*import React from 'react';
import Login from './components/Login';
import CampaignForm from './components/CampaignForm';
import CampaignList from './components/CampaignList';
import Dashboard from './components/Dashboard';
import AdminPanel from './components/AdminPanel';
export default function App(){
return (
<div style={{fontFamily:'Arial, sans-serif', padding:20}}>
<h1>EduCrowd — Education Crowdfunding</h1>
<div style={{display:'grid', gridTemplateColumns:'1fr 2fr', gap:20}}>
<div>
<Login />
<AdminPanel />
</div>
<div>

<CampaignList />
<Dashboard />
</div>
</div>
</div>
)
}*/
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Homepage";
import CreateCampaign from "./components/CreateCampaign";
import Donate from "./components/Donate";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create" element={<CreateCampaign />} />
        <Route path="/donate" element={<Donate />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;


