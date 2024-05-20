import { h, isArray } from "./index";
import type { EGX, FC, TAny } from "./types";

function serializeChild(props: EGX.Props<TAny>, children: EGX.ChildNode) {
  if (typeof children === "string") {
    props.dangerouslySetInnerHTML = { __html: children };
  } else if (isArray(children)) {
    props.dangerouslySetInnerHTML = { __html: children.join("") };
  }
  return props;
}

/**
 * Script Component.
 * @example
 * ```jsx
 * const Home = () => {
 *   return (
 *     <>
 *       <Helmet>
 *          <Script>{`console.log("hello")`}</Script>
 *       </Helmet>
 *       <h1>hello</h1>
 *     </>
 *   )
 * }
 * ```
 */
export const Script: FC<
  EGX.ScriptHTMLAttributes & { children?: EGX.ChildNode }
> = ({ children, ...props }) => {
  return h("script", serializeChild(props, children));
};

/**
 * Style Component.
 * @example
 * ```jsx
 * const Home = () => {
 *   return (
 *     <>
 *       <Helmet>
 *          <Style>{`.title{color:blue}`}</Style>
 *       </Helmet>
 *       <h1 className="title">hello</h1>
 *     </>
 *   )
 * }
 * ```
 */
export const Style: FC<
  EGX.StyleHTMLAttributes & { children?: EGX.ChildNode }
> = ({ children, ...props }) => {
  return h("style", serializeChild(props, children));
};
