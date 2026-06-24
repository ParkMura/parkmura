# SANG SUB Game — 작업 컨텍스트

## 기본 정보
- **저장소**: `ParkMura/sang-sub-game` (GitHub)
- **게임 URL**: https://parkmura.github.io/sang-sub-game/ringed.html
- **모바일 URL**: https://parkmura.github.io/sang-sub-game/ringed.html?mobile=1
- **메인 파일**: `ringed.html` 단일 파일에 전체 게임 로직 포함
- **배포**: GitHub Pages (master 브랜치 push → 1~2분 후 자동 반영)

## Claude 작업 방식

### PC (Claude Code)
- `C:\Users\hadep\sang-sub-game\ringed.html` 직접 수정
- 수정 후 `git add . && git commit -m "..." && git push` 로 반영
- gh CLI PATH: `$env:PATH += ";C:\Program Files\GitHub CLI\"`

### 핸드폰 (claude.ai)
- GitHub API로 `ringed.html` 파일 읽고 수정
- `gh api repos/ParkMura/sang-sub-game/contents/ringed.html` 로 파일 가져오기
- 수정 후 같은 API로 PUT 요청으로 업데이트

## 세션 시작 방법 (공통)
새 세션에서 항상 이 문장으로 시작:
```
ParkMura/sang-sub-game 저장소의 CLAUDE.md 읽고 게임 작업 이어서 해줘.
```

## 현재 적용된 수정사항

