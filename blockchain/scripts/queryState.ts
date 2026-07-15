import { ethers } from "hardhat";
import * as fs from "fs";
import * as path from "path";

async function main() {
  const contractDetailsPath = path.join(__dirname, "../../backend/src/config/contractDetails.json");
  if (!fs.existsSync(contractDetailsPath)) {
    console.error("❌ Deployed contract details not found. Please run: npm run deploy:local first.");
    return;
  }

  const details = JSON.parse(fs.readFileSync(contractDetailsPath, "utf8"));
  const farmMarketplace = await ethers.getContractAt("FarmMarketplace", details.address);

  console.log("=================================================");
  console.log("⛓️  FARM MARKETPLACE ON-CHAIN STATE");
  console.log(`📍 Contract Address: ${details.address}`);
  console.log("=================================================");

  const productCount = await farmMarketplace.productCount();
  const orderCount = await farmMarketplace.orderCount();

  console.log(`📦 Total Products Registered: ${productCount}`);
  console.log(`🧾 Total Orders Placed:     ${orderCount}`);
  console.log("=================================================");

  if (Number(productCount) > 0) {
    console.log("🛍️  Products on-chain:");
    for (let i = 1; i <= Number(productCount); i++) {
      const product = await farmMarketplace.products(i);
      console.log(`  [Product #${product.id}]`);
      console.log(`    Name:          ${product.name}`);
      console.log(`    Farmer Address: ${product.farmer}`);
      console.log(`    Current Owner:  ${product.currentOwner}`);
      console.log(`    Price:          ${ethers.formatEther(product.price)} ETH`);
      console.log(`    Is Listed:      ${product.isListed}`);
      
      const history = await farmMarketplace.getProductHistory(i);
      console.log(`    History:       ${history.join(" -> ")}`);
      console.log("  ---------------------------------------------");
    }
  } else {
    console.log("ℹ️ No products registered on-chain yet.");
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
