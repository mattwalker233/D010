import Claude from '@anthropic-ai/sdk';

const claude = new Claude({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function processWithClaude(text: string) {
  const response = await claude.messages.create({
    model: 'claude-3-opus-20240229',
    max_tokens: 1000,
    messages: [
      {
        role: 'user',
        content: `Please structure the following text extracted from a PDF:\n\n${text}`,
      },
    ],
  });
  return response.content;
} 