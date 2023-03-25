import { useEffect, useRef } from "react";
type HoverOptions = {
  top?: number;
  left?: number;
};

export const useHover = <
  NavRef extends HTMLElement,
  HoverRef extends HTMLElement
>(
  options?: HoverOptions
) => {
  const defaultOptions = {
    top: 0,
    left: 0,
  };

  options = { ...defaultOptions, ...options };

  const navRef = useRef<NavRef>(null);
  const hoverRef = useRef<HoverRef>(null);
  const isVisibleRef = useRef(false);

  useEffect(() => {
    const navContainer = navRef.current;
    const hover = hoverRef.current;
    if (!hover) return;
    if (!navContainer) return;

    const top = options?.top || 0;
    const left = options?.left || 0;

    const linkListener = (event: MouseEvent) => {
      const target = event.target as HTMLAnchorElement;

      const rect = target.getBoundingClientRect();
      if (isVisibleRef.current === false) {
        hover.style.transitionProperty = "opacity";
        hover.style.transitionDuration = "150ms";
      } else {
        hover.style.transitionProperty = "opacity,width,transform";
        hover.style.transitionDuration = "150ms";
      }
      isVisibleRef.current = true;

      hover.style.width = `${rect.width}px`;
      hover.style.height = `${rect.height}px`;
      hover.style.opacity = "1";
      hover.style.transform = `translate(calc(${
        rect.left - left
      }px), ${top}px)`;
    };

    const navListener = () => {
      hover.style.opacity = "0";
      isVisibleRef.current = false;
    };

    const links = navContainer.querySelectorAll("a");
    links.forEach((link) => {
      link.addEventListener("mouseenter", linkListener);
    });

    navContainer.addEventListener("mouseleave", navListener);

    return () => {
      links.forEach((link) => {
        link.removeEventListener("mouseenter", linkListener);
      });

      navContainer.removeEventListener("mouseleave", navListener);
    };
  }, [options]);

  return { navRef, hoverRef };
};
