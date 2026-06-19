# AGENTS.md

모든 AI 에이전트(Cursor, Claude Code, Codex 등)가 이 프로젝트에서 따를 공통 지침.

## Project Identity

```yaml
platform: web
```

| 값 | 스택 예시 |
|---|---|
| `web` | Next.js, React (DOM), Tailwind CSS |
| `app` | React Native, Expo, NativeWind |

### 프로젝트 요약

- **이름**: infinity-world-map
- **스택**: Next.js 15 · React 19 · TypeScript · Tailwind CSS 4 · Zustand · D3-geo

React Native/Expo로 전환 시 위 `platform` 값만 `app`으로 변경한다.

---

## Wiki Baseline

작업 시작 전 아래 위키를 읽고, **선언된 platform에 맞는 문서만** 참조한다.

### Wiki Root

```
/Users/hoi-seok/Documents/Obsidian Vault/frontend-llm-wiki/wiki/
```

### 읽기 순서 (작업 시작 전)

1. **index.md** — 전체 목차·플랫폼 태그 확인
   ```
   /Users/hoi-seok/Documents/Obsidian Vault/frontend-llm-wiki/wiki/index.md
   ```
2. **platform 필터 적용** — 위 `Project Identity`의 `platform` 값에 맞는 문서만 참조
3. **관련 문서** — index에서 작업 주제와 연결된 문서를 추가로 읽는다

### Platform 필터 규칙

| 위키 태그 | `web` | `app` |
|---|---|---|
| `[공통]` | ✅ | ✅ |
| `[웹]` | ✅ | ❌ |
| `[앱]` | ❌ | ✅ |
| `[웹·앱]` | ✅ | ✅ |

- **항상 포함**: `[공통]` 문서 (아키텍처·원칙·컨벤션·결정 등)
- **platform 전용**: 선언된 platform 태그 문서만 추가 참조
- **제외**: 반대 platform 전용 문서 (예: `web` 프로젝트 → `[앱]` 전용 문서 무시)

### 참조 예시 (`platform: web`)

```
✅ Feature-Sliced Design, Code Quality, Naming Convention  [공통]
✅ Next.js, Tailwind CSS, shadcn-ui, Bundling              [웹]
✅ cn & cva                                                [웹·앱]
❌ React Native, NativeWind, Expo SDK 54 Version Pinning   [앱]
```

### 운영 참고

- 위키 개요: `wiki/overview.md`
- 작업 이력: `wiki/log.md`
- 위키 AI 운영 매뉴얼: 위키 루트 `CLAUDE.md` · `AGENTS.md`
