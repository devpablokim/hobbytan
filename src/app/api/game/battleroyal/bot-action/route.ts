import { NextRequest, NextResponse } from 'next/server';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

export async function POST(req: NextRequest) {
  if (!OPENAI_API_KEY) {
    return NextResponse.json({ error: 'OpenAI API key not configured' }, { status: 500 });
  }

  try {
    const body = await req.json();
    const { actionType, botName, botWeapon, botHp, mapSize, botX, botY, nearbyPlayers, opponentWeapon, opponentHp } = body;

    let prompt = '';

    if (actionType === 'move') {
      prompt = `당신은 배틀로얄 게임의 공격적인 AI 전사 "${botName}"입니다.
무기: ${botWeapon.emoji} ${botWeapon.name} (ATK:${botWeapon.atk}, DEF:${botWeapon.def}, SPD:${botWeapon.spd}, 특수:${botWeapon.specName})
HP: ${botHp}/100
현재 위치: (${botX}, ${botY}) — 맵 크기 ${mapSize}x${mapSize}
주변 감지된 플레이어: ${nearbyPlayers || '없음'}

## 행동 규칙 (반드시 따를 것):
1. 주변에 플레이어가 있으면 **반드시 그 방향으로 이동하여 전투**하라. 도망 금지.
2. 주변에 아무도 없으면 맵 중앙(${Math.floor(mapSize/2)},${Math.floor(mapSize/2)}) 방향으로 이동하라. 중앙에 적이 모인다.
3. HP가 30 이하여도 도망치지 마라. 한판 승부로 역전하라.
4. 대기(0,0)는 주변에 적이 있을 때만 허용 (매복).

8방향(↖↑↗←→↙↓↘) 또는 대기 중 하나를 선택하세요.

반드시 아래 JSON 형식으로만 응답:
{"dx": -1~1, "dy": -1~1, "reason": "이유 한줄"}
dx=0,dy=0은 대기입니다.`;
    } else if (actionType === 'combat_strategy') {
      prompt = `당신은 배틀로얄 게임의 AI 봇 "${botName}"입니다.
당신의 무기: ${botWeapon.emoji} ${botWeapon.name} (ATK:${botWeapon.atk}, SPD:${botWeapon.spd}, 특수:${botWeapon.specName} — ${botWeapon.specDesc})
당신의 HP: ${botHp}
상대 무기: ${opponentWeapon?.emoji} ${opponentWeapon?.name} (ATK:${opponentWeapon?.atk}, SPD:${opponentWeapon?.spd})
상대 HP: ${opponentHp}

당신의 무기와 특수능력을 활용한 전투 전략을 한국어로 1~2문장으로 작성하세요.
재미있고 캐릭터성 있게 작성하세요.

반드시 아래 JSON 형식으로만 응답:
{"strategy": "전략 텍스트"}`;
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.8,
        max_tokens: 200,
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
