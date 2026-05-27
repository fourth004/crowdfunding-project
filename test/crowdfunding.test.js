// // // const { expect } = require('chai');
// // // const { ethers } = require('hardhat');
// // // describe('Crowdfunding', function () {
// // // let crowdfunding, admin, alice, bob;

// // // beforeEach(async () => {
// // // [admin, alice, bob] = await ethers.getSigners();
// // // const CF = await ethers.getContractFactory('Crowdfunding');
// // // crowdfunding = await CF.deploy(admin.address);
// // // await crowdfunding.deployed();
// // // });
// // // it('create -> approve -> contribute -> withdraw flow', async () => {
// // // const createTx = await
// // // crowdfunding.connect(alice).createCampaign('Scholar', 'support students',
// // // ethers.utils.parseEther('1'), 3600*24);
// // // await createTx.wait();
// // // const id = 1;
// // // await crowdfunding.connect(admin).approveCampaign(id);
// // // await crowdfunding.connect(bob).contribute(id, { value:
// // // ethers.utils.parseEther('0.6') });
// // // await crowdfunding.connect(alice).contribute(id, { value:
// // // ethers.utils.parseEther('0.5') });
// // // // fast-forward
// // // await ethers.provider.send('evm_increaseTime', [3600*24 + 10]);
// // // await ethers.provider.send('evm_mine');
// // // await crowdfunding.connect(alice).withdraw(id);
// // // const data = await crowdfunding.getCampaign(id);
// // // expect(data.withdrawn).to.be.true;
// // // });
// // // });


// // // const { expect } = require("chai");
// // // const { ethers } = require("hardhat");

// // const { expect } = require("chai");
// // const hre = require("hardhat");
// // const ethers = hre.ethers;

// // // Helper: move blockchain time forward by `seconds`
// // async function increaseTime(seconds) {
// //   await ethers.provider.send("evm_increaseTime", [seconds]);
// //   await ethers.provider.send("evm_mine");
// // }

// // describe("Crowdfunding", function () {
// //   let crowdfunding;
// //   let admin, alice, bob, carol;

// //   // Fresh contract before every test
// //   beforeEach(async () => {
// //     [admin, alice, bob, carol] = await ethers.getSigners();
// //     const CF = await ethers.getContractFactory("Crowdfunding");
// //     crowdfunding = await CF.deploy(); // no constructor arguments
// //     await crowdfunding.waitForDeployment();
// //   });

// //   // ─────────────────────────────────────────────
// //   // 1. CAMPAIGN CREATION
// //   // ─────────────────────────────────────────────
// //   describe("createCampaign", function () {
// //     it("should create a campaign and emit CampaignCreated event", async () => {
// //       const goal = ethers.parseEther("1");
// //       const duration = 3600 * 24; // 1 day in seconds

// //       await expect(
// //         crowdfunding
// //           .connect(alice)
// //           .createCampaign("Scholar Fund", "Support students", goal, duration)
// //       ).to.emit(crowdfunding, "CampaignCreated");
// //     });

// //     it("should increment campaignCount after creation", async () => {
// //       expect(await crowdfunding.campaignCount()).to.equal(0);

// //       await crowdfunding
// //         .connect(alice)
// //         .createCampaign("Fund A", "desc", ethers.parseEther("1"), 3600);

// //       expect(await crowdfunding.campaignCount()).to.equal(1);

// //       await crowdfunding
// //         .connect(bob)
// //         .createCampaign("Fund B", "desc", ethers.parseEther("2"), 7200);

// //       expect(await crowdfunding.campaignCount()).to.equal(2);
// //     });

// //     it("should reject a campaign with zero goal", async () => {
// //       await expect(
// //         crowdfunding
// //           .connect(alice)
// //           .createCampaign("Bad Campaign", "desc", 0, 3600)
// //       ).to.be.revertedWith("Goal must be > 0");
// //     });

// //     it("should reject a campaign with zero duration", async () => {
// //       await expect(
// //         crowdfunding
// //           .connect(alice)
// //           .createCampaign("Bad Campaign", "desc", ethers.parseEther("1"), 0)
// //       ).to.be.revertedWith("Duration must be > 0");
// //     });

// //     it("should store campaign details correctly", async () => {
// //       const goal = ethers.parseEther("2");
// //       const duration = 3600 * 48;

// //       await crowdfunding
// //         .connect(alice)
// //         .createCampaign("EduFund", "Help students", goal, duration);

// //       const c = await crowdfunding.getCampaign(1);
// //       expect(c.creator).to.equal(alice.address);
// //       expect(c.title).to.equal("EduFund");
// //       expect(c.description).to.equal("Help students");
// //       expect(c.goal).to.equal(goal);
// //       expect(c.raised).to.equal(0);
// //       expect(c.finalized).to.be.false;
// //       expect(c.state).to.equal(0); // Ongoing
// //     });
// //   });

// //   // ─────────────────────────────────────────────
// //   // 2. DONATIONS
// //   // ─────────────────────────────────────────────
// //   describe("donate", function () {
// //     beforeEach(async () => {
// //       // Alice creates a campaign before each donation test
// //       await crowdfunding
// //         .connect(alice)
// //         .createCampaign("Scholar Fund", "Support students", ethers.parseEther("1"), 3600 * 24);
// //     });