| # | 내용 | 코드 위치 |
|---|------|----------|
| 1 | SPECIAL FORCES 버튼 숨김 | `drawSpecialForcesToggle()` 첫줄 return |
| 2 | CAM1/CAM2 버튼 숨김 | `drawCameraButtons()` 첫줄 return |
| 3 | 화면 밝기 +40% | CSS `filter: brightness(1.4)` |
| 4 | 플레이어 총 황금색 | `drawRifle()` - `rgba(255, 200, 50, 0.96)` |
| 5 | Kill/Wave 글씨 삭제 | `drawHud()` 에서 해당 fillText 제거 |
| 6 | HUD 크기 축소 | `drawHud()` - 박스 160x70, 바 120px |
| 7 | 시야각 140도 | `drawSoftConeLight()` halfAngle 1.22 |
| 8 | 뒤쪽 어둡게 | lightCtx fillStyle `rgba(0,0,0,0.88)` |
| 9 | 미니맵 (우상단) | `drawMinimap()` 함수 추가 |
| 10 | 이동속도 -20% | 플레이어 228/152, `enemySpeed()` * 0.8 |
| 11 | 줌 10% 아웃 | `camera.zoom` 0.81/0.9 |
| 12 | 적 빨간 테두리 | `drawEnemy()` 에서 arc + strokeStyle red |
| 13 | STA → SKILL 에너지바 | `skillEnergy` 변수, 킬당 +0.125 |
| 14 | 비장의 스킬 | E키/SKILL버튼 → 3초 발칸포, 이동불가 |
| 15 | 가로형 레이아웃 | CSS `width:100vw; height:min(100vh,56.25vw)` |
| 16 | 3종 무기 시스템 | `currentWeapon` 변수, Tab키/모바일SWAP버튼으로 교체 |
| 17 | 소총 | 기존 동일 - 데미지 44, 쿨다운 0.11s |
| 18 | 산탄총 (+30% 데미지) | 5발 산탄, 데미지 57, 사거리 500, 쿨다운 0.55s |
| 19 | 마취총 | 투사체 발사, 데미지 22, 명중 시 적 2.5초 슬로우(속도 30%) |
| 20 | HUD 무기 표시 | 현재 무기명 색상별 표시 (소총=황금, 산탄=주황, 마취=청색) |
| 21 | AIM 조이스틱 20% 크게 | `mobileButtonRects()` - attackR 최대 58→70 |
| 22 | 이동 조이스틱 원래 크기 복구 | `mobileButtonRects()` - stick.r 70→58 |
| 23 | 과녁 월드좌표계 렌더링 | `drawMobileAimCursorWorld()` - 캐릭터와 동일 카메라 변환, 벌어짐 방지 |
| 24 | 플레이어 → 스타크래프트 마린 | `drawMarineSoldier()` - 올리브 파워슈트, 앰버 T바이저 |
| 25 | 적 → 스타워즈 스톰트루퍼 | `drawStormtrooper()` - 흰색 갑옷, 검은 T바이저, 임페리얼 블라스터 |
| 26 | 2인 협동 멀티플레이어 | PeerJS WebRTC P2P, 메뉴에 "2P CO-OP" 버튼, 로비 화면(HOST/JOIN) |
| 27 | HOST(1P) 기능 | 4자리 코드 생성, 전체 게임 로직 실행, player2 이동/사격, 50ms 상태 전송 |
| 28 | JOIN(2P) 기능 | 코드 입력 패드, PeerJS 연결, 입력 전송, 수신 상태로 렌더링 |
| 29 | 원격 플레이어 렌더링 | `drawRemotePlayer()` - 파란 마린(2P), 보라 마린(1P), HP바, 레이블 |
| 30 | 클라이언트 사이드 예측 | 2P 클라이언트가 로컬에서 즉시 이동, 호스트 보정 22% lerp 적용 |
| 31 | 원격 플레이어 보간 | `remotePlayerTarget` + `dt*14` lerp, 30fps 상태 전송으로 부드러운 이동 |
| 32 | 모바일 총구 방향 수정 | 이동조그 방향 → 총구 추적, AIM 조그 사용시 AIM 우선 적용 |
| 33 | AIM flick 스킬 발동 | AIM 조이스틱 빠른 팅김(delta>0.45) → 스킬 발동 |
| 34 | 자동 개틀링 | 1초 정지 시 자동 속사, 이동하면 해제 |
| 35 | 사격 반동 애니메이션 | `recoilAmt` 변수, 총구 반대 방향 3.5px 이동 |
| 36 | 스킬/개틀링 캐릭터 | 스킬=오렌지 발광+배럴 회전+바이저 빨강, 개틀링=파란 링+6배럴 회전 |
| 37 | 우주선 내부 그래픽 | 메뉴·HUD·바닥·벽·문·데스·로비 전면 sci-fi 재설계 |
| 38 | 메뉴 화면 우주 배경 | 별 160개+성운+우주선 바닥 패널+홀로그래픽 타이틀+코너 브래킷 |
| 39 | 바닥 금속 패널 | 80px 타일+환기구+경고 마킹+구조 보강선+발광 그리드 |
| 40 | 벽 sci-fi 패널 | 패널 분할선+LED 인디케이터+경고 줄무늬+청록 상단 발광 |
| 41 | 에어락 문 | 코너 브래킷+LED 상태 표시+AIRLK 레이블+에너지 파동 |
| 42 | 홀로그래픽 HUD | 각진 패널+블록 HP바+스캔라인+Wave 표시 |
| 43 | MISSION FAILED 화면 | 빨간 비상 글로우+글리치 블록+각진 패널+깜빡임 |
| 44 | 코드 화면 sci-fi | SECURE CHANNEL 터미널+각진 버튼+monospace 폰트 |
| 45 | 벽 뒤 적 숨기기 | `hasLOS()` ray-march → `drawEnemy()` 첫줄 return |
| 46 | 소총 탄약 35발 | `rifleAmmo`, `rifleReloadTimer`, 1.5초 재장전 |
| 47 | 산탄총 2발+스플래시 | `shotgunAmmo`, 1초 재장전, 55px 반경 20dmg 스플래시 |
| 48 | 마취총 5발 | `taserAmmo`, `taserReloadTimer`, 1.5초 재장전 |
| 49 | 벽 모서리 파손 | `wallCornerDmg` WeakMap, `hitWallCorner()`, `drawWall()` clip |
| 50 | HUD 탄약 표시 | 탄약수/재장전 타이머 HUD 패널에 표시 |
| 51 | Space Marine 2 캐릭터 | 딥코발트 블루 파워아머, 금장 어깨패드, 해골 엠블렘, 체인, 레드 바이저 슬릿 |
| 52 | 볼터 무기 리디자인 | 소총→볼터, 산탄총→스톰볼터(더블배럴), 마취총→플라즈마피스톨(청색 코일) |
| 53 | 분할화면 멀티플레이 | `camera2`, `splitPanelOffsetX`, `lightSourcePlayer` - 1P 좌측/2P 우측 각각 카메라 추적 |
| 54 | 양쪽 시야 적 표시 | `drawEnemy()` hasLOS 양 플레이어 체크 - 어느 쪽이든 보이면 양쪽 화면에 표시 |
| 55 | P2 HUD | `drawP2StatusHud()` - 우측 패널에 2P HP바 표시 |
| 56 | Space Marine 2 바닥 | 어두운 석판, 철 격자, 아쿠일라 각인, 경고 밴드, 황금 이음선 |
| 57 | Space Marine 2 벽 | 세라마이트 아머 플레이팅, 황금 리벳, 낡은 경고밴드, 황동 심선 |
| 58 | Space Marine 2 문/장애물 | 철제 요새 게이트, 황금 트림, 제국 문장 상자 |
| 59 | Space Marine 2 메인 메뉴 | 어두운 석조 요새 배경, 지옥불 앰버 글로우, 고딕 석조 바닥, 석주, 아퀼라 문장, 황금 바, 50개 불티 파티클, 무거운 황금 타이틀, 챕터 레이블, 검 장식, 고딕 코너 브래킷, 앰버 상태바 |
| 60 | Space Marine 2 메뉴 버튼 | 철판 비스듬 노치, 황금 맥동 테두리, 내부 인세트 라인, 왼쪽 빨간 악센트, 상단 하이라이트, 코너 볼트, 세리프 앰버 텍스트 |
| 61 | 4캐릭터 선택 시스템 | HAWK(특수부대/기관총), BULL(중장갑/산탄총), VIPER(저격수/저격총), MEDIC(의무병/기관총) — 체형·속도·HP 차이 |
| 62 | 캐릭터 선택 화면 | 게임 시작 전 charselect 화면, 4개 카드(캐릭터 미리보기+스탯바+특성 태그), 두 번 탭으로 확정 |
| 63 | 저격총(Weapon 5) | 데미지 150, 사거리 1960(기관총 2배), 탄약 1발, 2.5초 재장전, VIPER 기본무기 |
| 64 | 권총(Weapon 4) | 데미지 22, 사거리 686(기관총 70%), 15발, 1.5초 재장전, HAWK/BULL/MEDIC 보조무기 |
| 65 | 대구경 권총(Weapon 6) | 데미지 120, 사거리 588, 5발, 1.5초 재장전, VIPER 보조무기 |
| 66 | 남성 분노(RAGE) | HP 20 이상 급감 시 2초간 이동속도 1.2배·데미지 2배 자동 발동 |
| 67 | 여성 힐(MEDIC 패시브) | 정지 시 초당 10% HP 자가치유 + 주변 118px 아군도 힐 |
| 68 | MEDIC 스킬 | E키/AIM 퉁겨내기 → 주변 118px(산탄총 범위 30%) 적 전원 마취(slowTimer 3초) |
| 69 | 캐릭터별 무기 스왑 | Tab/SWAP이 해당 캐릭터의 주무기↔보조무기만 순환 |
| 70 | 산탄총 사거리 조정 | 175 → 392(기관총 40%) |
| 71 | 캐릭터별 마린 색상 | drawPlayer()가 playerChar.col 전달 → HAWK 청색, BULL 흑색, VIPER 녹색, MEDIC 분홍 |
| 72 | C4 폭탄(BULL 전용) | Q로 최대 3개 설치, F키 또는 AIM 상하 3회 흔들기 또는 모바일 DETONATE 버튼으로 일괄 폭파 |
| 73 | 박격포 스킬(BULL) | E키 발동 → 조준 위치에 10발 순차 투하, 1발 반경 440·피해 540(수류탄 2배) |
| 74 | 대형미사일 스킬(VIPER) | E키로 충전 시작(반대방향 AIM 고정), 3초 후 자동발사, 반경 1100·피해 2700(수류탄 10배) |
| 75 | 남성 RAGE 패시브 | HP 20 이상 급감 시 자동발동, 2초간 이동속도 1.2배·데미지 2배, RAGE! 말풍선 표시 |
| 76 | 캐릭터 초상화 | drawCharPortrait() → HAWK(파란 울트라마린), BULL(벌키 터미네이터), VIPER(날씬 저격수), MEDIC(여성 아포세카리) |
| 77 | 모바일 DETONATE 버튼 | BULL 캐릭터 + C4 설치 시 AIM 조이스틱 좌측에 DETONATE 버튼 표시 |

