import { Tool } from "langchain/tools";
import { CustomSolanaAgentKit } from "../agent";

export class FetchTokenPriceTool extends Tool {
  name = "fetch_token_price";
  description = "Fetches the current price of a specified token.";

  constructor(private solanaKit: CustomSolanaAgentKit) {
    super();
  }

  public async _call(tokenSymbol: string): Promise<string> {
    try {
      const price = await this.solanaKit.getTokenPrice(tokenSymbol);
      return JSON.stringify({
        status: "success",
        message: `Price fetched successfully for ${tokenSymbol}.`,
        data: { token: tokenSymbol, price },
      });
    } catch (error: any) {
      return JSON.stringify({
        status: "error",
        message: error.message,
        code: error.code || "UNKNOWN_ERROR",
      });
    }
  }
}
