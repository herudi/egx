import { build } from "egx/api";

try {
  build();
  console.log("Success build...");
  console.log("Run Prod :");
  console.log("- npm run start");
} catch (error) {
  console.log(error);
  process.exit(1);
}
