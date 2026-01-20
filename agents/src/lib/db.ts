import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  max: 5,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

export default pool;

// Types
export interface AgentOutput {
  id: string;
  agent_type: string;
  input_hash: string | null;
  output: Record<string, unknown>;
  selected: boolean;
  feedback: string | null;
  created_at: Date;
}

export interface ApiUsage {
  id: string;
  user_id: string;
  tokens_used: number;
  endpoint: string | null;
  created_at: Date;
}

export interface Selection {
  id: string;
  output_id: string;
  agent_type: string;
  selected_option: number;
  final_text: string;
  created_at: Date;
}

// Helper to track token usage
export async function trackTokenUsage(tokens: number, endpoint: string): Promise<void> {
  await pool.query(
    `INSERT INTO api_usage (user_id, tokens_used, endpoint) VALUES ($1, $2, $3)`,
    ['shay_sai', tokens, endpoint]
  );
}

// Get daily token usage
export async function getDailyUsage(): Promise<number> {
  const result = await pool.query(`
    SELECT COALESCE(SUM(tokens_used), 0) as total
    FROM api_usage
    WHERE created_at >= CURRENT_DATE
  `);
  return parseInt(result.rows[0].total);
}

// Save agent output
export async function saveAgentOutput(
  agentType: string,
  inputHash: string,
  output: Record<string, unknown>
): Promise<string> {
  const result = await pool.query(
    `INSERT INTO agent_outputs (agent_type, input_hash, output)
     VALUES ($1, $2, $3)
     RETURNING id`,
    [agentType, inputHash, JSON.stringify(output)]
  );
  return result.rows[0].id;
}

// Log selection
export async function logSelection(
  outputId: string,
  agentType: string,
  selectedOption: number,
  finalText: string
): Promise<void> {
  await pool.query(
    `INSERT INTO selections (output_id, agent_type, selected_option, final_text)
     VALUES ($1, $2, $3, $4)`,
    [outputId, agentType, selectedOption, finalText]
  );
}