| 78 | 팀 배틀 게임모드 | 메뉴 "TEAM BATTLE" 버튼 → 캐릭터선택 → 팀선택(BLUE/RED) → 대칭맵 시작 |
| 79 | 팀 배틀 맵 | 대칭 맵 — 양측 기지벽+도어, 중앙 십자+L자 엄폐물, 측면 기둥 |
| 80 | 기지(Facility) 시스템 | 양팀 기지 HP 3000, 총알 직접 피격 데미지, 내부 HP바+발광 효과 |
| 81 | AI 플레이어 (팀당 3명) | `aiPlayers[]` — 상대팀 우선 추적, 65% 적중률, 기지도 공격 |
| 82 | 파괴 가능 상자 | `crates[]` 12개 대칭 배치, HP 200, 파괴시 힐 픽업 드롭 |
| 83 | 팀 배틀 HUD | 상단 BLUE/RED 기지 HP바, AI 생존수 표시, 승/패 오버레이 |
| 84 | 팀 배틀 승패 | 기지 HP 0 → VICTORY/DEFEAT 화면, 탭으로 메뉴 복귀 |
| 85 | HP 리밸런싱 | CHAR_DEFS에 `tbHp` 추가 — BULL 1000, HAWK 750, VIPER 500, MEDIC 600; 클래식 hpMult 복원 |
| 86 | AI 캐릭터 외형 | `drawAiPlayer()` → `drawMarineSoldier()` 사용, 캐릭터 고유 색상, 팀 색 링 |
| 87 | AI 팀 구성 | `setupAiPlayers()` — 플레이어 캐릭터 제외 3종(BULL/VIPER/MEDIC 등) AI 배정, walkTime 추가 |
| 88 | 승패 조건 추가 | `checkTeamBattleWin()` — 기지 파괴 OR 적팀 전원 사망 시 승리, 내팀 전멸 시 패배 |
| 89 | 팀배틀 맵 개선 | `buildTeamBattleMap()` — props 초기화, 기지벽 3중 도어, 중앙 십자, L형 엄폐, 통로 기둥 |
| 90 | ONLINE BATTLE 버튼 | 메뉴에 ONLINE BATTLE 버튼 추가 (ONLINE>TEAM BATTLE>CO-OP>MAP TOOL 순서) |
| 91 | 온라인 로비 | `onlinelobby` 상태 — HOST/JOIN 선택, 4자리 코드, 캐릭터/팀 선택, 플레이어 목록 |
| 92 | 온라인 호스트 | `initTBHost()` — PeerJS로 최대 7 클라이언트 관리, 로비 브로드캐스트, 게임 시작 |
| 93 | 온라인 클라이언트 | `joinTBRoom(code)` — 코드 입력 → 연결 → 캐릭터/팀 전송 → tbstart 대기 |
| 94 | 온라인 게임 동기화 | 50ms마다 tbstate(AI/시설/상자/픽업) 브로드캐스트; 클라이언트 tbinput 전송 |
| 95 | AI 자동 채움 | `setupAiPlayersOnline()` — 팀별 인간 수 파악 후 4명 채울 AI 자동 배정 |
| 96 | 인간 플레이어 렌더링 | `drawRemoteNetPlayer()` — ★ 표시 + 팀 링, 캐릭터 외형 동일 적용 |
| 97 | 킬 스트릭 / 킬 피드 | `killStreak`, `killFeed[]` — 연속 킬 보너스 메시지, 킬 피드 우상단 표시 |
| 98 | 플로팅 데미지 숫자 | `floatingDmgNums[]` — 피격 시 숫자 떠오름, 크리티컬 빨간색·크게 |
| 99 | 컴백 버프 | HP 30% 이하 시 이동속도+20%, 데미지+10% 자동 발동, COMEBACK! 표시 |
| 100 | 중립 목표물(Objective) | 맵 중앙 NEXUS 크리스탈, 점령 시 팀 전체 속도+10% 버프 |
| 101 | 팀배틀 리스폰 시스템 | 사망 시 5초 카운트다운, ELIMINATED→RESPAWNING IN Ns 오버레이, 스폰 위치 복귀 |
| 102 | 리스폰 중 카메라 패닝 | 사망 후 카메라가 부활 위치(팀 스폰)로 부드럽게 이동 |
| 103 | AI 스폰 위치 조정 | `setupAiPlayers()` — world.w*0.68 위치로 이동, 중앙 커버 벽 충돌 방지 |
| 104 | AI 스터크 탈출 개선 | `stuckTotal` 카운터 + 4회마다 완전 랜덤 방향, 점진적 탈출 지속시간 |
| 105 | playTone() 래퍼 | `playTone(freq, vol, dur)` — playToneLayer 편의 래퍼, 리스폰/알림 효과음 |
| 106 | 팀원 생존 아이콘 HUD | 기지 HP바 옆 소형 원 아이콘 (★=플레이어, ●=AI아군, 주황=리스폰중, X=완전사망) |
| 107 | AI 리스폰 시스템 | 사망 AI 10초 후 팀 스폰 랜덤 레인에서 HP 풀로 부활 + 2초 무적 |
| 108 | 3v3 AI 구성 | 적팀 3명(비플레이어 캐릭터) + 아군 2명 — 3개 레인 분산 스폰 |
| 109 | 킬 스코어 시스템 | tbKills[팀], 30킬 먼저 달성 시 Kill Lead 승리 (기지 파괴와 이중 조건) |
| 110 | 킬 피드 AI 포함 | AI 킬 시 killFeed에 "BULL ▶ VIPER" 형태 표시 |
| 111 | 승리/패배 메시지 개선 | 기지파괴/킬리드/전멸 원인별 구분 표시 |
| 112 | 충격파 링 이펙트 | `shockRings[]` + `addShockRing()` — 킬/리스폰 시 확장 원형 충격파 |
| 113 | 화면 플래시 이펙트 | `screenDmgFlash`(피격 시 빨간 비네트), `screenKillFlash`(킬 시 황금 플래시) |
| 114 | AI 피격 화이트 플래시 | `ai.hitFlash` — 피격 시 0.7 alpha 흰 원 오버레이, 16ms 감소 |
| 115 | 킬 폭발 강화 | 더블 burst(30+18) + 이중 충격파링 + shake=8 + 황금 화면 플래시 |
| 116 | 팀배틀 맵 밸런스 | 중앙 요새 팔 320→240, 레인 엄폐 160→110+80gap+110, 미드 T→C형 엄폐 |
| 117 | AI 스폰 위치 수정 | `setupAiPlayers()` — 본진 내부(blueX=430, redX=W-430) 스폰, 리스폰도 동일 |
| 118 | MEDIC 힐 오라 시각화 | `drawPlayer()` — 정지+힐 시 녹색 펄스 링 + "✚ HEAL" 텍스트, 힐 범위 118→220px |
| 119 | 아군 AI 힐 링 | `drawAiPlayer()` — `ai._healTimer > 0` 시 녹색 글로우 링 (같은팀만 표시) |
| 120 | 마취 시각 효과 | `drawAiPlayer()` — `ai.stunTimer > 0` 시 보라색 링+소용돌이 파티클+"★ STUNNED" 라벨 |
| 121 | 마취 범위 밸런스 | `activateSkill()` stun_aura 범위 117.6px → 220px |
| 122 | 팀 공유 시야 | `drawAiPlayer()` — 적 AI는 플레이어 또는 아군 AI LOS 확보 시에만 표시 |

## 미구현 (요청됨)
- 브롤스타즈식 사선 시야
- 주소창 숨기기
- 카메라 추적속도 개선

## 작업 후 반드시 할 것
수정이 끝나면 이 CLAUDE.md의 **"현재 적용된 수정사항"** 표를 업데이트하고 push할 것.
