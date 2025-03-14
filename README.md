# nextjs vitest

## 설치하기

(nextjs 공식문서)[]

```bash
npm install -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/dom vite-tsconfig-paths
```

공식문서에 있는대로 위와 같은 패키지들을 설치한다.

그리고 vitest.config.mts 파일을 root 디렉토리에 만들어준다.

```ts
// vitest.config.mts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    environment: "jsdom",
  },
});
```

공식문서에 있는대로 위와 같은 내용을 적어준다.

```json
{
  "scripts": {
    "test": "vitest run",
    "test:ui": "vitest --ui",
    "test:watch": "vitest --watch"
  }
}
```

run은 1번 실행, --watch는 계속 상태 감시이다 --ui는 ui 형태를 만들어준다

### 서버 컴포넌트 테스트

```tsx
export default function Home() {
  return (
    <main>
      <h1>Counter Test</h1>
    </main>
  );
}
```

위와 같은 서버 컴포넌트가 있다고 하자.

```tsx
import { expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import HomePage from "./page";

test("Basic page test", () => {
  render(<HomePage />);
  expect(screen.getByText("Counter Test")).toBeDefined();
});
```

해당 페이지에 대한 테스트 코드를 작서하고 npm run test를 실행하면 성공하는 것을 확인할 수 있다.

> ui 형태로 보고 싶으면 npm run test:ui를 실행하면 되는데 이때 @vitest/ui가 필요하다고 설치할 지 물어보게 된다. ui형태로 보고싶다면 설치하자.

### 클라이언트 컴포넌트 테스트

유저와의 상호작용을 테스트 하려면 @testing-library/user-event를 설치해야한다.

> 또한 toHaveTextContent를 사용하기 위해서는 @testing-library/jest-dom을 설치해야한다.

```bash
npm i -D @testing-library/user-event

npm i -D @testing-library/jest-dom
```

테스트 파일을 아래처럼 정의했다고 하자.

```tsx
import { expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Counter from "./counter";

test("tests a counter", async () => {
  render(<Counter />);
  await userEvent.click(screen.getByText("Increment"));

  expect(screen.getByTestId("count")).toHaveTextContent("Count: 2");
});
```

toBeDefined를 사용하는 경우라면 vitest-setup.ts 등의 파일을 만들어 주고 설정에 합쳐주자.

```
// vitest-setup.ts
// 전역적으로 추가될 부분을 아래에 추가
import "@testing-library/jest-dom/vitest";

```

```ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    environment: "jsdom",
    // 전력적으로 추가될 파일을 아래에 추가
    setupFiles: ["./vitest-setup.ts"],
  },
});
```

테스트를 돌려보면 제대로 실행되는 것을 알 수 있음

### 비동기 서버 컴포넌트 테스트

```tsx
export default async function Page() {
  const pokemon = (await fetch("https://pokeapi.co/api/v2/pokemon").then(
    (res) => res.json()
  )) as { results: { name: string }[] };
  return (
    <div>
      <h1>Pokemon</h1>
      <ul>
        {pokemon.results.map((p) => (
          <li key={p.name}>{p.name}</li>
        ))}
      </ul>
    </div>
  );
}
```

위와 같은 비동기 서버 컴포넌트가 있다.

```tsx
import { expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import Page from "./page";

test("RSC Pokemon Page", async () => {
  render(await Page());
  expect(screen.findByText("bulbasaur")).toBeDefined();
});
```

되게 간단한 형태로 Page를 await 하고 테스트를 진행할 수 있다.
