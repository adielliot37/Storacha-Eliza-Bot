import { createAgent } from "elizaos";
import { storagePlugin } from "@storacha/elizaos-plugin";

export const agent = createAgent({
  name: "VaultBot",
  plugins: [storagePlugin],
});
