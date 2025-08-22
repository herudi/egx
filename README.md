# Egx

An ExpressJS Got Htmx and JSX.

<b>ExpressJS</b> is a Fast, unopinionated, minimalist web framework.

<b>Htmx</b> gives you access to AJAX, CSS Transitions, WebSockets and Server
Sent Events directly in HTML, using attributes, so you can build modern user
interfaces with the simplicity and power of hypertext.

<b>JSX</b> it's just JavaScript XML. JSX makes it easier to write markup HTML.

## Features

- Direct `htmx`.
- Helmet support.
- `AsyncComponent` support.
- Express handlers via `Components`.

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

// handling promise
app.get("/pet", async (req, res, next) => {
  try {
    await res.egx(<Cat/>);
  } catch (err) {
    next(err);
  }
});

app.listen(3000, () => {
  console.log("> Running on port 3000");
});
```

### Express Handlers In Components

```tsx

// example 1
const Home: FC = ({ req, res, next }) => {
  return <h1>Welcome {req.url}</h1>;
};

// example 2: redirect
const SignPost: FC = async ({ req, res }) => {

  const token = await getToken(req.body);

  if (token) {
    // use func to redirect
    return () => {
      res.cookie("user", token).redirect("/admin");
    };
  }
  return <h1>Login Failure</h1>;
};

const app = express();

app.get("/", (req, res) => {
  res.egx(<Home />);
});

app.post("/sign", (req, res) => {
  res.egx(<SignPost />);
});

```

### Example Auth and NextFunction

```tsx
const Auth: FC = ({ req, next, children }) => {

  if (!req.isLogin) {
    // use func to next function
    return () => {
      next(new Error("user not found"));
    };
  }

  return children;
};

app.get("/", (req, res) => {
  res.egx(
    <Auth>
      <Home />
    </Auth>,
  );
});
```

## License

[MIT](LICENSE)
