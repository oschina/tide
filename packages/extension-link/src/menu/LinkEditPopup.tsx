import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Editor,
  getMarkRange,
  getMarkType,
  isMarkActive,
  posToDOMRect,
} from '@tiptap/core';
import { ReactRenderer } from '@tiptap/react';
import { showBubbleMenu } from '@test-pkgs/extension-bubble-menu';
import styles from './LinkEditPopup.module.less';

export type LinkEditPopupProps = {
  text: string;
  href: string;
  onConfirm: (arg: { text: string; href: string }) => void;
  onCancel: () => void;
};

export const LinkEditPopup: React.FC<LinkEditPopupProps> = ({
  text: defaultText,
  href: defaultHref,
  onConfirm,
  onCancel,
}) => {
  const textInputRef = useRef<HTMLInputElement>(null);
  const hrefInputRef = useRef<HTMLInputElement>(null);
  const [text, setText] = useState(defaultText);
  const [href, setHref] = useState(defaultHref);

  const handleConfirm = useCallback(() => {
    onConfirm?.({
      text: text || href,
      href,
    });
  }, [onConfirm, text, href]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!text) {
        textInputRef.current?.focus();
      } else if (!href) {
        hrefInputRef.current?.focus();
      }
    }, 200);
    return () => {
      clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={styles['link-edit-popup']}>
      <div className={styles.row}>
        <span>文本</span>
        <input
          ref={textInputRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </div>
      <div className={styles.row}>
        <span>链接</span>
        <input
          ref={hrefInputRef}
          value={href}
          onChange={(e) => setHref(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && href) {
              handleConfirm();
            }
          }}
        />
      </div>
      <div>
        <button onClick={handleConfirm} disabled={!href}>
          确定
        </button>
        <button style={{ marginLeft: 8 }} onClick={onCancel}>
          取消
        </button>
      </div>
    </div>
  );
};

export const showLinkEditPopup = (
  editor: Editor,
  options?: {
    dom?: HTMLElement;
    defaultText?: string;
    defaultHref?: string;
  }
) => {
  const { dom, defaultText, defaultHref } = options || {};
  const { state, schema } = editor;
  const { selection } = state;
  const linkMarkType = getMarkType(schema.marks.link, state.schema);
  const isInLink = isMarkActive(state, linkMarkType);

  let start: number;
  let end: number;
  let text: string;
  let href: string;

  if (!isInLink) {
    const { from, to } = selection;
    start = from;
    end = to;
    text = state.doc.textBetween(start, end) || defaultText || '';
    href = defaultHref || '';
  } else {
    const { from } = selection;
    const range = getMarkRange(editor.state.doc.resolve(from), linkMarkType);
    if (!range) {
      return;
    }

    start = range.from;
    end = range.to;

    const attrs = editor.getAttributes(linkMarkType);
    text = state.doc.textBetween(start, end);
    href = attrs.href;
  }

  showBubbleMenu({
    editor,
    placement: 'bottom-start',
    componentRender: (tippyRef) =>
      new ReactRenderer(LinkEditPopup, {
        props: {
          text,
          href,
          onConfirm: (values) => {
            const { view } = editor;
            const { schema } = view.state;
            const node = schema.text(values.text, [
              linkMarkType.create({ href: values.href }),
            ]);
            view.dispatch(
              view.state.tr
                .deleteRange(start, end)
                .insert(start, node)
                .scrollIntoView()
            );
            tippyRef.instance?.hide();
            editor.chain().focus().run();
          },
          onCancel: () => {
            tippyRef.instance?.hide();
            editor.chain().focus().run();
          },
        } as LinkEditPopupProps,
        editor,
      }),
    tippyOptions: {
      getReferenceClientRect: () =>
        dom
          ? dom.getBoundingClientRect()
          : posToDOMRect(editor.view, start, end),
    },
  });
};
