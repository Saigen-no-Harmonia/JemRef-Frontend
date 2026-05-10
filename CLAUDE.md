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

### 認証方式

- **Firebase Authentication（Google ログインのみ）** をクライアント側で実行し ID トークンを取得する
- ID トークンは **httpOnly Cookie** にサーバー側で書き込み、クライアント JS からは触らせない
- すべての認証必須 API 呼び出しは Server Action / Server Component 経由で、`cookies()` から Cookie を読み `Authorization: Bearer <idToken>` で Backend へ転送する
- Backend は受信した ID トークンを `VerifyIDToken()` で検証し uid を取得 → 業務処理を実行

### 認証ガードの2層構造

| レイヤー | チェック内容 | 失敗時の挙動 | 目的 |
|---|---|---|---|
| 1. `middleware.ts`（Edge） | Cookie の **存在** のみ | Cookie なし → `/` にリダイレクト | 未認証アクセスを Backend に届かせない（安価） |
| 2. Backend 共通認証ミドルウェア | `VerifyIDToken()` + DB 照会 | 403 → Server Action が Cookie 削除 + `/` リダイレクト | 失効・不正トークンを確実に弾く（厳密） |

### ログイン／サインアップ

Google ログインは upsert 型のため、`/login` `/register` ルートは設けない（プロトタイプ方針）。

- トップページ（`/`）に `<GoogleSignInButton>`（Client Component）を配置
- ボタンクリック → `signInWithPopup(auth, GoogleAuthProvider)` → ID トークン取得 → `loginAction(idToken)` Server Action
- `loginAction` 内で:
  1. ID トークンを httpOnly Cookie に Set-Cookie
  2. `redirect('/records')`
- 専用のログイン API は持たず、Backend へのユーザー登録は **次の認証付き API 呼び出し時に Backend 共通認証ミドルウェアが lazy に upsert** する（DB に uid なし → INSERT）

### ログアウト

- `<LogoutButton>` クリック → `logoutAction()` Server Action
- `logoutAction` 内で ID トークン Cookie を削除（`Set-Cookie: max-age=0`）
- 完了後、Client 側で `signOut(auth)` を呼び Firebase SDK の状態をクリア → `router.push('/')`
- Firebase ID トークンは JWT のため Backend 側で個別失効できない。Cookie 削除 + `signOut` で実質ログアウトとする（既発行トークンは寿命1時間で自然失効）

### ID トークンのリフレッシュ

- Firebase ID トークンは **1時間で失効**。Firebase SDK が裏で自動更新する
- Client 側に `onIdTokenChanged` リスナーを置き、新トークンを `/api/session` に POST → Cookie を更新する
- これによりタブを長時間開いていても Cookie は常に最新の ID トークンを保持する

---

## ディレクトリ構成

```
/
├── proxy.ts                    # 認証ガード（Cookie存在チェック）
├── app/                        # ルーティングのみ担当。ロジックはfeaturesに委譲
│   ├── _components/            # アプリシェル（Header / Footer）
│   ├── page.tsx                # 未認証ランディング
│   ├── api/
│   │   └── session/
│   │       └── route.ts        # POST: idToken → httpOnly Cookie 発行
│   │                           # DELETE: Cookie 削除
│   ├── (app)/                  # 認証済みユーザー向け Route Group
│   │   ├── layout.tsx          # <main flex-1> ラッパー（Header/Footer は root から）
│   │   └── records/
│   │       ├── page.tsx        # 書誌情報一覧（ログイン後の初期画面）
│   │       └── [id]/page.tsx
│   └── layout.tsx              # root: Header + {children} + Footer + Firebase listener
│
├── features/                   # Feature単位のモジュール
│   ├── auth/
│   │   ├── index.ts            # public API（外部公開するものだけexport）
│   │   ├── actions.ts          # Server Actions（loginAction / logoutAction）
│   │   ├── store.ts            # クライアント状態（Zustandなど）
│   │   ├── types.ts
│   │   ├── hooks/              # onIdTokenChanged 連携など
│   │   ├── services/           
│   │   └── components/         # GoogleSignInButton, LogoutButton
│   └── records/             # 書誌情報
│       ├── index.ts
│       ├── actions.ts          # Server Actions（CRUD）
│       ├── store.ts
│       ├── types.ts
│       ├── hooks/
│       └── components/
│
├── lib/                        # 外部依存・インフラ層
│   ├── firebase/
│   │   └── client.ts           # initializeApp(firebaseConfig)（client SDK のみ）
│   ├── api/
│   │   ├── client.ts           # fetch wrapper（cookies() から idToken を読み Bearer 付与）
│   │   ├── auth.ts
│   │   └── records.ts
│   ├── auth/
│   │   └── session.ts          # cookies() から idToken を取得するヘルパ
│   └── utils/
│
├── components/                 # アプリ全体で使う純粋UIコンポーネント
│   └── ui/                     # Button, Input など primitive
co-locate
│
└── types/                      # グローバルな型定義
    └── index.ts
```

---

## モジュール境界のルール

### `features/` は `index.ts` 経由でのみ外から参照する

```ts
// ✅ 正しい参照方法
import { RecordList } from '@/features/records';

// ❌ 直接参照は禁止
import { RecordList } from '@/features/records/components/RecordList';
```

### `index.ts` は公開APIのみをexportする

```ts
// features/records/index.ts
export { RecordList } from './components/RecordList';
export { useRecords } from './hooks/useRecords';
export type { Record } from './types';
// actions.ts や store.ts の内部実装は原則exportしない
```

---

## `page.tsx` の書き方

`page.tsx` は薄く保ち、「データ取得してFeatureに渡すだけ」に徹する。

```tsx
// app/(app)/records/page.tsx
import { RecordList } from '@/features/records';
import { getServerSession } from '@/lib/auth/session';
import { getRecords } from '@/lib/api/records';

export default async function RecordsPage() {
  const session = await getServerSession();
  const records = await getRecords(session.token);
  return <RecordList initialRecords={records} />;
}
```

---

## enum の使用方針

enum は有用な場面とそうでない場面があるので、使い分ける。

### enum が有用な場面

1. 値の集合をモジュール境界で「名前付き」として扱わせたい場合
2. 値そのものに意味があり、変えたくない場合 (バックエンドの enum と一致させる、DB に書き込む値を固定したい等)
3. 値を後から差し替える可能性がある場合
4. runtime に列挙したい場合

### enum が向かない場面

1. 数値 enum (string enum なら問題ない)
2. const enum: --isolatedModules（Next.js のデフォルト）で使えない / モジュール境界で挙動が割れてしまう

---

## 禁止事項

- 外部ストア(sessionStorage など)の値を React state に同期させない。useSyncExternalStore を使用する
- props 変化で state リセットは避ける。コンポーネント自体を unmount -> mount し直して state を初期化する

---

## コーディングガイドライン

- 英単語をコード上で略すの禁止。以下は例
  - ctx -> context
  - req -> request
  - curr -> currnt

---

## Claude向けの注意

- このプロジェクトはフロントエンド学習目的でもあるので、なるべくコードの例示に留め、コーディング（写経）自体はユーザーにやらせるようにする
  - ただしユーザーから明確に依頼された場合はこの限りではない

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
