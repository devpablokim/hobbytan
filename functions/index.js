const { onRequest } = require("firebase-functions/v2/https");
const OPENAI_KEY = { value: () => process.env.OPENAI_API_KEY };

async function callOpenAI(messages, opts = {}) {
  const resp = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { "Authorization": `Bearer ${OPENAI_KEY.value()}`, "Content-Type": "application/json" },
    body: JSON.stringify({ model: "gpt-4o-mini", messages, temperature: opts.temp || 0.9, max_tokens: opts.maxTokens || 1000, response_format: { type: "json_object" } }),
  });
  if (!resp.ok) throw new Error(`OpenAI ${resp.status}: ${await resp.text()}`);
  const data = await resp.json();
  return JSON.parse(data.choices[0].message.content);
}

exports.brcombat = onRequest({ region: "asia-northeast3", cors: true }, async (req, res) => {
  if (req.method !== "POST") return res.status(405).json({ error: "POST only" });
  try {
    const { playerA, playerB } = req.body;
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

## 전투 규칙
1. **HP가 0이 될 때까지 라운드를 계속** 진행하세요. 3라운드에서 끝나지 않으면 4, 5라운드도 가능합니다. 반드시 한 명의 HP가 0 이하가 되어야 전투가 끝납니다.
2. **전략 텍스트를 적극적으로 반영**하세요. 플레이어가 구체적인 전략을 썼다면 전투 묘사에 반영하세요.
3. **어이없거나 뜬금없는 전략은 무시**하세요 (예: "상대방 컴퓨터를 해킹한다", "핵폭탄을 100개 소환" 등). 이 경우 시스템 기본 전투로 처리하세요.
4. **역전 이벤트를 추가**하세요! 약한 무기를 든 플레이어도 20~30% 확률로 기적적인 역전이 가능합니다:
   - 신이 도와준다 (갑자기 빛이 내리쬐며 힘이 솟구친다)
   - 상대가 미끄러진다 / 발을 헛딛는다
   - 상대가 순간 기절한다
   - 무기가 갑자기 각성한다
   - 바람이 도와준다 등

각 라운드는 2~3문장으로 짧고 임팩트있게. 한국어로 재미있게!

반드시 아래 JSON 형식으로만 응답하세요:
{"rounds":[{"round":1,"text":"..."},{"round":2,"text":"..."},...],"winner":"A" 또는 "B","damageToA":숫자(A의 총 받은 데미지),"damageToB":숫자(B의 총 받은 데미지),"summary":"결과 한줄 요약"}`;

    const result = await callOpenAI([{ role: "user", content: prompt }], { temp: 0.9, maxTokens: 1000 });
    res.json(result);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

exports.brbotaction = onRequest({ region: "asia-northeast3", cors: true }, async (req, res) => {
  if (req.method !== "POST") return res.status(405).json({ error: "POST only" });
  try {
    const { actionType, botName, botWeapon, botHp, mapSize, botX, botY, nearbyPlayers, opponentWeapon, opponentHp } = req.body;
    let prompt = "";
    if (actionType === "move") {
      prompt = `당신은 배틀로얄 게임의 AI 봇 "${botName}"입니다.
무기: ${botWeapon.emoji} ${botWeapon.name} (ATK:${botWeapon.atk}, DEF:${botWeapon.def}, SPD:${botWeapon.spd}, 특수:${botWeapon.specName})
HP: ${botHp}/100, 위치: (${botX}, ${botY}), 맵 ${mapSize}x${mapSize}
주변: ${nearbyPlayers || "없음"}
8방향 또는 대기 중 선택. JSON: {"dx":-1~1,"dy":-1~1,"reason":"이유"}`;
    } else {
      prompt = `당신은 배틀로얄 AI 봇 "${botName}". 무기: ${botWeapon.emoji} ${botWeapon.name} (ATK:${botWeapon.atk}, 특수:${botWeapon.specName}—${botWeapon.specDesc}). HP:${botHp}. 상대: ${opponentWeapon?.emoji} ${opponentWeapon?.name} (ATK:${opponentWeapon?.atk}), HP:${opponentHp}.
전략 1~2문장 한국어. JSON: {"strategy":"전략"}`;
    }
    const result = await callOpenAI([{ role: "user", content: prompt }], { temp: 0.8, maxTokens: 200 });
    res.json(result);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});
