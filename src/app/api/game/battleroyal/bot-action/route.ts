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
      prompt = `당신은 배틀로얄 게임의 AI 봇 "${botName}"입니다.
무기: ${botWeapon.emoji} ${botWeapon.name} (ATK:${botWeapon.atk}, DEF:${botWeapon.def}, SPD:${botWeapon.spd}, 특수:${botWeapon.specName})
HP: ${botHp}/100
현재 위치: (${botX}, ${botY}) — 맵 크기 ${mapSize}x${mapSize}
주변 감지된 플레이어: ${nearbyPlayers || '없음'}

8방향(↖↑↗←→↙↓↘) 또는 대기 중 하나를 선택하세요.
전략적으로 생각하세요. HP가 낮으면 도망, 높으면 사냥.

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
