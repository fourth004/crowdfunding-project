import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
export default function useWeb3(){
const [provider, setProvider] = useState(null);
const [account, setAccount] = useState(null);
async function connect(){
if(!window.ethereum) return alert('Install MetaMask');
const prov = new ethers.BrowserProvider(window.ethereum);
await window.ethereum.request({ method: 'eth_requestAccounts' });
const signer = await prov.getSigner();
const addr = await signer.getAddress();
setProvider(prov);
setAccount(addr);
}
useEffect(()=>{
if(window.ethereum){
window.ethereum.on('accountsChanged', (accounts)=>
setAccount(accounts[0] || null));
}
},[]);
return { provider, account, connect };
}