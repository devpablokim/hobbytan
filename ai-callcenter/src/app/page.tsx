'use client';

import { useState, useCallback, useRef, useEffect } from 'react';

type CallState = 'idle' | 'connecting' | 'connected' | 'ended' | 'error';

interface Message {
  role: 'agent' | 'user';
  text: string;
  timestamp: number;
}

export default function CallCenterPage() {
  const [callState, setCallState] = useState<CallState>('idle');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isMuted, setIsMuted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  // P1-1 fix: useRef for isMuted so onaudioprocess always reads current value
  const isMutedRef = useRef(false);
  const callStateRef = useRef<CallState>('idle');

  useEffect(() => {
    isMutedRef.current = isMuted;
  }, [isMuted]);

  useEffect(() => {
    callStateRef.current = callState;
  }, [callState]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const startCall = useCallback(async () => {
    setCallState('connecting');
    setError(null);
    setMessages([]);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      const res = await fetch('/callcenter-ai/api/conversation', { method: 'POST' });
      if (!res.ok) throw new Error('Failed to start conversation');
      const { signedUrl } = await res.json();

      const ws = new WebSocket(signedUrl);
      wsRef.current = ws;

      const audioContext = new AudioContext({ sampleRate: 16000 });
      audioContextRef.current = audioContext;

      // Audio playback queue for agent responses
      const audioQueue: ArrayBuffer[] = [];
      let isPlaying = false;

      const playNextInQueue = async () => {
        if (isPlaying || audioQueue.length === 0) return;
        isPlaying = true;
        const buffer = audioQueue.shift()!;
        try {
          // P1-7 fix: handle both encoded audio and raw PCM
          let audioBuffer: AudioBuffer;
          try {
            audioBuffer = await audioContext.decodeAudioData(buffer.slice(0));
          } catch {
            // If decodeAudioData fails, treat as raw 16-bit PCM mono @ 16kHz
            const pcm16 = new Int16Array(buffer);
            audioBuffer = audioContext.createBuffer(1, pcm16.length, 16000);
            const channel = audioBuffer.getChannelData(0);
            for (let i = 0; i < pcm16.length; i++) {
              channel[i] = pcm16[i] / 32768;
            }
          }
          const source = audioContext.createBufferSource();
          source.buffer = audioBuffer;
          source.connect(audioContext.destination);
          source.onended = () => {
            isPlaying = false;
            playNextInQueue();
          };
          source.start(0);
        } catch {
          isPlaying = false;
          playNextInQueue();
        }
      };

      ws.onopen = () => {
        setCallState('connected');

        const source = audioContext.createMediaStreamSource(stream);
        const processor = audioContext.createScriptProcessor(4096, 1, 1);

        source.connect(processor);
        processor.connect(audioContext.destination);

        processor.onaudioprocess = (e) => {
          // P1-1 fix: read from ref, not closure
          if (ws.readyState === WebSocket.OPEN && !isMutedRef.current) {
            const inputData = e.inputBuffer.getChannelData(0);
            const pcm16 = new Int16Array(inputData.length);
            for (let i = 0; i < inputData.length; i++) {
              pcm16[i] = Math.max(-32768, Math.min(32767, inputData[i] * 32768));
            }
            ws.send(JSON.stringify({
              type: 'audio',
              audio: btoa(String.fromCharCode(...new Uint8Array(pcm16.buffer))),
            }));
          }
        };
      };

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === 'transcript') {
          setMessages((prev) => [
            ...prev,
            { role: data.role, text: data.text, timestamp: Date.now() },
          ]);
        }
        if (data.type === 'audio' && data.audio) {
          // P1-7 fix: queue audio buffers for sequential playback
          const binaryStr = atob(data.audio);
          const bytes = new Uint8Array(binaryStr.length);
          for (let i = 0; i < binaryStr.length; i++) {
            bytes[i] = binaryStr.charCodeAt(i);
          }
          audioQueue.push(bytes.buffer);
          playNextInQueue();
        }
      };

      ws.onerror = () => {
        setError('연결 오류가 발생했습니다.');
        setCallState('error');
      };

      ws.onclose = () => {
        // P1-1 fix: read from ref
        if (callStateRef.current === 'connected') setCallState('ended');
      };
    } catch (err) {
      setError(err instanceof Error ? err.message : '통화 시작에 실패했습니다.');
      setCallState('error');
    }
  }, []);

  const endCall = useCallback(() => {
    wsRef.current?.close();
    mediaStreamRef.current?.getTracks().forEach((t) => t.stop());
    audioContextRef.current?.close();
    setCallState('ended');
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          🤖 HOBBYTAN AI 콜센터
        </h1>
        <p className="text-gray-400 mt-2">ElevenLabs Conversational AI 기반 자동 응대 시스템</p>
      </div>

      <div className="w-full max-w-lg bg-slate-800 rounded-2xl shadow-2xl overflow-hidden">
        <div className={`px-4 py-3 text-center text-sm font-medium ${
          callState === 'connected' ? 'bg-green-600' :
          callState === 'connecting' ? 'bg-yellow-600' :
          callState === 'error' ? 'bg-red-600' :
          'bg-slate-700'
        }`}>
          {callState === 'idle' && '📞 통화 대기 중'}
          {callState === 'connecting' && '⏳ 연결 중...'}
          {callState === 'connected' && '🟢 통화 중'}
          {callState === 'ended' && '📴 통화 종료'}
          {callState === 'error' && `❌ ${error}`}
        </div>

        <div className="h-80 overflow-y-auto p-4 space-y-3">
          {messages.length === 0 && callState === 'idle' && (
            <div className="text-center text-gray-500 mt-20">
              <p className="text-5xl mb-4">📞</p>
              <p>아래 버튼을 눌러 AI 상담원과 통화를 시작하세요</p>
            </div>
          )}
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] px-4 py-2 rounded-2xl ${
                msg.role === 'user'
                  ? 'bg-primary text-white rounded-br-sm'
                  : 'bg-slate-700 text-gray-200 rounded-bl-sm'
              }`}>
                <p className="text-xs opacity-60 mb-1">{msg.role === 'user' ? '고객' : '🤖 AI 상담원'}</p>
                <p>{msg.text}</p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="px-4 py-4 bg-slate-900 flex items-center justify-center gap-4">
          {callState === 'idle' || callState === 'ended' || callState === 'error' ? (
            <button
              onClick={startCall}
              className="px-8 py-3 bg-green-600 hover:bg-green-500 rounded-full text-lg font-bold transition-all hover:scale-105"
            >
              📞 통화 시작
            </button>
          ) : (
            <>
              <button
                onClick={() => setIsMuted(!isMuted)}
                className={`p-3 rounded-full transition-all ${isMuted ? 'bg-red-600' : 'bg-slate-700 hover:bg-slate-600'}`}
              >
                {isMuted ? '🔇' : '🎤'}
              </button>
              <button
                onClick={endCall}
                className="px-8 py-3 bg-red-600 hover:bg-red-500 rounded-full text-lg font-bold transition-all hover:scale-105"
              >
                📴 통화 종료
              </button>
            </>
          )}
        </div>
      </div>

      <div className="mt-6 text-center text-gray-500 text-sm max-w-md">
        <p>🔒 브라우저 마이크 권한이 필요합니다</p>
        <p className="mt-1">ElevenLabs Conversational AI + Twilio 연동</p>
      </div>
    </div>
  );
}
