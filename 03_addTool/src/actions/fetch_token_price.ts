import { Action } from "../types/action";
import { CustomSolanaAgentKit } from "../agent";
import { z } from "zod";
import { FetchTokenPriceTool } from "../tools";

const fetchTokenPriceTool = new FetchTokenPriceTool(
  new CustomSolanaAgentKit(
    process.env.SOLANA_PRIVATE_KEY || "",
    process.env.RPC_URL || "",
    { OPENAI_API_KEY: process.env.OPENAI_API_KEY || "" }
  )
);

const fetchTokenPriceAction: Action = {
  name: "FETCH_TOKEN_PRICE",
  similes: ["fetch token price"],
  description: "Fetches the current price of a specified token.",
  examples: [
    {
      input: { tokenSymbol: "SOL" },
      output: {
        status: "success",
        message: "Price fetched successfully for SOL.",
        data: { token: "SOL", price: 150 },
      },
      explanation: "Fetch the current price of SOL token in USDC",
    },
  ],
  schema: z.object({
    tokenSymbol: z
      .string()
      .describe("The symbol of the token to fetch the price for"),
  }),
  handler: async (agent: CustomSolanaAgentKit, input: Record<string, any>) => {
    console.log("ddddddd");
    const result = await fetchTokenPriceTool._call(input.tokenSymbol);
    return JSON.parse(result); // `FetchTokenPriceTool` は `string` を返すため、JSON.parse でオブジェクトにする
  },
};

export default fetchTokenPriceAction;
