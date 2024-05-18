# Egx

An ExpressJS Got Htmx and JSX.

<b>ExpressJS</b> is a Fast, unopinionated, minimalist web framework.

<b>Htmx</b> gives you access to AJAX, CSS Transitions, WebSockets and Server
Sent Events directly in HTML, using attributes, so you can build modern user
interfaces with the simplicity and power of hypertext.

<b>JSX</b> it's just JavaScript XML. JSX makes it easier to write markup HTML.

## Features

- Hooks support (`useRequest`, `useResponse`, `useBody`, `useParams`, `useQuery`, etc.).
- Helmet support.
- `AsyncComponent` support.

## Install
### Starter Template
```bash
npx degit herudi/egx/starter my-app
cd my-app
npm install

// run dev
npm run dev

// build
npm run build

// run prod
npm run start

```

### Install Manually
```bash
npm i egx
```

## Basic Usage 
```tsx
/** @jsx h */
/** @jsxFrag h.Fragment */

import express from "express";
import { egx, h, Helmet } from "egx";

const app = express();

app.use(egx());

app.get("/", (req, res) => {
  res.egx(
    <div>
      <Helmet>
        <title>Welcome Home</title>
      </Helmet>
      <button hx-post="/clicked" hx-swap="outerHTML">Click Me</button>
    </div>,
  );
});

app.post("/clicked", (req, res) => {
  res.egx(<h1>It's Me</h1>);
});

app.listen(3000, () => {
  console.log("> Running on port 3000");
});
```

## Using Hooks
### useRequest
```tsx
const Foo = () => {
  const { url } = useRequest();
  return <h1>{url}</h1>;
}
```

### useParams
```tsx
type User = { name: string };

const Foo = () => {
  const { name } = useParams<User>();
  return <h1>{name}</h1>;
}

app.get("/user/:name", (req, res) => {
  res.egx(<Foo/>);
});
```





