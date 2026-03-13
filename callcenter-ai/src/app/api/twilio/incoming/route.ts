import { NextRequest, NextResponse } from 'next/server';

const AGENT_ID = process.env.ELEVENLABS_AGENT_ID || '';
const RELAY_HOST = process.env.TWILIO_RELAY_HOST || 'localhost:3002';

/**
 * Twilio Incoming Call Webhook
 * Twilio → TwiML → Media Stream → WebSocket Relay → ElevenLabs
 */
export async function POST(request: NextRequest) {
  const protocol = RELAY_HOST.includes('localhost') ? 'ws' : 'wss';

  const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say language="ko-KR">안녕하세요, HOBBYTAN AI 콜센터입니다. 잠시만 기다려주세요.</Say>
  <Connect>
    <Stream url="${protocol}://${RELAY_HOST}">
      <Parameter name="agentId" value="${AGENT_ID}" />
    </Stream>
  </Connect>
</Response>`;

  return new NextResponse(twiml, {
    headers: { 'Content-Type': 'text/xml' },
  });
}
