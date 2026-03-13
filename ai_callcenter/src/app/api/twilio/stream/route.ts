import { NextRequest, NextResponse } from 'next/server';

/**
 * Twilio Media Stream → ElevenLabs WebSocket Relay
 *
 * NOTE: Next.js App Router doesn't natively support WebSocket upgrades.
 * For production, this relay needs to run as a standalone Node.js server
 * or use Next.js custom server with WebSocket support.
 *
 * This route returns instructions for the relay setup.
 * The actual WebSocket relay is implemented in /server/twilio-relay.ts
 */
export async function GET() {
  return NextResponse.json({
    status: 'Twilio WebSocket Stream endpoint',
    note: 'WebSocket upgrade requires custom server. See /server/twilio-relay.ts',
    setup: [
      '1. Run: npx ts-node server/twilio-relay.ts',
      '2. Configure Twilio webhook to point to this server',
      '3. The relay bridges Twilio Media Stream ↔ ElevenLabs ConvAI WebSocket',
    ],
  });
}

export async function POST() {
  // Twilio sends POST for stream events (connected, start, media, stop)
  // In production, these are handled via WebSocket, not HTTP POST
  return NextResponse.json({ status: 'ok' });
}
