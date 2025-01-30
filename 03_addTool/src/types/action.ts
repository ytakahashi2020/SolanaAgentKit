import { CustomSolanaAgentKit } from "../agent";
import { z } from "zod";

export interface Action {
  name: string;
  similes?: string[];
  description: string;
  examples?: {
    input: Record<string, any>;
    output: Record<string, any>;
    explanation: string;
  }[];
  schema: z.ZodObject<any>;
  handler: (
    agent: CustomSolanaAgentKit,
    input: Record<string, any>
  ) => Promise<any>;
}