// //     it("should accept a valid donation and emit DonationReceived", async () => {
// //       const amount = ethers.parseEther("0.5");

// //       await expect(
// //         crowdfunding.connect(bob).donate(1, { value: amount })
// //       )
// //         .to.emit(crowdfunding, "DonationReceived")
// //         .withArgs(1, bob.address, amount);
// //     });

// //     it("should update the raised amount after donation", async () => {
// //       await crowdfunding
// //         .connect(bob)
// //         .donate(1, { value: ethers.parseEther("0.3") });

// //       await crowdfunding
// //         .connect(carol)
// //         .donate(1, { value: ethers.parseEther("0.4") });

// //       const c = await crowdfunding.getCampaign(1);
// //       expect(c.raised).to.equal(ethers.parseEther("0.7"));
// //     });

// //     it("should reject donations below the minimum (0.01 ETH)", async () => {
// //       await expect(
// //         crowdfunding
// //           .connect(bob)
// //           .donate(1, { value: ethers.parseEther("0.001") })
// //       ).to.be.revertedWith("Minimum donation is 0.01 ETH");
// //     });

// //     it("should reject donations from the campaign creator", async () => {
// //       await expect(
// //         crowdfunding
// //           .connect(alice)
// //           .donate(1, { value: ethers.parseEther("0.5") })
// //       ).to.be.revertedWith("Creator cannot donate");
// //     });

// //     it("should reject donations after the deadline", async () => {
// //       await increaseTime(3600 * 24 + 10); // past deadline

// //       await expect(
// //         crowdfunding
// //           .connect(bob)
// //           .donate(1, { value: ethers.parseEther("0.5") })
// //       ).to.be.revertedWith("Campaign has ended");
// //     });

// //     it("should record contribution correctly", async () => {
// //       const amount = ethers.parseEther("0.6");
// //       await crowdfunding.connect(bob).donate(1, { value: amount });

// //       const contribution = await crowdfunding.getContribution(1, bob.address);
// //       expect(contribution).to.equal(amount);
// //     });

// //     it("should add donor to donors list", async () => {
// //       await crowdfunding
// //         .connect(bob)
// //         .donate(1, { value: ethers.parseEther("0.2") });

// //       const donors = await crowdfunding.getDonors(1);
// //       expect(donors).to.include(bob.address);
// //     });
// //   });

// //   // ─────────────────────────────────────────────
// //   // 3. FINALIZE — SUCCESSFUL CAMPAIGN
// //   // ─────────────────────────────────────────────
// //   describe("finalizeCampaign — success", function () {
// //     it("should mark campaign Successful and pay creator when goal is met", async () => {
// //       // Alice creates campaign: goal = 1 ETH, duration = 1 day
// //       await crowdfunding
// //         .connect(alice)
// //         .createCampaign("Scholar Fund", "desc", ethers.parseEther("1"), 3600 * 24);

// //       // Bob donates 0.6 ETH, Carol donates 0.5 ETH → total 1.1 ETH (goal met)
// //       await crowdfunding
// //         .connect(bob)
// //         .donate(1, { value: ethers.parseEther("0.6") });

// //       await crowdfunding
// //         .connect(carol)
// //         .donate(1, { value: ethers.parseEther("0.5") });

// //       // Move past deadline
// //       await increaseTime(3600 * 24 + 10);

// //       const aliceBalanceBefore = await ethers.provider.getBalance(alice.address);

// //       await expect(crowdfunding.connect(admin).finalizeCampaign(1))
// //         .to.emit(crowdfunding, "CampaignFinalized");

// //       const c = await crowdfunding.getCampaign(1);
// //       expect(c.state).to.equal(1); // Successful
// //       expect(c.finalized).to.be.true;

// //       // Alice (creator) should have received the funds
// //       const aliceBalanceAfter = await ethers.provider.getBalance(alice.address);
// //       expect(aliceBalanceAfter).to.be.gt(aliceBalanceBefore);
// //     });
// //   });

// //   // ─────────────────────────────────────────────
// //   // 4. FINALIZE — FAILED CAMPAIGN
// //   // ─────────────────────────────────────────────
// //   describe("finalizeCampaign — failure", function () {
// //     it("should mark campaign Failed when goal is not met", async () => {
// //       // Goal = 1 ETH, only 0.3 ETH donated
// //       await crowdfunding
// //         .connect(alice)
// //         .createCampaign("Scholar Fund", "desc", ethers.parseEther("1"), 3600 * 24);

// //       await crowdfunding
// //         .connect(bob)
// //         .donate(1, { value: ethers.parseEther("0.3") });

// //       await increaseTime(3600 * 24 + 10);

// //       await crowdfunding.connect(admin).finalizeCampaign(1);

// //       const c = await crowdfunding.getCampaign(1);
// //       expect(c.state).to.equal(2); // Failed
// //       expect(c.finalized).to.be.true;
// //     });

// //     it("should reject finalization before the deadline", async () => {
// //       await crowdfunding
// //         .connect(alice)
// //         .createCampaign("Scholar Fund", "desc", ethers.parseEther("1"), 3600 * 24);

