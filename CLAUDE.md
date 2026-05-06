# CLAUDE.md — プロジェクト設計方針

このファイルはClaude Codeが自動で読み込むコンテキストファイルです。
以下の方針を前提にコードの生成・レビューを行ってください。

---

## プロジェクト概要

- **フレームワーク**: Next.js（App Router）
- **認証**: アカウント登録必須。未認証ユーザーはアプリを使用不可
- **データアクセス制御**: 自分のデータは自分のみ閲覧・操作可能
- **外部APIサーバー**: データ操作用のAPIサーバーが別途存在する

---

## レンダリング方針

- **基本はSSR（Server Components）**
- 表示（Read）: Server Componentでデータ取得 → レンダリング
- 操作（Create / Update / Delete）: Server Actions経由で外部APIを呼ぶ
- リアルタイム更新が必要な箇所のみCSR（SWR / React Query）を使用

### 認証トークンの扱い

- アクセストークンは **httpOnly Cookie** に保存し、クライアントに渡さない
- サーバーサイド（Server Components / Server Actions）からのみトークンを使用
- `cache: 'no-store'` を認証が必要なfetchには必ず指定する

---

## 認証ガード

- `middleware.ts` で未認証ユーザーを `/login` にリダイレクト
- Route Groupで認証済み／未認証のレイアウトを分離する
  - `(auth)/` — ログイン・登録ページ
  - `(app)/` — 認証済みユーザー向けページ（layout.tsxで再検証）

---

## ディレクトリ構成

```
/
├── middleware.ts               # 認証ガード
├── app/                        # ルーティングのみ担当。ロジックはfeaturesに委譲
│   ├── (auth)/                 # 未認証ユーザー向け Route Group
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── (app)/                  # 認証済みユーザー向け Route Group
│   │   ├── layout.tsx          # 認証チェック・共通レイアウト
│   │   ├── dashboard/page.tsx
│   │   └── items/
│   │       ├── page.tsx
│   │       └── [id]/page.tsx
│   └── layout.tsx
│
├── features/                   # Feature単位のモジュール（TCA的な構造）
│   ├── auth/
│   │   ├── index.ts            # public API（外部公開するものだけexport）
│   │   ├── actions.ts          # Server Actions
│   │   ├── store.ts            # クライアント状態（Zustandなど）
│   │   ├── types.ts
│   │   ├── hooks/
│   │   └── components/
│   └── items/                  # ドメインに応じてfeatureを追加する
│       ├── index.ts
│       ├── actions.ts
│       ├── store.ts
│       ├── types.ts
│       ├── hooks/
│       └── components/
│
├── lib/                        # 外部依存・インフラ層
│   ├── api/
│   │   ├── client.ts           # fetch wrapper（認証ヘッダー付与）
│   │   ├── auth.ts
│   │   └── items.ts
│   ├── auth/
│   │   └── session.ts          # セッション取得・検証
│   └── utils/
│
├── components/                 # アプリ全体で使う純粋UIコンポーネント
│   ├── ui/                     # Button, Input など primitive
│   └── layout/                 # Header, Sidebar など
│
└── types/                      # グローバルな型定義
    └── index.ts
```

---

## モジュール境界のルール

### `features/` は `index.ts` 経由でのみ外から参照する

```ts
// ✅ 正しい参照方法
import { ItemList } from '@/features/items';

// ❌ 直接参照は禁止
import { ItemList } from '@/features/items/components/ItemList';
```

### `index.ts` は公開APIのみをexportする

```ts
// features/items/index.ts
export { ItemList } from './components/ItemList';
export { useItems } from './hooks/useItems';
export type { Item } from './types';
// actions.ts や store.ts の内部実装は原則exportしない
```

---

## `page.tsx` の書き方

`page.tsx` は薄く保ち、「データ取得してFeatureに渡すだけ」に徹する。

```tsx
// app/(app)/items/page.tsx
import { ItemList } from '@/features/items';
import { getServerSession } from '@/lib/auth/session';
import { getItems } from '@/lib/api/items';

export default async function ItemsPage() {
  const session = await getServerSession();
  const items = await getItems(session.token);
  return <ItemList initialItems={items} />;
}
```

---

## 参考：TCA → Next.js の概念マッピング

| TCA (SwiftUI) | Next.js相当 |
|---|---|
| Feature（モジュール） | `features/` 以下のディレクトリ |
| State | Zustand store / Server Componentのprops |
| Action | Server Actions / イベントハンドラ |
| Reducer | Server Actions内ロジック / Zustand reducer |
| Effect | `lib/api/` のfetch関数 |
| View | `components/` / page.tsx |
| Dependency | `lib/` 以下のサービス層 |
