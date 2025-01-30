import { SolanaAgentKit } from "solana-agent-kit"; // 元の SolanaAgentKit をインポート

export class CustomSolanaAgentKit extends SolanaAgentKit {
  constructor(
    privateKey: string,
    rpcUrl: string,
    options?: { OPENAI_API_KEY?: string }
  ) {
    super(privateKey, rpcUrl, options); // 元の SolanaAgentKit のコンストラクタを呼び出す
  }
  async getTokenPrice(tokenSymbol: string): Promise<number> {
    const mockPrices: { [key: string]: number } = {
      SOL: 150,
      USDC: 1,
      USDT: 1,
      BONK: 0.5,
    };

    if (!mockPrices[tokenSymbol.toUpperCase()]) {
      throw new Error(`Price for token symbol ${tokenSymbol} not found.`);
    }

    return mockPrices[tokenSymbol.toUpperCase()];
  }
}