// //       await expect(
// //         crowdfunding.connect(admin).finalizeCampaign(1)
// //       ).to.be.revertedWith("Campaign still ongoing");
// //     });

// //     it("should reject double finalization", async () => {
// //       await crowdfunding
// //         .connect(alice)
// //         .createCampaign("Scholar Fund", "desc", ethers.parseEther("1"), 3600 * 24);

// //       await increaseTime(3600 * 24 + 10);

// //       await crowdfunding.connect(admin).finalizeCampaign(1);

// //       await expect(
// //         crowdfunding.connect(admin).finalizeCampaign(1)
// //       ).to.be.revertedWith("Already finalized");
// //     });
// //   });

// //   // ─────────────────────────────────────────────
// //   // 5. REFUNDS
// //   // ─────────────────────────────────────────────
// //   describe("withdrawRefund", function () {
// //     beforeEach(async () => {
// //       // Set up a failed campaign: goal = 1 ETH, only 0.3 ETH donated
// //       await crowdfunding
// //         .connect(alice)
// //         .createCampaign("Scholar Fund", "desc", ethers.parseEther("1"), 3600 * 24);

// //       await crowdfunding
// //         .connect(bob)
// //         .donate(1, { value: ethers.parseEther("0.3") });

// //       await increaseTime(3600 * 24 + 10);
// //       await crowdfunding.connect(admin).finalizeCampaign(1);
// //     });

// //     it("should refund donor and emit RefundWithdrawn", async () => {
// //       await expect(crowdfunding.connect(bob).withdrawRefund(1))
// //         .to.emit(crowdfunding, "RefundWithdrawn")
// //         .withArgs(1, bob.address, ethers.parseEther("0.3"));
// //     });

// //     it("should return ETH to donor's wallet", async () => {
// //       const bobBalanceBefore = await ethers.provider.getBalance(bob.address);

// //       const tx = await crowdfunding.connect(bob).withdrawRefund(1);
// //       const receipt = await tx.wait();
// //       const gasCost = receipt.gasUsed * receipt.gasPrice;

// //       const bobBalanceAfter = await ethers.provider.getBalance(bob.address);

// //       // Bob should get back ~0.3 ETH minus gas
// //       expect(bobBalanceAfter).to.be.gt(bobBalanceBefore - gasCost);
// //     });

// //     it("should zero out contribution after refund", async () => {
// //       await crowdfunding.connect(bob).withdrawRefund(1);

// //       const contribution = await crowdfunding.getContribution(1, bob.address);
// //       expect(contribution).to.equal(0);
// //     });

// //     it("should reject double refund", async () => {
// //       await crowdfunding.connect(bob).withdrawRefund(1);

// //       await expect(
// //         crowdfunding.connect(bob).withdrawRefund(1)
// //       ).to.be.revertedWith("No contribution to withdraw");
// //     });

// //     it("should reject refund from non-donor", async () => {
// //       await expect(
// //         crowdfunding.connect(carol).withdrawRefund(1)
// //       ).to.be.revertedWith("No contribution to withdraw");
// //     });

// //     it("should reject refund on a successful campaign", async () => {
// //       // Create a second campaign that succeeds
// //       await crowdfunding
// //         .connect(alice)
// //         .createCampaign("Success Fund", "desc", ethers.parseEther("1"), 3600 * 24);

// //       await crowdfunding
// //         .connect(bob)
// //         .donate(2, { value: ethers.parseEther("1") });

// //       await increaseTime(3600 * 24 + 10);
// //       await crowdfunding.connect(admin).finalizeCampaign(2);

// //       await expect(
// //         crowdfunding.connect(bob).withdrawRefund(2)
// //       ).to.be.revertedWith("Campaign not failed");
// //     });
// //   });

// //   // ─────────────────────────────────────────────
// //   // 6. FULL END-TO-END FLOW
// //   // ─────────────────────────────────────────────
// //   describe("Full flow", function () {
// //     it("create → donate (multiple users) → finalize → refund", async () => {
// //       // Alice creates campaign
// //       await crowdfunding
// //         .connect(alice)
// //         .createCampaign("EduFund", "Support students", ethers.parseEther("2"), 3600 * 24);

// //       // Bob and Carol donate but goal is not met
// //       await crowdfunding
// //         .connect(bob)
// //         .donate(1, { value: ethers.parseEther("0.5") });

// //       await crowdfunding
// //         .connect(carol)
// //         .donate(1, { value: ethers.parseEther("0.6") });

// //       // Verify raised amount
// //       const mid = await crowdfunding.getCampaign(1);
// //       expect(mid.raised).to.equal(ethers.parseEther("1.1"));

// //       // Move past deadline
// //       await increaseTime(3600 * 24 + 10);

// //       // Anyone can finalize — admin does it here
// //       await crowdfunding.connect(admin).finalizeCampaign(1);

// //       const c = await crowdfunding.getCampaign(1);
// //       expect(c.state).to.equal(2); // Failed

// //       // Both donors can withdraw their refunds
// //       await crowdfunding.connect(bob).withdrawRefund(1);
// //       await crowdfunding.connect(carol).withdrawRefund(1);

