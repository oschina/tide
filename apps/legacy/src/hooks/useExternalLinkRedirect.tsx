import React, { useEffect } from 'react';

const GITEE_BASE_URL = window.location.origin;

export function useExternalLinkRedirect(
  dom: HTMLElement,
  needReplace: boolean,
  deps: React.DependencyList = []
) {
  useEffect(() => {
    if (!dom || !needReplace) {
      return;
    }

    const links: NodeListOf<HTMLAnchorElement> =
      dom.querySelectorAll('.ProseMirror a');
    if (links.length < 1) {
      return;
    }

    const locationDomain = window.location.hostname
      .split('.')
      .slice(-2)
      .join('.');
    const locationRegex = new RegExp(`^https?://[^/]*?${locationDomain}`);
    const whiteListRegex = /^https?:\/\/[^/]*?(gitee|oschina)\.(com|cn|net|io)/;

    links.forEach((link) => {
      const { href } = link;
      if (
        !href ||
        locationRegex.test(link.href) ||
        whiteListRegex.test(link.href)
      ) {
        return;
      }
      try {
        link.setAttribute(
          'href',
          `${GITEE_BASE_URL}/link?target=${encodeURIComponent(href)}`
        );
        link.setAttribute('target', '_blank');
      } catch (e) {
        console.error(e);
      }
    });
  }, [dom, needReplace, ...deps]);
}