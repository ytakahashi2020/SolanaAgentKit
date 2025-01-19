import { gpt4 } from "../utils/model";
import { agentKit } from "../utils/solanaAgent";
import { solanaAgentState } from "../utils/state";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { SolanaDeployTokenTool } from "solana-agent-kit/dist/langchain";
import { transferSwapPrompt } from "../prompts/transferSwap";

const deployTokenAgent = createReactAgent({
  stateModifier: transferSwapPrompt,
  llm: gpt4,
  tools: [new SolanaDeployTokenTool(agentKit)],
});

export const deployTokenNode = async (state: typeof solanaAgentState.State) => {
  const { messages } = state;

  const result = await deployTokenAgent.invoke({
    messages,
  });

  return result;
};