// //       // Contributions zeroed out
// //       expect(await crowdfunding.getContribution(1, bob.address)).to.equal(0);
// //       expect(await crowdfunding.getContribution(1, carol.address)).to.equal(0);
// //     });

// //     it("create → donate → finalize → creator receives funds", async () => {
// //       await crowdfunding
// //         .connect(alice)
// //         .createCampaign("EduFund", "Support students", ethers.parseEther("1"), 3600 * 24);

// //       await crowdfunding
// //         .connect(bob)
// //         .donate(1, { value: ethers.parseEther("1") });

// //       await increaseTime(3600 * 24 + 10);

// //       const aliceBefore = await ethers.provider.getBalance(alice.address);

// //       await crowdfunding.connect(admin).finalizeCampaign(1);

// //       const aliceAfter = await ethers.provider.getBalance(alice.address);
// //       expect(aliceAfter).to.be.gt(aliceBefore);

// //       const c = await crowdfunding.getCampaign(1);
// //       expect(c.state).to.equal(1); // Successful
// //     });
// //   });
// // });


// import { expect } from "chai";
// import hre from "hardhat";

// const { ethers } = hre;

// async function increaseTime(seconds) {
//   await ethers.provider.send("evm_increaseTime", [seconds]);
//   await ethers.provider.send("evm_mine");
// }

// describe("Crowdfunding", function () {
//   let crowdfunding;
//   let admin, alice, bob, carol;

//   beforeEach(async () => {
//     [admin, alice, bob, carol] = await ethers.getSigners();
//     const CF = await ethers.getContractFactory("Crowdfunding");
//     crowdfunding = await CF.deploy();
//     await crowdfunding.waitForDeployment();
//   });

//   // ─────────────────────────────────────────────
//   // 1. CAMPAIGN CREATION
//   // ─────────────────────────────────────────────
//   describe("createCampaign", function () {
//     it("should create a campaign and emit CampaignCreated event", async () => {
//       await expect(
//         crowdfunding
//           .connect(alice)
//           .createCampaign("Scholar Fund", "Support students", ethers.parseEther("1"), 3600 * 24)
//       ).to.emit(crowdfunding, "CampaignCreated");
//     });

//     it("should increment campaignCount after creation", async () => {
//       expect(await crowdfunding.campaignCount()).to.equal(0);
//       await crowdfunding.connect(alice).createCampaign("Fund A", "desc", ethers.parseEther("1"), 3600);
//       expect(await crowdfunding.campaignCount()).to.equal(1);
//       await crowdfunding.connect(bob).createCampaign("Fund B", "desc", ethers.parseEther("2"), 7200);
//       expect(await crowdfunding.campaignCount()).to.equal(2);
//     });

//     it("should reject a campaign with zero goal", async () => {
//       await expect(
//         crowdfunding.connect(alice).createCampaign("Bad", "desc", 0, 3600)
//       ).to.be.revertedWith("Goal must be > 0");
//     });

//     it("should reject a campaign with zero duration", async () => {
//       await expect(
//         crowdfunding.connect(alice).createCampaign("Bad", "desc", ethers.parseEther("1"), 0)
//       ).to.be.revertedWith("Duration must be > 0");
//     });

//     it("should store campaign details correctly", async () => {
//       const goal = ethers.parseEther("2");
//       await crowdfunding.connect(alice).createCampaign("EduFund", "Help students", goal, 3600 * 48);
//       const c = await crowdfunding.getCampaign(1);
//       expect(c.creator).to.equal(alice.address);
//       expect(c.title).to.equal("EduFund");
//       expect(c.description).to.equal("Help students");
//       expect(c.goal).to.equal(goal);
//       expect(c.raised).to.equal(0);
//       expect(c.finalized).to.be.false;
//       expect(c.state).to.equal(0n);
//     });
//   });

//   // ─────────────────────────────────────────────
//   // 2. DONATIONS
//   // ─────────────────────────────────────────────
//   describe("donate", function () {
//     beforeEach(async () => {
//       await crowdfunding
//         .connect(alice)
//         .createCampaign("Scholar Fund", "Support students", ethers.parseEther("1"), 3600 * 24);
//     });

//     it("should accept a valid donation and emit DonationReceived", async () => {
//       const amount = ethers.parseEther("0.5");
//       await expect(crowdfunding.connect(bob).donate(1, { value: amount }))
//         .to.emit(crowdfunding, "DonationReceived")
//         .withArgs(1, bob.address, amount);
//     });

//     it("should update the raised amount after donation", async () => {
//       await crowdfunding.connect(bob).donate(1, { value: ethers.parseEther("0.3") });
//       await crowdfunding.connect(carol).donate(1, { value: ethers.parseEther("0.4") });
//       const c = await crowdfunding.getCampaign(1);
//       expect(c.raised).to.equal(ethers.parseEther("0.7"));
//     });

//     it("should reject donations below the minimum (0.01 ETH)", async () => {
//       await expect(
//         crowdfunding.connect(bob).donate(1, { value: ethers.parseEther("0.001") })
//       ).to.be.revertedWith("Minimum donation is 0.01 ETH");
//     });

