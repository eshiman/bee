import { useRef, PropRef, Inputs, useEffect, useState } from "preact/hooks";
import { notNil } from "./typeguards";

/** Use Canvas */
export const useCanvas = (
  fn: (canvas: HTMLCanvasElement) => void | (() => void),
  inputs: Inputs
): PropRef<HTMLCanvasElement> => {
  const ref = useRef<HTMLCanvasElement>();

  useEffect(() => (notNil(ref.current) ? fn(ref.current) : undefined), [
    ref.current,
    ...inputs,
  ]);

  // `useRef` without an initial value returns `MutableRef<T | undefined>`,
  // but for usage as a `ref` prop we want `PropRef<HTMLCanvasElement>`.
  // It's safe to assert here because all consumers guard against `ref.current`
  // being null/undefined before using it.
  return ref as unknown as PropRef<HTMLCanvasElement>;
};
/** Use Canvas 2D */
export const useCanvas2d = (
  { width, height }: { width: number; height: number },
  fn: (ctx: CanvasRenderingContext2D) => void | (() => void),
  inputs: Inputs
): PropRef<HTMLCanvasElement> => {
  return useCanvas(
    (canvas) => {
      const ctx = canvas.getContext("2d");

      if (notNil(ctx)) {
        const dpi = window.devicePixelRatio || 1;
        // Expand canvas
        canvas.width = width * dpi;
        canvas.height = height * dpi;
        // Scale Drawing
        ctx.scale(dpi, dpi);
        // Squish Canvas Back Down
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;

        return fn(ctx);
      }
    },
    [width, height, ...inputs]
  );
};
