import { StateGraph } from "@langchain/langgraph";
import { solanaAgentState } from "./utils/state";
import { generalistNode } from "./agents/generalAgent";
import { deployTokenNode } from "./agents/deployToken";
import { managerNode } from "./agents/manager";
import { readNode } from "./agents/readAgent";
import { START, END } from "@langchain/langgraph";
import { managerRouter } from "./utils/route";
import { HumanMessage } from "@langchain/core/messages";
import readline from "readline";

// Readlineインターフェースの設定
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// StateGraphの設定
const workflow = new StateGraph(solanaAgentState)
  .addNode("generalist", generalistNode)
  .addNode("manager", managerNode)
  .addNode("deployToken", deployTokenNode)
  .addNode("read", readNode)
  .addEdge(START, "manager")
  .addConditionalEdges("manager", managerRouter)
  .addEdge("generalist", END)
  .addEdge("deployToken", END)
  .addEdge("read", END);

export const graph = workflow.compile();

// ユーザー入力の処理関数
async function processQuery(query: string) {
  const result = await graph.invoke({
    messages: [new HumanMessage(query)],
  });

  // AIMessageのcontentを抽出して表示
  for (const chunk of result.messages) {
    if (chunk.constructor.name === "AIMessage") {
      console.log(`AI Response: ${chunk.content}`);
    }
  }

  console.log(`General: ${result.isGeneralQuery}`);
  console.log(`Read: ${result.isSolanaReadQuery}`);
  console.log(`Write: ${result.isSolanaWriteQuery}`);
}

// 入力待機ループ
function askQuery() {
  rl.question("Enter your query: ", async (query) => {
    if (query.toLowerCase() === "exit") {
      rl.close();
      return;
    }

    try {
      await processQuery(query);
    } catch (error) {
      console.error("Error processing query:", error);
    }

    askQuery(); // 次のクエリを再び待機
  });
}

// プログラム開始
console.log("Type your queries below (type 'exit' to quit):");
askQuery();
