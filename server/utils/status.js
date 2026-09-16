const statusNames = ['Pending', 'In Progress', 'Resolved'];

function contractStatusToName(value) {
  return statusNames[Number(value)] || 'Pending';
}

function statusNameToContract(value) {
  const index = statusNames.indexOf(value);
  return index;
}

module.exports = { statusNames, contractStatusToName, statusNameToContract };