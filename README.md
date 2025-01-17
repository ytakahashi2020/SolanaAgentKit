# 0 Preparation

### 1 OpenAI API Key

### 2 Solana wallet address with test token

faucet is here
https://faucet.solana.com/

# 1 set the environment

## 1 create a project

`npm init -y`

## 2 create a file

`touch agent.ts`

## 3 create a dotenv file

```
OPENAI_API_KEY=
RPC_URL=https://api.devnet.solana.com
SOLANA_PRIVATE_KEY=
```

# 2 create a initialize function

## 1 create an outline

`async function initialize() {}`

## 2 create a model instance

### 1 import ChatOpenAI

`pnpm i @langchain/openai`

`import { ChatOpenAI } from "@langchain/openai"`

### 2 create an instance

```
const llm = new ChatOpenAI({
    modelName: "gpt-4",
    temperature: 0.7,
  });
```

## 3 create a solana agent kit instance

### 1 import SolanaAgentKit

`pnpm i solana-agent-kit`

`import { SolanaAgentKit } from "solana-agent-kit"`

### 2 import dotenv

```
import * as dotenv from "dotenv";
dotenv.config();
```

### 3 check if the variables exists

```
if (
    !process.env.SOLANA_PRIVATE_KEY ||
    !process.env.RPC_URL ||
    !process.env.OPENAI_API_KEY
  ) {
    throw new Error("set variables");
  }
```

### 4 create an instance

```
const solanaKit = new SolanaAgentKit(
    process.env.SOLANA_PRIVATE_KEY,
    process.env.RPC_URL,
    { OPENAI_API_KEY: process.env.OPENAI_API_KEY }
);
```

## 4 create solana tools

### 1 import create solana tools

`import { createSolanaTools } from "solana-agent-kit"`

### 2 create tools

`const tools = createSolanaTools(solanaKit);`

## 5 create a memory

### 1 import MemorySaver

`pnpm i @langchain/langgraph`

`import { MemorySaver } from "@langchain/langgraph"`

### 2 create a memory

`const memory = new MemorySaver();`

## 6 return the agent

### 1 import createReactAgent

`import { createReactAgent } from "@langchain/langgraph/prebuilt";`

### 2 return the agent

```
return createReactAgent({
    llm,
    tools,
    checkpointSaver: memory,
  });
```

# 3 create a runChat function

## 1 create an outline and execute it

`async function runChat() {}`

```
runChat().catch((err) => {
  console.error(err);
});
```

## 2 create an agent

`const agent = await initialize();`

## 3 create a config(thread id)

```
const config = {
    configurable: {
      thread_id: "solana agent kit!",
    },
  };
```

## 4 create a prompt function

### 1 create an outline

`async function promptUser(question: string): Promise<string> {}`

### 2 create readline Interface

`import readline from "readline";`

```
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
```

### 3 return the answer

```
return new Promise((resolve) =>
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer);
    })
  );
```

## 5 get a user prompt

`const userPrompt = await promptUser("Enter your prompt: ");`

### 6 start the stream

### 1 import HumanMessage

`pnpm i @langchain/core`

`import { HumanMessage } from "@langchain/core/messages";`

### 2 start the stream

```
const stream = await agent.stream(
    {
      messages: [new HumanMessage(userPrompt)],
    },
    config
  );
```

## 6 display the response

### 1 get the chunk from the stream

`for await (const chunk of stream) {}`

### 2 display in agent case

```
if ("agent" in chunk) {
      console.log(chunk.agent.messages[0].content);
    }
```

### 3 display in tool case

```
else if ("tools" in chunk) {
      console.log(chunk.tools.messages[0].content);
    }
    console.log("---------------------");
```
