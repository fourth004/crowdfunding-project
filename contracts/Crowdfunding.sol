// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

/*
Crowdfunding contract for EduFund
Features:
- Create campaign (title, description, goal, deadline)
- Donate to campaign (payable)
- Finalize campaign after deadline (anyone can call)
   - if raised >= goal -> success and transfer to creator
   - else -> failed and donors can withdraw their contributions
- Donors are recorded and can withdraw refunds (withdraw pattern)
- Events for front-end indexing
*/


contract Crowdfunding {
    enum CampaignState { Ongoing, Successful, Failed }

    struct Campaign {
        address payable creator;
        string title;
        string description;
        uint256 goal;        // in wei
        uint256 deadline;    // timestamp
        uint256 raised;      // wei collected
        CampaignState state;
        bool finalized;
    }
    uint256 public constant MIN_DONATION = 0.01 ether;
    uint256 public campaignCount;
    mapping(uint256 => Campaign) public campaigns;

    // contributions[cid][donor] = amountWei
    mapping(uint256 => mapping(address => uint256)) public contributions;
    // donors list
    mapping(uint256 => address[]) private donorsList;

    // reentrancy guard
    bool private locked;

    event CampaignCreated(uint256 indexed campaignId, address indexed creator, string title, uint256 goal, uint256 deadline);
    event DonationReceived(uint256 indexed campaignId, address indexed donor, uint256 amount);
    event CampaignFinalized(uint256 indexed campaignId, CampaignState state);
    event RefundWithdrawn(uint256 indexed campaignId, address indexed donor, uint256 amount);

    modifier noReentrant() {
        require(!locked, "Reentrant call");
        locked = true;
        _;
        locked = false;
    }

    constructor() {
        campaignCount = 0;
    }

    function createCampaign(
        string memory _title,
        string memory _description,
        uint256 _goalWei,
        uint256 _durationSeconds
    ) external returns (uint256) {
        require(_goalWei > 0, "Goal must be > 0");
        require(_durationSeconds > 0, "Duration must be > 0");

        campaignCount += 1;
        uint256 cid = campaignCount;

        campaigns[cid] = Campaign({
            creator: payable(msg.sender),
            title: _title,
            description: _description,
            goal: _goalWei,
            deadline: block.timestamp + _durationSeconds,
            raised: 0,
            state: CampaignState.Ongoing,
            finalized: false
        });

        emit CampaignCreated(cid, msg.sender, _title, _goalWei, campaigns[cid].deadline);
        return cid;
    }

    function donate(uint256 _campaignId) external payable {
    Campaign storage c = campaigns[_campaignId];
    require(c.creator != address(0), "Campaign does not exist");
    require(block.timestamp < c.deadline, "Campaign has ended");
    require(!c.finalized, "Campaign finalized");
    require(c.state == CampaignState.Ongoing, "Campaign not active");
    require(msg.sender != c.creator, "Creator cannot donate");
    require(msg.value >= MIN_DONATION, "Minimum donation is 0.01 ETH");

    if (contributions[_campaignId][msg.sender] == 0) {
        donorsList[_campaignId].push(msg.sender);
    }

    contributions[_campaignId][msg.sender] += msg.value;
    c.raised += msg.value;

    emit DonationReceived(_campaignId, msg.sender, msg.value);
}


    // anyone can finalize after deadline to mark success/fail
    function finalizeCampaign(uint256 _campaignId) external noReentrant {
        Campaign storage c = campaigns[_campaignId];
        require(c.creator != address(0), "Campaign does not exist");
        require(block.timestamp >= c.deadline, "Campaign still ongoing");
        require(!c.finalized, "Already finalized");

        c.finalized = true;

        if (c.raised >= c.goal) {
            c.state = CampaignState.Successful;
            // transfer funds to creator
            (bool ok, ) = c.creator.call{value: c.raised}("");
            require(ok, "Transfer to creator failed");
        } else {
            c.state = CampaignState.Failed;
            // funds remain in contract until donors withdraw using withdrawRefund
        }

        emit CampaignFinalized(_campaignId, c.state);
    }

    // donors can withdraw refunds if campaign failed
    function withdrawRefund(uint256 _campaignId) external noReentrant {
        Campaign storage c = campaigns[_campaignId];
        require(c.creator != address(0), "Campaign does not exist");
        require(c.finalized, "Campaign not finalized yet");
        require(c.state == CampaignState.Failed, "Campaign not failed");

        uint256 amount = contributions[_campaignId][msg.sender];
        require(amount > 0, "No contribution to withdraw");

        // zero out before transfer (withdraw pattern)
        contributions[_campaignId][msg.sender] = 0;
        (bool ok, ) = payable(msg.sender).call{value: amount}("");
        require(ok, "Refund transfer failed");

        emit RefundWithdrawn(_campaignId, msg.sender, amount);
    }

    // view helpers
    function getDonors(uint256 _campaignId) external view returns (address[] memory) {
        return donorsList[_campaignId];
    }

    function getContribution(uint256 _campaignId, address _donor) external view returns (uint256) {
        return contributions[_campaignId][_donor];
    }

    function getCampaign(uint256 _campaignId) external view returns (
        address creator,
        string memory title,
        string memory description,
        uint256 goal,
        uint256 deadline,
        uint256 raised,
        CampaignState state,
        bool finalized
    ) {
        Campaign storage c = campaigns[_campaignId];
        return (c.creator, c.title, c.description, c.goal, c.deadline, c.raised, c.state, c.finalized);
    }

    // fallback to accept direct payments (not used)
    receive() external payable {}
}
