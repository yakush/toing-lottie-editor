import { DependencyList, EffectCallback, useEffect, useRef } from "react";

/** useEffect but only triggers when the value on deps changes! (not in component load) */
export function useEffectOnChanged(
  effect: EffectCallback,
  deps?: DependencyList
) {
  const refMounted = useRef(false);
  const refOldDeps = useRef(deps && [...deps]);

  // with the trick
  useEffect(() => {
    if (!refMounted.current) {
      return;
    }

    if (deps?.every((x, i) => x === refOldDeps.current?.at(i))) {
      return;
    }
    refOldDeps.current = deps && [...deps];
    return effect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  // fires once & sets "mountedRef" ref to "true"
  useEffect(() => {
    refMounted.current = true;
  }, []);
}
