import type { EGX } from "./types.ts";

const isArray = Array.isArray;

export type HelmetRewind = {
  head: EGX.PureElement[];
  footer: EGX.PureElement[];
  attr: {
    body: EGX.HTMLAttributes;
    html: EGX.HTMLAttributes;
  };
  body?: EGX.PureElement;
};
function toHelmet(elems: EGX.PureElement[]) {
  const helmet: EGX.PureElement[] = [];
  let hasBase = false;
  let hasTitle = false;
  for (let i = elems.length - 1; i >= 0; i -= 1) {
    const elem = elems[i] as EGX.PureElement;
    if (elem != null) {
      if (elem.type === "base") {
        if (hasBase) continue;
        hasBase = true;
      } else if (elem.type === "title") {
        if (hasTitle) continue;
        hasTitle = true;
      }
      helmet.push(elem);
    }
  }
  return helmet.reverse();
}
type FCHelmet = ((
  props: EGX.Props<{
    footer?: boolean;
    children?: EGX.ChildNode;
  }>,
) => EGX.Element | null) & {
  /**
   * Rewind Helmet.
   * @example
   * const { head, footer, body, attr } = Helmet.rewind(<App />);
   */
  rewind: (elem?: EGX.PureElement) => HelmetRewind;
  /**
   * Write head tags.
   * @example
   * const current = Helmet.writeHeadTag?.() ?? [];
   * Helmet.writeHeadTag = () => [
   *   ...current,
   *   <script src="/client.js"></script>
   * ];
   */
  writeHeadTag?: () => EGX.PureElement[];
  /**
   * Write body tags.
   * @example
   * const current = Helmet.writeFooterTag?.() ?? [];
   * Helmet.writeFooterTag = () => [
   *   ...current,
   *   <script src="/client.js"></script>
   * ];
   */
  writeFooterTag?: () => EGX.PureElement[];
  writeHtmlAttr?: () => EGX.HTMLAttributes;
  writeBodyAttr?: () => EGX.HTMLAttributes;
  reset: () => void;
};
/**
 * SSR Helmet for SEO.
 * @example
 * const Home: FC = (props) => {
 *   return  (
 *     <>
 *       <Helmet>
 *         <title>Home Title</title>
 *       </Helmet>
 *       <h1>Home Page</h1>
 *     </>
 *   )
 * }
 */
export const Helmet: FCHelmet = ({ children, footer }) => {
  if (children == null) return null;
  if (!isArray(children)) children = [children];
  const heads = Helmet.writeHeadTag?.() ?? [];
  const bodys = Helmet.writeFooterTag?.() ?? [];
  const elements: EGX.PureElement[] = [];
  for (let i = 0; i < children.length; i++) {
    const child = children[i] as EGX.PureElement;
    if (child != null) {
      if (child.type === "html") {
        Helmet.writeHtmlAttr = () => child.props ?? {};
      } else if (child.type === "body") {
        Helmet.writeBodyAttr = () => child.props ?? {};
      } else elements.push(child);
    }
  }
  if (footer) Helmet.writeFooterTag = () => toHelmet(elements.concat(bodys));
  else Helmet.writeHeadTag = () => toHelmet(elements.concat(heads));
  return null;
};
Helmet.reset = () => {
  Helmet.writeHeadTag = void 0;
  Helmet.writeFooterTag = void 0;
  Helmet.writeHtmlAttr = void 0;
  Helmet.writeBodyAttr = void 0;
};
Helmet.rewind = (elem) => {
  const data = {
    attr: { body: {}, html: {} },
    head: [],
    footer: [],
    body: elem,
  } as HelmetRewind;
  if (Helmet.writeHeadTag) data.head = Helmet.writeHeadTag();
  if (Helmet.writeFooterTag) data.footer = Helmet.writeFooterTag();
  if (Helmet.writeHtmlAttr) data.attr.html = Helmet.writeHtmlAttr();
  if (Helmet.writeBodyAttr) data.attr.body = Helmet.writeBodyAttr();
  Helmet.reset();
  return data;
};
