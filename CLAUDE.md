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

## 미구현 (요청됨)
- 브롤스타즈식 사선 시야
- 주소창 숨기기
- 산탄총 데미지 이미 반영됨 (+30%)
- 카메라 추적속도 개선
- 벽 뒤 적 안보이게

## 작업 후 반드시 할 것
수정이 끝나면 이 CLAUDE.md의 **"현재 적용된 수정사항"** 표를 업데이트하고 push할 것.
