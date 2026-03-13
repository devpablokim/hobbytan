import { NextResponse } from 'next/server';

/**
 * Server-side signed URL endpoint
 * Client calls this → server uses secret API key → returns signed URL
 * API key never exposed to client
 */
export async function POST(request: Request) {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  const defaultAgentId = process.env.ELEVENLABS_AGENT_ID;

  // Allow client to specify agent_id (for different services like ForPeople)
  let agentId = defaultAgentId;
  try {
    const body = await request.json();
    if (body.agent_id) agentId = body.agent_id;
  } catch {
    // No body or invalid JSON — use default
  }

  if (!apiKey || !agentId) {
    return NextResponse.json(
      { error: 'ElevenLabs credentials not configured' },
      { status: 500 }
    );
  }

  try {
    const res = await fetch(
      `https://api.elevenlabs.io/v1/convai/conversation/get_signed_url?agent_id=${agentId}`,
      {
        headers: { 'xi-api-key': apiKey },
      }
    );

    if (!res.ok) {
      const text = await res.text();
      console.error('ElevenLabs signed URL error:', text);
      return NextResponse.json(
        { error: 'Failed to get signed URL' },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json({ signedUrl: data.signed_url });
  } catch (error) {
    console.error('Signed URL API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
