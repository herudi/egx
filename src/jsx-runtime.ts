import { escapeHtml, Fragment, h, internal, isArray, toStyle } from "./index";
import type { EGX, TAny } from "./types";

type CreateElement = (
  type: string,
  props?: EGX.HTMLAttributes & { children?: EGX.ChildNode },
  ...args: unknown[]
) => EGX.ChildNode;
const createElement: CreateElement = (type, props) => {
  if (props?.children == null) return h(type, props);
  const childs = props.children;
  delete props.children;
  if (isArray(childs)) return h(type, props, ...childs);
  return h(type, props, childs);
};
export { Fragment };
export { createElement as jsx };
export { createElement as jsxs };
export { createElement as jsxDev };
export { createElement as jsxDEV };

export const jsxTemplate = (
  tpl: TemplateStringsArray,
  ...subs: EGX.ChildNode[]
) => {
  internal.precompile ??= true;
  const ret = [] as TAny;
  for (let i = 0; i < tpl.length; i++) {
    ret.push(tpl[i]);
    if (i < subs.length) ret.push(subs[i]);
  }
  return h(Fragment, {}, ret);
};
export const jsxEscape = (
  v: string | null | EGX.ChildNode | Array<string | null | EGX.ChildNode>,
) => {
  return v == null || typeof v === "boolean" || typeof v === "function"
    ? null
    : v;
};
export const jsxAttr = (k: string, v: unknown) => {
  if (k === "style" && typeof v === "object") {
    return `${k}="${toStyle(v as Record<string, string | number>)}"`;
  }
  if (
    v == null ||
    v === false ||
    typeof v === "function" ||
    typeof v === "object"
  ) {
    return "";
  } else if (v === true) return k;
  return `${k}="${escapeHtml(v as string, true)}"`;
};
