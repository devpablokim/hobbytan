import { NextRequest, NextResponse } from 'next/server';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

export async function POST(req: NextRequest) {
  if (!OPENAI_API_KEY) {
    return NextResponse.json({ error: 'OpenAI API key not configured' }, { status: 500 });
  }

  try {
    const body = await req.json();
    const { playerA, playerB } = body;
    // playerA/B: { name, weapon: { name, emoji, type, atk, def, spd, specName, specDesc }, hp, strategy }

    const prompt = `당신은 배틀로얄 게임의 전투 해설가입니다. 유머러스하고 드라마틱하게 전투를 묘사하세요.

[플레이어A: ${playerA.name}]
- 무기: ${playerA.weapon.emoji} ${playerA.weapon.name} (타입: ${playerA.weapon.type}, ATK:${playerA.weapon.atk}, DEF:${playerA.weapon.def}, SPD:${playerA.weapon.spd})
- 특수능력: ${playerA.weapon.specName} — ${playerA.weapon.specDesc}
- HP: ${playerA.hp}
- 전략: "${playerA.strategy || '(전략 없음 — 본능에 따라 싸운다)'}"

[플레이어B: ${playerB.name}]
- 무기: ${playerB.weapon.emoji} ${playerB.weapon.name} (타입: ${playerB.weapon.type}, ATK:${playerB.weapon.atk}, DEF:${playerB.weapon.def}, SPD:${playerB.weapon.spd})
- 특수능력: ${playerB.weapon.specName} — ${playerB.weapon.specDesc}
- HP: ${playerB.hp}
- 전략: "${playerB.strategy || '(전략 없음 — 본능에 따라 싸운다)'}"

3라운드 전투를 한국어로 재미있고 드라마틱하게 묘사하세요.
전략 텍스트를 반영하되, 실제 데미지는 스탯 기반으로 계산하세요.
각 라운드는 2~3문장으로 짧고 임팩트있게.

반드시 아래 JSON 형식으로만 응답하세요:
{
  "rounds": [
    {"round": 1, "text": "라운드 1 묘사..."},
    {"round": 2, "text": "라운드 2 묘사..."},
    {"round": 3, "text": "라운드 3 묘사..."}
  ],
  "winner": "A" 또는 "B",
  "damageToA": 숫자,
  "damageToB": 숫자,
  "summary": "결과 한줄 요약"
}`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.9,
        max_tokens: 1000,
        response_format: { type: 'json_object' },
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      return NextResponse.json({ error: 'OpenAI API error', detail: err }, { status: 500 });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    const result = JSON.parse(content);

    return NextResponse.json(result);
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Unknown error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
