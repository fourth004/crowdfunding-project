import React from 'react';
import useWeb3 from '../hooks/useWeb3';
export default function Login(){
const { provider, account, connect } = useWeb3();
return (
<div style={{padding:10, border:'1px solid #ddd', borderRadius:8}}>
<h3>Wallet</h3>
{account ? <div>Connected: {account}</div> : <button onClick={connect}
>Connect MetaMask</button>}
13
</div>
)
}
