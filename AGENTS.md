# AGENTS.md

모든 AI 에이전트(Cursor, Claude Code, Codex 등)가 이 프로젝트에서 따를 공통 지침.

## Project Identity

```yaml
platform: web   # web | app
```

| 값 | 스택 예시 |
|---|---|
| `web` | Next.js, React (DOM), Tailwind CSS |
| `app` | React Native, Expo, NativeWind |

### 프로젝트 요약

- **이름**: infinity-world-map
- **스택**: Next.js 15 · React 19 · TypeScript · Tailwind CSS 4 · Zustand · D3-geo

---

## Wiki Baseline

### 읽기 순서 (작업 시작 전 필수)

> 아래 파일을 반드시 직접 열어서 읽는다. 경로만 인지하는 것으로 갈음하지 않는다.

1. 아래 경로의 파일을 열어 읽는다:
   `/Users/hoi-seok/Documents/Obsidian Vault/frontend-llm-wiki/wiki/index.md`

2. 위 `platform` 값에 맞는 문서만 추가로 읽는다:

| 위키 태그 | `web` | `app` |
|---|---|---|
| `[공통]` | ✅ | ✅ |
| `[웹]` | ✅ | ❌ |
| `[앱]` | ❌ | ✅ |
| `[웹·앱]` | ✅ | ✅ |

3. 작업 주제와 연결된 문서를 index에서 찾아 추가로 읽는다.

### 참조 예시 (`platform: web`)

```
✅ Feature-Sliced Design, Code Quality, Naming Convention  [공통]
✅ Next.js, Tailwind CSS, shadcn-ui, Bundling              [웹]
✅ cn & cva                                                [웹·앱]
❌ React Native, NativeWind, Expo SDK 54 Version Pinning   [앱]
```

### 응답 규칙 (검증용)

작업 결과물 하단에 참고한 위키 문서를 반드시 명시한다:

```
<!-- wiki-ref: 컨벤션/Commit Convention.md, 원칙/Readability.md -->
```

명시하지 않은 경우, 위키를 읽지 않은 것으로 간주한다.
