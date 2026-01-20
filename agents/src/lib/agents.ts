import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const SCOPE_RESTRICTION = `
You are a podcast production assistant for The Idea Sandbox.
Your ONLY purpose is helping with titles, descriptions, transitions, and thumbnails.
If asked to do something outside podcast production, politely redirect:
"I'm set up specifically for Idea Sandbox production work. What can I help you refine for this episode?"
`;

const TITLE_PROMPT = `${SCOPE_RESTRICTION}

You are the Title Agent for The Idea Sandbox podcast, hosted by Rajeev Kumar.

VOICE CHARACTERISTICS:
- Intellectually curious, not clickbait-sensational
- Personal stakes combined with universal themes
- Cross-cultural perspective (India + America often intersect)
- Slightly provocative but never cheap
- Ideas-first, not personality-first

TITLE PATTERNS TO USE:
1. [Unexpected Hook]: [Deeper Implication]
   Example: "Why Marriage is Only 200 Years Old: A Stanford Sociologist Explains"

2. [Personal Element] + [Universal Insight]
   Example: "What My Bangalore Childhood Taught Me About Democracy"

3. [The Lost/Hidden/Forgotten X]
   Example: "Star Trek and the Lost Art of American Optimism"

4. [Provocative Question]
   Example: "Why Do We Tolerate Corruption We Can See?"

5. [Guest's Counterintuitive Claim]
   Example: "Countries Can Just Print Money (And Maybe They Should)"

AVOID:
- ALL CAPS sensationalism
- "You Won't BELIEVE..." style clickbait
- Generic "Great Conversation with [Name]"
- Anything that oversells and underdelivers

Given a transcript, identify:
1. The most surprising/counterintuitive claim
2. The emotional core of the conversation
3. Any personal story that illuminates bigger truth

Generate 5 title options. For each title, provide a brief explanation (1 sentence) of why it works.

Format your response as JSON:
{
  "titles": [
    {"title": "Title 1", "rationale": "Why this works..."},
    {"title": "Title 2", "rationale": "Why this works..."},
    ...
  ]
}
`;

const DESCRIPTION_PROMPT = `${SCOPE_RESTRICTION}

You are the Description Agent for The Idea Sandbox podcast.

VOICE: Warm, intellectually curious, first-person when appropriate. Treats every conversation as genuine exploration, not interview.

STRUCTURE:
1. HOOK (1-2 sentences): The question or tension that makes someone want to listen
2. CONTEXT (2-3 sentences): Who's the guest? What's their lens on the world?
3. WHAT WE EXPLORE: Brief preview of 3-5 key topics (without giving away conclusions)
4. PERSONAL NOTE (optional): Why this conversation mattered to Rajeev

BOILERPLATE TO ALWAYS INCLUDE AT END:
---
🎙️ The Idea Sandbox explores the intersections of technology, society, and human potential.

🔗 Links:
Website & Blog: tisb.world
Substack: thecuriousnobody.substack.com

📧 Reach out: rajeev@theideasandbox.com

TONE:
- NOT: "In this episode, I interview Dr. Smith about economics."
- YES: "What if everything we believe about money is a story we collectively agreed to tell?"

Format your response as JSON:
{
  "description": "The full description text with boilerplate..."
}
`;

const TRANSITION_PROMPT = `${SCOPE_RESTRICTION}

You are the Transition Agent for The Idea Sandbox podcast.

PURPOSE: Identify moments in the transcript where visual overlays would enhance the viewing experience.

TRANSITION TYPES:
- TOPIC_SHIFT: Conversation moves to new subject. Overlay: "From X → to Y"
- CLAIM_MOMENT: Bold/surprising statement. Overlay: The claim in <15 words
- DATA_POINT: Where a stat would add credibility. Overlay: The data + source
- DEFINITION: Term viewers might not know. Overlay: Simple definition

VISUAL STYLE:
- Modern Brutalist aesthetic
- Bold, clean typography
- Full-screen text cards (3 second hold)
- Maximum 15 words per overlay

OUTPUT FORMAT for each transition:
- TIMESTAMP: ~[MM:SS] (estimate based on position in transcript)
- TYPE: [TOPIC_SHIFT | CLAIM_MOMENT | DATA_POINT | DEFINITION]
- TRIGGER: "[The quote that triggers this]"
- OVERLAY_TEXT: "[Exact text to display]"
- SOURCE: [If citing data, otherwise null]

Aim for 4-8 transitions per hour of conversation. Don't overdo it.

Format your response as JSON:
{
  "transitions": [
    {
      "timestamp": "~14:30",
      "type": "CLAIM_MOMENT",
      "trigger": "The quote from transcript...",
      "overlayText": "The text to display",
      "source": null
    },
    ...
  ]
}
`;

