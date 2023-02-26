import { type PropsWithChildren } from "react";

export const Button = ({
  children,
  ...rest
}: PropsWithChildren<React.ButtonHTMLAttributes<HTMLButtonElement>>) => {
  return <button {...rest}>{children}</button>;
};
