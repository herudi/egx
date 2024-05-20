import type { RequestHandler } from "express";
import { Helmet as HelmetCore, type HelmetRewind } from "./helmet";
import { BaseContext } from "./hook";
import type { EGX, EObject, FC, TAny } from "./types";
export * from "./hook";
export * from "./component";
export * from "./types";

export const Helmet = HelmetCore;
export type { HelmetRewind };

declare global {
  namespace Express {
    export interface Response {
      egx: (elem: EGX.Element | FC<TAny>) => Promise<void>;
    }
  }
  namespace JSX {
    type Element = EGX.Element;
    interface IntrinsicElements extends EGX.IntrinsicElements {
      [k: string]: {
        children?: EGX.ChildNode;
        [k: string]: TAny;
      };
    }
    interface ElementChildrenAttribute {
      children: EObject;
    }
    type PureElement = EGX.PureElement;
    type Props = EGX.Props;
    type ChildNode = EGX.ChildNode;
  }
}
export const isArray = Array.isArray;
export const isFunc = <T>(v: T) => typeof v === "function";
export const dangerHTML = "dangerouslySetInnerHTML";
/**
 * Fragment.
 * @example
 * const Home: FC<{ title: string; }> = (props) => {
 *   return <Fragment><h1>{props.title}</h1></Fragment>
 * }
 */
export const Fragment: FC<{ dangerouslySetInnerHTML?: { __html: string } }> = (
  props,
) => {
  if (props[dangerHTML] !== void 0) return h("", props);
  return props.children;
};
export function h(
  type: string,
  props?: EGX.HTMLAttributes | null,
  ...children: EGX.ChildNode[]
): EGX.PureElement;
export function h<T = EObject>(
  type: FC<T>,
  props?: T | null,
  ...children: EGX.ChildNode[]
): EGX.PureElement | null;
export function h(
  type: string | FC,
  props?: EObject | null,
  ...children: EGX.ChildNode[]
): EGX.ChildNode {
  return {
    type,
    props: children.length > 0 ? { ...props, children } : props,
    key: null,
    _$e$__: 0,
  } as EGX.ChildNode;
}
h.Fragment = Fragment;

/**
 * check isValidElement.
 * @example
 * ```tsx
 * isValidElement(<h1>hi</h1>) // true;
 *
 * isValidElement(true) // false;
 *
 * isValidElement("hello") // false;
 * ```
 */
export const isValidElement = (v: TAny) => v?._$e$__ !== void 0;
export const internal = {} as { precompile?: boolean };

const REG_ETT = /["'&<>]/g;
const mutAttr: Record<string, string> = {
  acceptCharset: "accept-charset",
  httpEquiv: "http-equiv",
  htmlFor: "for",
  className: "class",
};

export function escapeHtml(str: string, force?: boolean) {
  return (internal.precompile && !force) || !REG_ETT.test(str)
    ? str
    : str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
export function toStyle(val: EGX.CSSProperties) {
  return Object.keys(val).reduce(
    (a, b) =>
      a +
      b.replace(/[A-Z]/g, "-$&").toLowerCase() +
      ":" +
      (typeof val[b] === "number" ? val[b] + "px" : val[b]) +
      ";",
    "",
  );
}
const REG_EMPTY_TAG =
  /area|base|br|col|embed|hr|img|input|keygen|link|meta|param|source|track|wbr/;
function toAttr(props: TAny = {}) {
  let attr = "";
  for (const k in props) {
    let val = props[k];
    if (
      val == null ||
      val === false ||
      k === dangerHTML ||
      k === "children" ||
      typeof val === "function"
    ) {
      continue;
    }
    let key = mutAttr[k] ?? k.toLowerCase();
    if (key === "hx-full" && val) {
      key = "hx-headers";
      val = '{"hx-request": "false"}';
    }
    if (val === true) {
      attr += ` ${key}`;
    } else {
      if (key === "style" && typeof val === "object") val = toStyle(val);
      attr += ` ${key}="${escapeHtml(String(val))}"`;
    }
  }
  return attr;
}
export async function renderToString(elem: EGX.ChildNode): Promise<string> {
  if (elem == null || typeof elem === "boolean") return "";
  if (isFunc(elem)) return elem as TAny;
  if (typeof elem === "number") return String(elem);
  if (typeof elem === "string") return escapeHtml(elem);
  if (isArray(elem)) {
    return (await Promise.all(elem.map(renderToString))).join("");
  }
  const { type, props } = elem as EGX.FCElement;
  if (typeof type === "function") {
    return await renderToString(await type(props ?? {}));
  }
  const attr = toAttr(props);
  if (REG_EMPTY_TAG.test(type)) return `<${type}${attr}>`;
  if (props?.[dangerHTML] != null) {
    if (type === "") return props[dangerHTML].__html;
    return `<${type}${attr}>${props[dangerHTML].__html}</${type}>`;
  }
  if (type === "") return await renderToString(props?.["children"]);
  return `<${type}${attr}>${await renderToString(
    props?.["children"],
  )}</${type}>`;
}

export const toHtml = async (body: string, init: EGX.ChildNode) => {
  const { head, footer, attr } = Helmet.rewind();
  attr.html.lang ??= "en";
  return (
    "<!DOCTYPE html>" +
    `<html${toAttr(attr.html)}>` +
    '<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">' +
    (await renderToString(init)) +
    (head.length ? await renderToString(head) : "") +
    `</head><body${toAttr(attr.body)}>${body}` +
    (footer.length ? await renderToString(footer) : "") +
    "</body></html>"
  );
};

export function egx(htmxScriptElement?: EGX.ChildNode): RequestHandler {
  const init =
    htmxScriptElement ??
    h("script", { src: "https://unpkg.com/htmx.org@1.9.10" });
  return (req, res, next) => {
    res.egx = async (element: EGX.Element | FC<TAny>) => {
      let children: TAny = isFunc(element) ? h(element as FC, null) : element;
      const elem = await BaseContext.Provider({
        children,
        value: { req, res, next },
      });
      const body = (await renderToString(elem)) as TAny;
      if (isFunc(body)) {
        await body();
        return;
      }
      const isHtmxReq = req.headers["hx-request"] === "true";
      res.send(isHtmxReq ? body : await toHtml(body, init));
    };
    next();
  };
}
