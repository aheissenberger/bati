import {
  computePosition,
  type ComputePositionConfig,
  type ComputePositionReturn,
  type ReferenceElement,
  type Strategy,
} from "@floating-ui/dom";
import { createEffect, createMemo, createSignal, onCleanup } from "solid-js";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function ignore<T>(_value: T): void {
  // no-op
}

export interface UseFloatingOptions<R extends ReferenceElement, F extends HTMLElement>
  extends Partial<ComputePositionConfig> {
  whileElementsMounted?: (reference: R, floating: F, update: () => void) => void | (() => void);
  offset?: number;
  offsetArrow?: number;
}

interface UseFloatingState extends Omit<ComputePositionReturn, "x" | "y"> {
  x?: number | null;
  y?: number | null;
}

export interface UseFloatingResult extends UseFloatingState {
  update(): void;
  modal: {
    position: Strategy;
    top: string | 0;
    left: string | 0;
  };
  arrow: {
    left: string;
    top: string;
    right: string;
    bottom: string;
  };
}

export function useFloating<R extends ReferenceElement, F extends HTMLElement>(
  reference: () => R | undefined | null,
  floating: () => F | undefined | null,
  options?: UseFloatingOptions<R, F>,
): UseFloatingResult {
  const placement = () => options?.placement ?? "bottom";
  const strategy = () => options?.strategy ?? "absolute";
  const offset = options?.offset ?? 0;
  const offsetArrow = options?.offsetArrow ?? 0;

  const [data, setData] = createSignal<UseFloatingState>({
    x: null,
    y: null,
    placement: placement(),
    strategy: strategy(),
    middlewareData: {},
  });

  const [error, setError] = createSignal<{ value: unknown } | undefined>();

  createEffect(() => {
    const currentError = error();
    if (currentError) {
      throw currentError.value;
    }
  });

  const version = createMemo(() => {
    reference();
    floating();
    return {};
  });

  function update() {
    const currentReference = reference();
    const currentFloating = floating();

    if (currentReference && currentFloating) {
      const capturedVersion = version();
      computePosition(currentReference, currentFloating, {
        middleware: options?.middleware,
        placement: placement(),
        strategy: strategy(),
      }).then(
        (currentData) => {
          // Check if it's still valid
          if (capturedVersion === version()) {
            setData(currentData);
          }
        },
        (err) => {
          setError(err);
        },
      );
    }
  }

  createEffect(() => {
    const currentReference = reference();
    const currentFloating = floating();

    // Subscribe to other reactive properties
    ignore(options?.middleware);
    placement();
    strategy();

    if (currentReference && currentFloating) {
      if (options?.whileElementsMounted) {
        const cleanup = options.whileElementsMounted(currentReference, currentFloating, update);

        if (cleanup) {
          onCleanup(cleanup);
        }
      } else {
        update();
      }
    }
  });

  return {
    get x() {
      return data().x;
    },
    get y() {
      return data().y;
    },
    get placement() {
      return data().placement;
    },
    get strategy() {
      return data().strategy;
    },
    get middlewareData() {
      return data().middlewareData;
    },
    get modal() {
      const d = data();

      const placement = d.placement.split("-")[0];

      const x_offset = placement === "bottom" || placement === "top";
      const y_offset = placement === "right" || placement == "left";

      return {
        position: d.strategy,
        top: d.y ? d.y + (x_offset ? offset * Math.sign(d.y) : 0) + "px" : (0 as const),
        left: d.x ? d.x + (y_offset ? offset * Math.sign(d.x) : 0) + "px" : (0 as const),
      };
    },
    get arrow() {
      const d = data();
      const arrow = d.middlewareData.arrow;

      const staticSide = {
        top: "bottom",
        right: "left",
        bottom: "top",
        left: "right",
      }[d.placement.split("-")[0]]!;

      return {
        left: arrow?.x != null ? `${arrow.x}px` : "",
        top: arrow?.y != null ? `${arrow.y}px` : "",
        right: "",
        bottom: "",
        [staticSide]: offsetArrow + "px",
      };
    },
    update,
  };
}
