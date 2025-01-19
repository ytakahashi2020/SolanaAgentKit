import { ChatOpenAI } from "@langchain/openai";
import { createSolanaTools, SolanaAgentKit } from "solana-agent-kit";
import { MemorySaver } from "@langchain/langgraph";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { HumanMessage } from "@langchain/core/messages";
import * as dotenv from "dotenv";
import readline from "readline";
dotenv.config();

async function initialize() {
  const llm = new ChatOpenAI({
    modelName: "gpt-4",
    temperature: 0.7,
  });

  if (
    !process.env.SOLANA_PRIVATE_KEY ||
    !process.env.RPC_URL ||
    !process.env.OPENAI_API_KEY
  ) {
    throw new Error("set variables");
  }

  const solanaKit = new SolanaAgentKit(
    process.env.SOLANA_PRIVATE_KEY,
    process.env.RPC_URL,
    { OPENAI_API_KEY: process.env.OPENAI_API_KEY }
  );

  const tools = createSolanaTools(solanaKit);

  const memory = new MemorySaver();

  //   const config = {
  //     configurable: {
  //       thread_id: "Solana Agent Kit!",
  //     },
  //   };
  return createReactAgent({
    llm,
    tools,
    checkpointSaver: memory,
  });
}

async function runChat() {
  const agent = await initialize();

  const config = {
    configurable: {
      thread_id: "solana agent kit!",
    },
  };

  const userPrompt = await promptUser("Enter your prompt: ");

  const stream = await agent.stream(
    {
      messages: [new HumanMessage(userPrompt)],
    },
    config
  );
  for await (const chunk of stream) {
    if ("agent" in chunk) {
      console.log(chunk.agent.messages[0].content);
    } else if ("tools" in chunk) {
      console.log(chunk.tools.messages[0].content);
    }
    console.log("---------------------");
  }
}

async function promptUser(question: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((resolve) =>
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer);
    })
  );
}

runChat().catch((err) => {
  console.error(err);
});
