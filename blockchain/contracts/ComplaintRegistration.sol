// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract ComplaintRegistration {
    enum Status { Pending, InProgress, Resolved }

    struct Complaint {
        uint256 id;
        address complainant;
        string title;
        string description;
        Status status;
        uint256 timestamp;
    }

    address public owner;
    uint256 private complaintCount;
    mapping(uint256 => Complaint) private complaints;

    event ComplaintRegistered(uint256 indexed complaintId, address indexed complainant, string title, uint256 timestamp);
    event ComplaintStatusUpdated(uint256 indexed complaintId, Status status, uint256 timestamp);

    modifier onlyOwner() {
        require(msg.sender == owner, 'Only the owner can update status');
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function registerComplaint(string memory title, string memory description) external {
        require(bytes(title).length > 0, 'Complaint title is required');
        require(bytes(description).length > 0, 'Complaint description is required');

        complaintCount += 1;
        complaints[complaintCount] = Complaint(
            complaintCount,
            msg.sender,
            title,
            description,
            Status.Pending,
            block.timestamp
        );
        emit ComplaintRegistered(complaintCount, msg.sender, title, block.timestamp);
    }

    function updateComplaintStatus(uint256 complaintId, Status newStatus) external onlyOwner {
        require(complaintId > 0 && complaintId <= complaintCount, 'Invalid complaint ID');
        complaints[complaintId].status = newStatus;
        emit ComplaintStatusUpdated(complaintId, newStatus, block.timestamp);
    }

    function getComplaint(uint256 complaintId) external view returns (Complaint memory) {
        require(complaintId > 0 && complaintId <= complaintCount, 'Invalid complaint ID');
        return complaints[complaintId];
    }

    function getTotalComplaints() external view returns (uint256) {
        return complaintCount;
    }
}