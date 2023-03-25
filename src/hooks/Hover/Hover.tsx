import { type ForwardedRef, forwardRef } from "react";
import style from "./Hover.module.css";
import clsx from "clsx";

type Props = {
  className?: React.ReactNode;
};

export type Ref = HTMLDivElement;

function HoverComponent({ className }: Props, ref: ForwardedRef<Ref>) {
  return (
    <div
      ref={ref}
      aria-hidden={true}
      className={clsx(style.hover, className)}
    />
  );
}

export const Hover = forwardRef<Ref, Props>(HoverComponent);