//     it("should reject donations from the campaign creator", async () => {
//       await expect(
//         crowdfunding.connect(alice).donate(1, { value: ethers.parseEther("0.5") })
//       ).to.be.revertedWith("Creator cannot donate");
//     });

//     it("should reject donations after the deadline", async () => {
//       await increaseTime(3600 * 24 + 10);
//       await expect(
//         crowdfunding.connect(bob).donate(1, { value: ethers.parseEther("0.5") })
//       ).to.be.revertedWith("Campaign has ended");
//     });

//     it("should record contribution correctly", async () => {
//       const amount = ethers.parseEther("0.6");
//       await crowdfunding.connect(bob).donate(1, { value: amount });
//       const contribution = await crowdfunding.getContribution(1, bob.address);
//       expect(contribution).to.equal(amount);
//     });

//     it("should add donor to donors list", async () => {
//       await crowdfunding.connect(bob).donate(1, { value: ethers.parseEther("0.2") });
//       const donors = await crowdfunding.getDonors(1);
//       expect(donors).to.include(bob.address);
//     });
//   });

//   // ─────────────────────────────────────────────
//   // 3. FINALIZE — SUCCESSFUL
//   // ─────────────────────────────────────────────
//   describe("finalizeCampaign — success", function () {
//     it("should mark campaign Successful and pay creator when goal is met", async () => {
//       await crowdfunding
//         .connect(alice)
//         .createCampaign("Scholar Fund", "desc", ethers.parseEther("1"), 3600 * 24);
//       await crowdfunding.connect(bob).donate(1, { value: ethers.parseEther("0.6") });
//       await crowdfunding.connect(carol).donate(1, { value: ethers.parseEther("0.5") });
//       await increaseTime(3600 * 24 + 10);

//       const aliceBefore = await ethers.provider.getBalance(alice.address);
//       await expect(crowdfunding.connect(admin).finalizeCampaign(1))
//         .to.emit(crowdfunding, "CampaignFinalized");

//       const c = await crowdfunding.getCampaign(1);
//       expect(c.state).to.equal(1n);
//       expect(c.finalized).to.be.true;
//       expect(await ethers.provider.getBalance(alice.address)).to.be.gt(aliceBefore);
//     });
//   });

//   // ─────────────────────────────────────────────
//   // 4. FINALIZE — FAILED
//   // ─────────────────────────────────────────────
//   describe("finalizeCampaign — failure", function () {
//     it("should mark campaign Failed when goal is not met", async () => {
//       await crowdfunding
//         .connect(alice)
//         .createCampaign("Scholar Fund", "desc", ethers.parseEther("1"), 3600 * 24);
//       await crowdfunding.connect(bob).donate(1, { value: ethers.parseEther("0.3") });
//       await increaseTime(3600 * 24 + 10);
//       await crowdfunding.connect(admin).finalizeCampaign(1);

//       const c = await crowdfunding.getCampaign(1);
//       expect(c.state).to.equal(2n);
//       expect(c.finalized).to.be.true;
//     });

//     it("should reject finalization before the deadline", async () => {
//       await crowdfunding
//         .connect(alice)
//         .createCampaign("Scholar Fund", "desc", ethers.parseEther("1"), 3600 * 24);
//       await expect(
//         crowdfunding.connect(admin).finalizeCampaign(1)
//       ).to.be.revertedWith("Campaign still ongoing");
//     });

//     it("should reject double finalization", async () => {
//       await crowdfunding
//         .connect(alice)
//         .createCampaign("Scholar Fund", "desc", ethers.parseEther("1"), 3600 * 24);
//       await increaseTime(3600 * 24 + 10);
//       await crowdfunding.connect(admin).finalizeCampaign(1);
//       await expect(
//         crowdfunding.connect(admin).finalizeCampaign(1)
//       ).to.be.revertedWith("Already finalized");
//     });
//   });

//   // ─────────────────────────────────────────────
//   // 5. REFUNDS
//   // ─────────────────────────────────────────────
//   describe("withdrawRefund", function () {
//     beforeEach(async () => {
//       await crowdfunding
//         .connect(alice)
//         .createCampaign("Scholar Fund", "desc", ethers.parseEther("1"), 3600 * 24);
//       await crowdfunding.connect(bob).donate(1, { value: ethers.parseEther("0.3") });
//       await increaseTime(3600 * 24 + 10);
//       await crowdfunding.connect(admin).finalizeCampaign(1);
//     });

//     it("should refund donor and emit RefundWithdrawn", async () => {
//       await expect(crowdfunding.connect(bob).withdrawRefund(1))
//         .to.emit(crowdfunding, "RefundWithdrawn")
//         .withArgs(1, bob.address, ethers.parseEther("0.3"));
//     });

//     it("should return ETH to donor's wallet", async () => {
//       const bobBefore = await ethers.provider.getBalance(bob.address);
//       const tx = await crowdfunding.connect(bob).withdrawRefund(1);
//       const receipt = await tx.wait();
//       const gasCost = receipt.gasUsed * receipt.gasPrice;
//       const bobAfter = await ethers.provider.getBalance(bob.address);
//       expect(bobAfter).to.be.gt(bobBefore - gasCost);
//     });

