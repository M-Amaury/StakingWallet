const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");


module.exports = buildModule("StakingModule", (m) => {
  const staking = m.contract("Staking");

  return { staking };
});
