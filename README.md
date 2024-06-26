# Egx

An ExpressJS Got Htmx and JSX.

<b>ExpressJS</b> is a Fast, unopinionated, minimalist web framework.

<b>Htmx</b> gives you access to AJAX, CSS Transitions, WebSockets and Server
Sent Events directly in HTML, using attributes, so you can build modern user
interfaces with the simplicity and power of hypertext.

<b>JSX</b> it's just JavaScript XML. JSX makes it easier to write markup HTML.

## Features

- Hooks support (`useRequest`, `useResponse`, `useBody`, `useParams`,
  `useQuery`, etc.).
- Helmet support.
- `AsyncComponent` support.
- `CleanupComponent` support.

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
    await res.egx(<h1>Cat</h1>);
  } catch (err) {
    next(err);
  }
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
};
```

### useResponse

```tsx
const Foo = () => {
  const res = useResponse();
  res.set("my-header", "value");
  return <h1>hello</h1>;
};
```

### useParams

```tsx
type User = { name: string };

const Foo = () => {
  const { name } = useParams<User>();
  return <h1>{name}</h1>;
};

app.get("/user/:name", (req, res) => {
  res.egx(<Foo />);
});
```

### useQuery

```tsx
type User = { name: string };

const Foo = () => {
  const { name } = useQuery<User>();
  return <h1>{name}</h1>;
};

app.get("/user", (req, res) => {
  res.egx(<Foo />);
});

// GET /user?name=john
```

### useBody

```tsx
type User = { name: string };

const UserPost = async () => {
  const user = useBody<User>();
  // example save to db
  await db.user.save(user);

  return <h1>{user.name}</h1>;
};

app.post("/user", (req, res) => {
  res.egx(<UserPost />);
});
```

## Using Cleanup Component

A `cleanup` component for any custom `send`. for example: json/redirect.

### Example Sign and redirect

```tsx
const Sign = async () => {
  const req = useRequest();
  const res = useResponse();

  const token = await getToken(req.body);

  if (token) {
    // use cleanup to redirect
    return () => {
      res.cookie("user", token).redirect("/admin");
    };
  }
  return <SignPost message="login failure" />;
};
```

### Example Auth and NextFunction

```tsx
const Auth: FC = (props) => {
  const req = useRequest();
  const next = useNext();

  if (req.isLogin === false) {
    // use cleanup to next function
    return () => {
      next(new Error("user not found"));
    };
  }

  return props.children;
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
