import { ethers } from "hardhat";
import * as fs from "fs";
import * as path from "path";

async function main() {
  const FarmMarketplace = await ethers.getContractFactory("FarmMarketplace");
  const farmMarketplace = await FarmMarketplace.deploy();
  await farmMarketplace.waitForDeployment();

  const contractAddress = await farmMarketplace.getAddress();
  console.log(`🚀 Smart contract deployed to: ${contractAddress}`);

  // Paths to save contract details
  const backendConfigDir = path.join(__dirname, "../../backend/src/config");
  if (!fs.existsSync(backendConfigDir)) {
    fs.mkdirSync(backendConfigDir, { recursive: true });
  }

  const contractDetailsPath = path.join(__dirname, "../artifacts/contracts/FarmMarketplace.sol/FarmMarketplace.json");
  const contractDetails = {
    address: contractAddress,
    abi: JSON.parse(fs.readFileSync(contractDetailsPath, "utf8")).abi
  };

  fs.writeFileSync(
    path.join(backendConfigDir, "contractDetails.json"),
    JSON.stringify(contractDetails, null, 2)
  );
  console.log(`📋 Saved contract details to backend/src/config/contractDetails.json`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
