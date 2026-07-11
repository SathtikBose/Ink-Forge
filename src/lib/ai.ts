const NVIDIA_API_KEY = process.env.NVIDIA_API_KEY;
const API_URL = 'https://integrate.api.nvidia.com/v1/chat/completions';

export async function moderateContent(content: string, type: 'POST' | 'COMMENT'): Promise<{ passed: boolean; feedback: string }> {
  if (!NVIDIA_API_KEY) {
    console.warn('NVIDIA_API_KEY is not set. Bypassing AI moderation.');
    return { passed: true, feedback: '' };
  }

  const prompt = `
You are an AI content moderator for a blog platform called Ink Forge.
Review the following ${type.toLowerCase()} content.
Determine if it contains any of the following: hate speech, harassment, explicit content, spam, or harmful misinformation.
If the content is clean and appropriate, respond with "PASS".
If the content violates these guidelines, respond with "REJECT" followed by a newline, and then a short, polite explanation of why it was rejected (e.g., "This is wrong because...").

Content to review:
"""
${content}
"""
`;

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${NVIDIA_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'meta/llama-3.1-8b-instruct',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.1,
        max_tokens: 150,
      }),
    });

    if (!response.ok) {
      console.error('Nvidia API error:', await response.text());
      // Fail open if API error
      return { passed: true, feedback: '' };
    }

    const data = await response.json();
    const result = data.choices[0].message.content.trim();

    if (result.startsWith('PASS')) {
      return { passed: true, feedback: '' };
    } else {
      const feedback = result.replace(/^REJECT\s*/, '').trim();
      return { passed: false, feedback };
    }
  } catch (error) {
    console.error('AI Moderation failed:', error);
    // Fail open if exception
    return { passed: true, feedback: '' };
  }
}
