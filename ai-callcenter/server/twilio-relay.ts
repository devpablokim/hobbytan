/**
 * Twilio Media Stream ↔ ElevenLabs Conversational AI WebSocket Relay
 *
 * This standalone server handles the WebSocket upgrade that Next.js can't do natively.
 * Run: npx ts-node server/twilio-relay.ts
 *
 * Flow:
 * 1. Twilio calls our TwiML webhook → <Stream> connects here
 * 2. This server connects to ElevenLabs ConvAI WebSocket (signed URL)
 * 3. Bidirectional relay: Twilio audio ↔ ElevenLabs audio
 */

import { WebSocketServer, WebSocket } from 'ws';
import http from 'http';

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY || '';
const AGENT_ID = process.env.ELEVENLABS_AGENT_ID || '';
const PORT = parseInt(process.env.RELAY_PORT || '3002', 10);

async function getSignedUrl(): Promise<string> {
  const res = await fetch(
    `https://api.elevenlabs.io/v1/convai/conversation/get_signed_url?agent_id=${AGENT_ID}`,
    { headers: { 'xi-api-key': ELEVENLABS_API_KEY } }
  );
  if (!res.ok) throw new Error(`ElevenLabs API error: ${await res.text()}`);
  const data = await res.json();
  return data.signed_url;
}

const server = http.createServer((_req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Twilio-ElevenLabs WebSocket Relay');
});

const wss = new WebSocketServer({ server });

wss.on('connection', async (twilioWs: WebSocket) => {
  console.log('[Relay] Twilio connected');

  let elevenWs: WebSocket | null = null;
  let streamSid: string | null = null;

  try {
    const signedUrl = await getSignedUrl();
    elevenWs = new WebSocket(signedUrl);

    elevenWs.on('open', () => {
      console.log('[Relay] ElevenLabs connected');
    });

    // ElevenLabs → Twilio (agent audio)
    elevenWs.on('message', (data: Buffer) => {
      try {
        const msg = JSON.parse(data.toString());
        if (msg.type === 'audio' && msg.audio && streamSid) {
          // Send audio back to Twilio as media message
          twilioWs.send(JSON.stringify({
            event: 'media',
            streamSid,
            media: { payload: msg.audio },
          }));
        }
      } catch {
        // Non-JSON or parse error — skip
      }
    });

    elevenWs.on('close', () => {
      console.log('[Relay] ElevenLabs disconnected');
      twilioWs.close();
    });

    elevenWs.on('error', (err) => {
      console.error('[Relay] ElevenLabs error:', err.message);
    });
  } catch (err) {
    console.error('[Relay] Failed to connect to ElevenLabs:', err);
    twilioWs.close();
    return;
  }

  // Twilio → ElevenLabs (caller audio)
  twilioWs.on('message', (data: Buffer) => {
    try {
      const msg = JSON.parse(data.toString());

      switch (msg.event) {
        case 'connected':
          console.log('[Relay] Twilio stream connected');
          break;

        case 'start':
          streamSid = msg.start?.streamSid || null;
          console.log(`[Relay] Stream started: ${streamSid}`);
          break;

        case 'media':
          // Forward audio to ElevenLabs
          if (elevenWs?.readyState === WebSocket.OPEN) {
            elevenWs.send(JSON.stringify({
              type: 'audio',
              audio: msg.media.payload, // mulaw base64 from Twilio
            }));
          }
          break;

        case 'stop':
          console.log('[Relay] Stream stopped');
          elevenWs?.close();
          break;
      }
    } catch {
      // Parse error — skip
    }
  });

  twilioWs.on('close', () => {
    console.log('[Relay] Twilio disconnected');
    elevenWs?.close();
  });

  twilioWs.on('error', (err) => {
    console.error('[Relay] Twilio error:', err.message);
  });
});

server.listen(PORT, () => {
  console.log(`[Relay] Twilio-ElevenLabs relay listening on port ${PORT}`);
});
