import express from "express";
import { egx, Helmet } from "egx";

const app = express();

app.use(egx());

app.get("/", (req, res) => {
  res.egx(
    <div>
      <Helmet>
        <title>Welcome Home</title>
      </Helmet>
      <button hx-post="/clicked" hx-swap="outerHTML">
        Click Me
      </button>
    </div>,
  );
});

app.post("/clicked", (req, res) => {
  res.egx(<h1>It's Me</h1>);
});

app.listen(3000, () => {
  console.log("> Running on port 3000");
});