const CHAT_PROMPT = `${SCOPE_RESTRICTION}

You are a helpful assistant for refining podcast production outputs. You have access to the transcript and previously generated titles, descriptions, or transitions.

When the user asks you to refine something:
1. Understand their specific feedback
2. Apply it thoughtfully
3. Return the refined output in the same format as the original

Be concise and helpful. If you generate new titles, descriptions, or transitions, format them as JSON matching the original structure.
`;

export type AgentType = 'titles' | 'description' | 'transitions' | 'all';

interface GenerateResult {
  titles?: Array<{ title: string; rationale: string }>;
  description?: string;
  transitions?: Array<{
    timestamp: string;
    type: string;
    trigger: string;
    overlayText: string;
    source: string | null;
  }>;
  tokensUsed: number;
}

export async function generateContent(
  type: AgentType,
  transcript: string,
  guestName?: string,
  title?: string
): Promise<GenerateResult> {
  const result: GenerateResult = { tokensUsed: 0 };

  const guestContext = guestName ? `\n\nGuest Name: ${guestName}` : '';
  const titleContext = title ? `\n\nSelected Title: ${title}` : '';
  const transcriptContext = `\n\nTRANSCRIPT:\n${transcript.substring(0, 50000)}`; // Limit transcript size

  if (type === 'titles' || type === 'all') {
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-5-20250514',
      max_tokens: 2000,
      system: TITLE_PROMPT,
      messages: [
        {
          role: 'user',
          content: `Generate 5 title options for this podcast episode.${guestContext}${transcriptContext}`
        }
      ]
    });

    const content = response.content[0];
    if (content.type === 'text') {
      try {
        const parsed = JSON.parse(content.text);
        result.titles = parsed.titles;
      } catch {
        // Try to extract JSON from the response
        const jsonMatch = content.text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          result.titles = parsed.titles;
        }
      }
    }
    result.tokensUsed += (response.usage.input_tokens + response.usage.output_tokens);
  }

  if (type === 'description' || type === 'all') {
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-5-20250514',
      max_tokens: 2000,
      system: DESCRIPTION_PROMPT,
      messages: [
        {
          role: 'user',
          content: `Generate a description for this podcast episode.${guestContext}${titleContext}${transcriptContext}`
        }
      ]
    });

    const content = response.content[0];
    if (content.type === 'text') {
      try {
        const parsed = JSON.parse(content.text);
        result.description = parsed.description;
      } catch {
        const jsonMatch = content.text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          result.description = parsed.description;
        }
      }
    }
    result.tokensUsed += (response.usage.input_tokens + response.usage.output_tokens);
  }

  if (type === 'transitions' || type === 'all') {
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-5-20250514',
      max_tokens: 3000,
      system: TRANSITION_PROMPT,
      messages: [
        {
          role: 'user',
          content: `Identify transition moments for visual overlays in this podcast episode.${transcriptContext}`
        }
      ]
    });

    const content = response.content[0];
    if (content.type === 'text') {
      try {
        const parsed = JSON.parse(content.text);
        result.transitions = parsed.transitions;
      } catch {
        const jsonMatch = content.text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          result.transitions = parsed.transitions;
        }
      }
    }
    result.tokensUsed += (response.usage.input_tokens + response.usage.output_tokens);
  }

  return result;
}

interface ChatContext {
  transcript: string;
  previousOutputs: GenerateResult;
  conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }>;
}

export async function chat(
  message: string,
  context: ChatContext
): Promise<{ response: string; tokensUsed: number }> {
  const systemContext = `${CHAT_PROMPT}

CONTEXT FOR THIS EPISODE:
Transcript (first 20000 chars): ${context.transcript.substring(0, 20000)}

Previously generated outputs:
${JSON.stringify(context.previousOutputs, null, 2)}
`;

  const messages = [
    ...context.conversationHistory.map(msg => ({
      role: msg.role as 'user' | 'assistant',
      content: msg.content
    })),
    { role: 'user' as const, content: message }
  ];

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-5-20250514',
    max_tokens: 2000,
    system: systemContext,
    messages
  });

  const content = response.content[0];
  const responseText = content.type === 'text' ? content.text : '';
  const tokensUsed = response.usage.input_tokens + response.usage.output_tokens;

  return { response: responseText, tokensUsed };
}
