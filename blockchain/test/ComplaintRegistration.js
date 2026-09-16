const { expect } = require('chai');

describe('ComplaintRegistration', function () {
  async function deployed() {
    const [owner, user, stranger] = await ethers.getSigners();
    const Factory = await ethers.getContractFactory('ComplaintRegistration');
    const contract = await Factory.deploy();
    return { contract, owner, user, stranger };
  }

  it('assigns the deployer as owner and registers complaints', async function () {
    const { contract, user } = await deployed();
    await expect(contract.connect(user).registerComplaint('Street light', 'The light is out'))
      .to.emit(contract, 'ComplaintRegistered');
    const complaint = await contract.getComplaint(1);
    expect(complaint.complainant).to.equal(user.address);
    expect(complaint.status).to.equal(0);
  });

  it('rejects invalid registration and IDs', async function () {
    const { contract } = await deployed();
    await expect(contract.registerComplaint('', 'Description')).to.be.revertedWith('Complaint title is required');
    await expect(contract.registerComplaint('Title', '')).to.be.revertedWith('Complaint description is required');
    await expect(contract.getComplaint(1)).to.be.revertedWith('Invalid complaint ID');
  });

  it('restricts and records status changes', async function () {
    const { contract, owner, user, stranger } = await deployed();
    await contract.connect(user).registerComplaint('Noise', 'Night noise');
    await expect(contract.connect(stranger).updateComplaintStatus(1, 2))
      .to.be.revertedWith('Only the owner can update status');
    await expect(contract.connect(owner).updateComplaintStatus(1, 2))
      .to.emit(contract, 'ComplaintStatusUpdated');
    expect((await contract.getComplaint(1)).status).to.equal(2);
  });
});