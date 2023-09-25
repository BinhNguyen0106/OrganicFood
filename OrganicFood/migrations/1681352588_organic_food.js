var OrganicFood = artifacts.require('./OrganicFood.sol'); 
module.exports = function(_deployer) {
  // Use deployer to state migration tasks.
  _deployer.deploy(OrganicFood);
};
