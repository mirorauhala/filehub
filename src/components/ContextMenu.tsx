import * as ContextMenuPrimitive from "@radix-ui/react-context-menu";
import { forwardRef } from "react";

export const ContextMenuTrigger: typeof ContextMenuPrimitive.Trigger =
  forwardRef(function ContextMenuTrigger({ children, ...props }, forwardedRef) {
    return (
      <ContextMenuPrimitive.Trigger ref={forwardedRef} {...props}>
        {children}
      </ContextMenuPrimitive.Trigger>
    );
  });

export const ContextMenuContent: typeof ContextMenuPrimitive.Content =
  forwardRef(function ContextMenuContent({ children, ...props }, forwardedRef) {
    return (
      <ContextMenuPrimitive.Content
        ref={forwardedRef}
        {...props}
        className="min-w-[220px] origin-[var(--radix-context-menu-content-transform-origin)] overflow-hidden rounded-md bg-white p-[5px] shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)] data-[state=close]:animate-contextClose data-[state=open]:animate-contextOpen"
      >
        {children}
      </ContextMenuPrimitive.Content>
    );
  });

export const ContextMenuLabel: typeof ContextMenuPrimitive.Label = forwardRef(
  function ContextMenuLabel({ children, ...props }, forwardedRef) {
    return (
      <ContextMenuPrimitive.Label
        ref={forwardedRef}
        {...props}
        className="select-none pl-[25px] text-xs font-medium leading-[25px] text-gray-500"
      >
        {children}
      </ContextMenuPrimitive.Label>
    );
  }
);

export const ContextMenuItem: typeof ContextMenuPrimitive.Item = forwardRef(
  function ContextMenuItem({ children, ...props }, forwardedRef) {
    return (
      <ContextMenuPrimitive.Item
        ref={forwardedRef}
        {...props}
        className="group relative flex h-[25px] cursor-pointer select-none items-center rounded-[3px] px-[5px] pl-[25px] text-[13px] leading-none text-black outline-none disabled:cursor-not-allowed data-[disabled]:pointer-events-none data-[highlighted]:bg-blue-500 data-[disabled]:text-gray-300 data-[highlighted]:text-white"
      >
        {children}
      </ContextMenuPrimitive.Item>
    );
  }
);

export const ContextMenuGroup: typeof ContextMenuPrimitive.Group = forwardRef(
  function ContextMenuGroup({ children, ...props }, forwardedRef) {
    return (
      <ContextMenuPrimitive.Group ref={forwardedRef} {...props}>
        {children}
      </ContextMenuPrimitive.Group>
    );
  }
);

export const ContextMenuCheckboxItem: typeof ContextMenuPrimitive.CheckboxItem =
  forwardRef(function ContextMenuCheckboxItem(
    { children, ...props },
    forwardedRef
  ) {
    return (
      <ContextMenuPrimitive.CheckboxItem ref={forwardedRef} {...props}>
        {children}
      </ContextMenuPrimitive.CheckboxItem>
    );
  });

export const ContextMenuItemIndicator: typeof ContextMenuPrimitive.ItemIndicator =
  forwardRef(function ContextMenuItemIndicator({ children }, forwardedRef) {
    return (
      <ContextMenuPrimitive.ItemIndicator ref={forwardedRef}>
        {children}
      </ContextMenuPrimitive.ItemIndicator>
    );
  });

export const ContextMenuSeparator: typeof ContextMenuPrimitive.Separator =
  forwardRef(function ContextMenuSeparator({ children }, forwardedRef) {
    return (
      <ContextMenuPrimitive.Separator
        ref={forwardedRef}
        className="m-[5px] h-[1px] bg-gray-300"
      >
        {children}
      </ContextMenuPrimitive.Separator>
    );
  });

export const ContextMenuRadioGroup: typeof ContextMenuPrimitive.RadioGroup =
  forwardRef(function ContextMenuRadioGroup(
    { children, ...props },
    forwardedRef
  ) {
    return (
      <ContextMenuPrimitive.RadioGroup ref={forwardedRef} {...props}>
        {children}
      </ContextMenuPrimitive.RadioGroup>
    );
  });

export const ContextMenuRadioItem: typeof ContextMenuPrimitive.RadioItem =
  forwardRef(function ContextMenuRadioItem(
    { children, ...props },
    forwardedRef
  ) {
    return (
      <ContextMenuPrimitive.RadioItem ref={forwardedRef} {...props}>
        {children}
      </ContextMenuPrimitive.RadioItem>
    );
  });

export const ContextMenuSubTrigger: typeof ContextMenuPrimitive.SubTrigger =
  forwardRef(function ContextMenuSubTrigger(
    { children, ...props },
    forwardedRef
  ) {
    return (
      <ContextMenuPrimitive.SubTrigger ref={forwardedRef} {...props}>
        {children}
      </ContextMenuPrimitive.SubTrigger>
    );
  });

export const ContextMenuSub: typeof ContextMenuPrimitive.Sub =
  ContextMenuPrimitive.Sub;

export const ContextMenuPortal: typeof ContextMenuPrimitive.Portal =
  ContextMenuPrimitive.Portal;

export const ContextMenuRoot: typeof ContextMenuPrimitive.Root =
  ContextMenuPrimitive.Root;