//     it("should zero out contribution after refund", async () => {
//       await crowdfunding.connect(bob).withdrawRefund(1);
//       expect(await crowdfunding.getContribution(1, bob.address)).to.equal(0);
//     });

//     it("should reject double refund", async () => {
//       await crowdfunding.connect(bob).withdrawRefund(1);
//       await expect(
//         crowdfunding.connect(bob).withdrawRefund(1)
//       ).to.be.revertedWith("No contribution to withdraw");
//     });

//     it("should reject refund from non-donor", async () => {
//       await expect(
//         crowdfunding.connect(carol).withdrawRefund(1)
//       ).to.be.revertedWith("No contribution to withdraw");
//     });

//     it("should reject refund on a successful campaign", async () => {
//       await crowdfunding
//         .connect(alice)
//         .createCampaign("Success Fund", "desc", ethers.parseEther("1"), 3600 * 24);
//       await crowdfunding.connect(bob).donate(2, { value: ethers.parseEther("1") });
//       await increaseTime(3600 * 24 + 10);
//       await crowdfunding.connect(admin).finalizeCampaign(2);
//       await expect(
//         crowdfunding.connect(bob).withdrawRefund(2)
//       ).to.be.revertedWith("Campaign not failed");
//     });
//   });

//   // ─────────────────────────────────────────────
//   // 6. FULL END-TO-END FLOW
//   // ─────────────────────────────────────────────
//   describe("Full flow", function () {
//     it("create → donate (multiple users) → finalize → refund", async () => {
//       await crowdfunding
//         .connect(alice)
//         .createCampaign("EduFund", "Support students", ethers.parseEther("2"), 3600 * 24);

//       await crowdfunding.connect(bob).donate(1, { value: ethers.parseEther("0.5") });
//       await crowdfunding.connect(carol).donate(1, { value: ethers.parseEther("0.6") });

//       const mid = await crowdfunding.getCampaign(1);
//       expect(mid.raised).to.equal(ethers.parseEther("1.1"));

//       await increaseTime(3600 * 24 + 10);
//       await crowdfunding.connect(admin).finalizeCampaign(1);

//       const c = await crowdfunding.getCampaign(1);
//       expect(c.state).to.equal(2n);

//       await crowdfunding.connect(bob).withdrawRefund(1);
//       await crowdfunding.connect(carol).withdrawRefund(1);

//       expect(await crowdfunding.getContribution(1, bob.address)).to.equal(0);
//       expect(await crowdfunding.getContribution(1, carol.address)).to.equal(0);
//     });

//     it("create → donate → finalize → creator receives funds", async () => {
//       await crowdfunding
//         .connect(alice)
//         .createCampaign("EduFund", "Support students", ethers.parseEther("1"), 3600 * 24);

//       await crowdfunding.connect(bob).donate(1, { value: ethers.parseEther("1") });
//       await increaseTime(3600 * 24 + 10);

//       const aliceBefore = await ethers.provider.getBalance(alice.address);
//       await crowdfunding.connect(admin).finalizeCampaign(1);
//       const aliceAfter = await ethers.provider.getBalance(alice.address);

//       expect(aliceAfter).to.be.gt(aliceBefore);
//       const c = await crowdfunding.getCampaign(1);
//       expect(c.state).to.equal(1n);
//     });
//   });
// });


import { expect } from "chai";
import hre from "hardhat";

// Create a single network connection shared across all tests
const { ethers, networkHelpers } = await hre.network.create();

// Helper: move blockchain time forward
async function increaseTime(seconds) {
  await ethers.provider.send("evm_increaseTime", [seconds]);
  await ethers.provider.send("evm_mine");
}

