const { expect } = require('chai');
const { ethers } = require('hardhat');
describe('Crowdfunding', function () {
let crowdfunding, admin, alice, bob;

beforeEach(async () => {
[admin, alice, bob] = await ethers.getSigners();
const CF = await ethers.getContractFactory('Crowdfunding');
crowdfunding = await CF.deploy(admin.address);
await crowdfunding.deployed();
});
it('create -> approve -> contribute -> withdraw flow', async () => {
const createTx = await
crowdfunding.connect(alice).createCampaign('Scholar', 'support students',
ethers.utils.parseEther('1'), 3600*24);
await createTx.wait();
const id = 1;
await crowdfunding.connect(admin).approveCampaign(id);
await crowdfunding.connect(bob).contribute(id, { value:
ethers.utils.parseEther('0.6') });
await crowdfunding.connect(alice).contribute(id, { value:
ethers.utils.parseEther('0.5') });
// fast-forward
await ethers.provider.send('evm_increaseTime', [3600*24 + 10]);
await ethers.provider.send('evm_mine');
await crowdfunding.connect(alice).withdraw(id);
const data = await crowdfunding.getCampaign(id);
expect(data.withdrawn).to.be.true;
});
});