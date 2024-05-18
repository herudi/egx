import { h, renderToString } from "./index";
import type { EGX, EObject, TAny, TDataContext, TObject } from "./types";
type TValue = string | number | TAny;
type TContext = {
  Provider: (props: EGX.Props<{ value?: TValue }>) => EGX.Element | null;
  getValue: <T>() => T;
};

/**
 * createContext.
 * @example
 * ```tsx
 * const MyContext = createContext(null);
 * ```
 */
export function createContext<T extends unknown = unknown>(
  initValue?: T,
): TContext {
  const arr = [] as TAny[];
  let idx = 0;
  const reset = (last: number, i = 0, len = arr.length) => {
    while (i < len) {
      if (arr[i].i === last) {
        arr.splice(i, 1);
        break;
      }
      i++;
    }
    if (arr.length === 0) idx = 0;
  };
  return {
    getValue: () => arr[arr.length - 1]?.v?.(),
    async Provider({ value, children }) {
      const i = idx--;
      arr.push({ i, v: () => value ?? initValue });
      const child = await renderToString(children);
      reset(i);
      return h("", {
        dangerouslySetInnerHTML: { __html: child },
      });
    },
  };
}
/**
 * useContext.
 * @example
 * ```tsx
 * const FooContext = createContext();
 *
 * const Home: FC = () => {
 *   const foo = useContext(FooContext);
 *   return <h1>{foo}</h1>
 * }
 *
 * const App: FC = () => {
 *   return (
 *     <FooContext.Provider value="foo">
 *       <Home/>
 *     </FooContext.Provider>
 *   )
 * }
 * ```
 */
export function useContext<T>(context: TContext): T {
  return context.getValue();
}
export const BaseContext = createContext();

/**
 * useDataContext.
 * @example
 * ```tsx
 * const Home: FC = () => {
 *   const ctx = useDataContext();
 *   return <h1>{ctx.request.url}</h1>
 * }
 * ```
 */
export const useDataContext = <T = EObject>(): TDataContext<
  T
> => useContext(BaseContext);

/**
 * useRequest.
 * @example
 * ```tsx
 * const Home: FC = () => {
 *   const req = useRequest();
 *   return <h1>{req.url}</h1>
 * }
 * ```
 */
export const useRequest = () => useDataContext().req;
export const useParams = <T = TObject>(): T => useRequest().params as T;
export const useQuery = <T = TObject>(): T => useRequest().query as T;
export const useBody = <T = TObject>(): T => useRequest().body as T;

/**
 * useResponse.
 * @example
 * ```tsx
 * const Home: FC = () => {
 *   const res = useResponse();
 *   res.status(201);
 *   return <h1>hello</h1>
 * }
 * ```
 */
export const useResponse = () => useDataContext().res;