describe("Crowdfunding", function () {
  let crowdfunding;
  let admin, alice, bob, carol;

  beforeEach(async () => {
    [admin, alice, bob, carol] = await ethers.getSigners();
    const CF = await ethers.getContractFactory("Crowdfunding");
    crowdfunding = await CF.deploy();
    await crowdfunding.waitForDeployment();
  });

  // ─────────────────────────────────────────────
  // 1. CAMPAIGN CREATION
  // ─────────────────────────────────────────────
  describe("createCampaign", function () {
    it("should create a campaign and emit CampaignCreated event", async () => {
      await expect(
        crowdfunding
          .connect(alice)
          .createCampaign("Scholar Fund", "Support students", ethers.parseEther("1"), 3600 * 24)
      ).to.emit(crowdfunding, "CampaignCreated");
    });

    it("should increment campaignCount after creation", async () => {
      expect(await crowdfunding.campaignCount()).to.equal(0);
      await crowdfunding.connect(alice).createCampaign("Fund A", "desc", ethers.parseEther("1"), 3600);
      expect(await crowdfunding.campaignCount()).to.equal(1);
      await crowdfunding.connect(bob).createCampaign("Fund B", "desc", ethers.parseEther("2"), 7200);
      expect(await crowdfunding.campaignCount()).to.equal(2);
    });

    it("should reject a campaign with zero goal", async () => {
      await expect(
        crowdfunding.connect(alice).createCampaign("Bad", "desc", 0, 3600)
      ).to.be.revertedWith("Goal must be > 0");
    });

    it("should reject a campaign with zero duration", async () => {
      await expect(
        crowdfunding.connect(alice).createCampaign("Bad", "desc", ethers.parseEther("1"), 0)
      ).to.be.revertedWith("Duration must be > 0");
    });

    it("should store campaign details correctly", async () => {
      const goal = ethers.parseEther("2");
      await crowdfunding.connect(alice).createCampaign("EduFund", "Help students", goal, 3600 * 48);
      const c = await crowdfunding.getCampaign(1);
      expect(c.creator).to.equal(alice.address);
      expect(c.title).to.equal("EduFund");
      expect(c.description).to.equal("Help students");
      expect(c.goal).to.equal(goal);
      expect(c.raised).to.equal(0);
      expect(c.finalized).to.be.false;
      expect(c.state).to.equal(0n);
    });
  });

  // ─────────────────────────────────────────────
  // 2. DONATIONS
  // ─────────────────────────────────────────────
  describe("donate", function () {
    beforeEach(async () => {
      await crowdfunding
        .connect(alice)
        .createCampaign("Scholar Fund", "Support students", ethers.parseEther("1"), 3600 * 24);
    });

    it("should accept a valid donation and emit DonationReceived", async () => {
      const amount = ethers.parseEther("0.5");
      await expect(crowdfunding.connect(bob).donate(1, { value: amount }))
        .to.emit(crowdfunding, "DonationReceived")
        .withArgs(1, bob.address, amount);
    });

    it("should update the raised amount after donation", async () => {
      await crowdfunding.connect(bob).donate(1, { value: ethers.parseEther("0.3") });
      await crowdfunding.connect(carol).donate(1, { value: ethers.parseEther("0.4") });
      const c = await crowdfunding.getCampaign(1);
      expect(c.raised).to.equal(ethers.parseEther("0.7"));
    });

    it("should reject donations below the minimum (0.01 ETH)", async () => {
      await expect(
        crowdfunding.connect(bob).donate(1, { value: ethers.parseEther("0.001") })
      ).to.be.revertedWith("Minimum donation is 0.01 ETH");
    });

    it("should reject donations from the campaign creator", async () => {
      await expect(
        crowdfunding.connect(alice).donate(1, { value: ethers.parseEther("0.5") })
      ).to.be.revertedWith("Creator cannot donate");
    });

    it("should reject donations after the deadline", async () => {
      await increaseTime(3600 * 24 + 10);
      await expect(
        crowdfunding.connect(bob).donate(1, { value: ethers.parseEther("0.5") })
      ).to.be.revertedWith("Campaign has ended");
    });

    it("should record contribution correctly", async () => {
      const amount = ethers.parseEther("0.6");
      await crowdfunding.connect(bob).donate(1, { value: amount });
      const contribution = await crowdfunding.getContribution(1, bob.address);
      expect(contribution).to.equal(amount);
    });

    it("should add donor to donors list", async () => {
      await crowdfunding.connect(bob).donate(1, { value: ethers.parseEther("0.2") });
      const donors = await crowdfunding.getDonors(1);
      expect(donors).to.include(bob.address);
    });
  });

  // ─────────────────────────────────────────────
  // 3. FINALIZE — SUCCESSFUL
  // ─────────────────────────────────────────────
  describe("finalizeCampaign — success", function () {
    it("should mark campaign Successful and pay creator when goal is met", async () => {
      await crowdfunding
        .connect(alice)
        .createCampaign("Scholar Fund", "desc", ethers.parseEther("1"), 3600 * 24);
      await crowdfunding.connect(bob).donate(1, { value: ethers.parseEther("0.6") });
      await crowdfunding.connect(carol).donate(1, { value: ethers.parseEther("0.5") });
      await increaseTime(3600 * 24 + 10);

      const aliceBefore = await ethers.provider.getBalance(alice.address);
      await expect(crowdfunding.connect(admin).finalizeCampaign(1))
        .to.emit(crowdfunding, "CampaignFinalized");

      const c = await crowdfunding.getCampaign(1);
      expect(c.state).to.equal(1n);
      expect(c.finalized).to.be.true;
      expect(await ethers.provider.getBalance(alice.address)).to.be.gt(aliceBefore);
    });
  });

  // ─────────────────────────────────────────────
  // 4. FINALIZE — FAILED
  // ─────────────────────────────────────────────
  describe("finalizeCampaign — failure", function () {
    it("should mark campaign Failed when goal is not met", async () => {
      await crowdfunding
        .connect(alice)
        .createCampaign("Scholar Fund", "desc", ethers.parseEther("1"), 3600 * 24);
      await crowdfunding.connect(bob).donate(1, { value: ethers.parseEther("0.3") });
      await increaseTime(3600 * 24 + 10);
      await crowdfunding.connect(admin).finalizeCampaign(1);
      const c = await crowdfunding.getCampaign(1);
      expect(c.state).to.equal(2n);
      expect(c.finalized).to.be.true;
    });

    it("should reject finalization before the deadline", async () => {
      await crowdfunding
        .connect(alice)
        .createCampaign("Scholar Fund", "desc", ethers.parseEther("1"), 3600 * 24);
      await expect(
        crowdfunding.connect(admin).finalizeCampaign(1)
      ).to.be.revertedWith("Campaign still ongoing");
    });

    it("should reject double finalization", async () => {
      await crowdfunding
        .connect(alice)
        .createCampaign("Scholar Fund", "desc", ethers.parseEther("1"), 3600 * 24);
      await increaseTime(3600 * 24 + 10);
      await crowdfunding.connect(admin).finalizeCampaign(1);
      await expect(
        crowdfunding.connect(admin).finalizeCampaign(1)
      ).to.be.revertedWith("Already finalized");
    });
  });

  // ─────────────────────────────────────────────
  // 5. REFUNDS
  // ─────────────────────────────────────────────
  describe("withdrawRefund", function () {
    beforeEach(async () => {
      await crowdfunding
        .connect(alice)
        .createCampaign("Scholar Fund", "desc", ethers.parseEther("1"), 3600 * 24);
      await crowdfunding.connect(bob).donate(1, { value: ethers.parseEther("0.3") });
      await increaseTime(3600 * 24 + 10);
      await crowdfunding.connect(admin).finalizeCampaign(1);
    });

    it("should refund donor and emit RefundWithdrawn", async () => {
      await expect(crowdfunding.connect(bob).withdrawRefund(1))
        .to.emit(crowdfunding, "RefundWithdrawn")
        .withArgs(1, bob.address, ethers.parseEther("0.3"));
    });

    it("should return ETH to donor's wallet", async () => {
      const bobBefore = await ethers.provider.getBalance(bob.address);
      const tx = await crowdfunding.connect(bob).withdrawRefund(1);
      const receipt = await tx.wait();
      const gasCost = receipt.gasUsed * receipt.gasPrice;
      const bobAfter = await ethers.provider.getBalance(bob.address);
      expect(bobAfter).to.be.gt(bobBefore - gasCost);
    });

    it("should zero out contribution after refund", async () => {
      await crowdfunding.connect(bob).withdrawRefund(1);
      expect(await crowdfunding.getContribution(1, bob.address)).to.equal(0);
    });

    it("should reject double refund", async () => {
      await crowdfunding.connect(bob).withdrawRefund(1);
      await expect(
        crowdfunding.connect(bob).withdrawRefund(1)
      ).to.be.revertedWith("No contribution to withdraw");
    });

    it("should reject refund from non-donor", async () => {
      await expect(
        crowdfunding.connect(carol).withdrawRefund(1)
      ).to.be.revertedWith("No contribution to withdraw");
    });

    it("should reject refund on a successful campaign", async () => {
      await crowdfunding
        .connect(alice)
        .createCampaign("Success Fund", "desc", ethers.parseEther("1"), 3600 * 24);
      await crowdfunding.connect(bob).donate(2, { value: ethers.parseEther("1") });
      await increaseTime(3600 * 24 + 10);
      await crowdfunding.connect(admin).finalizeCampaign(2);
      await expect(
        crowdfunding.connect(bob).withdrawRefund(2)
      ).to.be.revertedWith("Campaign not failed");
    });
  });

  // ─────────────────────────────────────────────
  // 6. FULL END-TO-END FLOW
  // ─────────────────────────────────────────────
  describe("Full flow", function () {
    it("create → donate (multiple users) → finalize → refund", async () => {
      await crowdfunding
        .connect(alice)
        .createCampaign("EduFund", "Support students", ethers.parseEther("2"), 3600 * 24);

      await crowdfunding.connect(bob).donate(1, { value: ethers.parseEther("0.5") });
      await crowdfunding.connect(carol).donate(1, { value: ethers.parseEther("0.6") });

      const mid = await crowdfunding.getCampaign(1);
      expect(mid.raised).to.equal(ethers.parseEther("1.1"));

      await increaseTime(3600 * 24 + 10);
      await crowdfunding.connect(admin).finalizeCampaign(1);

      const c = await crowdfunding.getCampaign(1);
      expect(c.state).to.equal(2n);

      await crowdfunding.connect(bob).withdrawRefund(1);
      await crowdfunding.connect(carol).withdrawRefund(1);

      expect(await crowdfunding.getContribution(1, bob.address)).to.equal(0);
      expect(await crowdfunding.getContribution(1, carol.address)).to.equal(0);
    });

    it("create → donate → finalize → creator receives funds", async () => {
      await crowdfunding
        .connect(alice)
        .createCampaign("EduFund", "Support students", ethers.parseEther("1"), 3600 * 24);

      await crowdfunding.connect(bob).donate(1, { value: ethers.parseEther("1") });
      await increaseTime(3600 * 24 + 10);

      const aliceBefore = await ethers.provider.getBalance(alice.address);
      await crowdfunding.connect(admin).finalizeCampaign(1);
      const aliceAfter = await ethers.provider.getBalance(alice.address);

      expect(aliceAfter).to.be.gt(aliceBefore);
      const c = await crowdfunding.getCampaign(1);
      expect(c.state).to.equal(1n);
    });
  });
});