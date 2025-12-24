from web3 import Web3
import json
from config import INFURA_URL, CONTRACT_ADDRESS
w3 = Web3(Web3.HTTPProvider(INFURA_URL))
ABI = None
contract = None
try:
with open('CrowdfundingABI.json', 'r') as f:
ABI = json.load(f)
if CONTRACT_ADDRESS:
contract =
w3.eth.contract(address=Web3.to_checksum_address(CONTRACT_ADDRESS), abi=ABI)
except Exception as e:
print('ABI or contract not loaded:', e)

def get_campaign(campaign_id):
if not contract:
return None
return contract.functions.getCampaign(campaign_id).call()
def build_contribute_tx(from_address, campaign_id, value_wei, gas=200000):
if not contract:
raise RuntimeError('contract not configured')
nonce = w3.eth.get_transaction_count(from_address)
tx = contract.functions.contribute(campaign_id).build_transaction({
'from': from_address,
'value': int(value_wei),
'nonce': nonce,
'gas': gas
})
return tx
