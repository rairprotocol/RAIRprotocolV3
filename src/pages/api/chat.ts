import type { APIRoute } from 'astro';

export const post: APIRoute = async ({ request }) => {
  try {
    const { command } = await request.json();

    // Call DeepSeek API using environment variables
    const response = await fetch(import.meta.env.DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [{ role: 'user', content: command }],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`DeepSeek API error: ${response.statusText}`);
    }

    const data = await response.json();
    return new Response(JSON.stringify({ response: data.choices[0].message.content }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error processing command:', error);
    return new Response(
      JSON.stringify({
        error: 'Failed to process command',
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
}; 