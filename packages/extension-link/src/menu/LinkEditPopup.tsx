import React, { useCallback, useEffect, useRef, useState } from 'react';
import { TextSelection } from '@tiptap/pm/state';
import {
  Editor,
  getMarkRange,
  getMarkType,
  posToDOMRect,
  Range,
} from '@tiptap/core';
import { isActive } from '@gitee/tide-common';
import { ReactRenderer, showBubbleMenu } from '@gitee/tide-react';
import './LinkEditPopup.less';

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
  }, []);

  return (
    <div className="tide-editor-popup tide-link-popup">
      <div className="tide-link-popup__row">
        <label className="tide-link-popup__label">文本</label>
        <input
          className="tide-link-popup__input"
          ref={textInputRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </div>
      <div className="tide-link-popup__row">
        <label className="tide-link-popup__label">链接</label>
        <input
          className="tide-link-popup__input"
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
      <div className="tide-link-popup__btn-group">
        <button
          className="tide-link-popup__button tide-link-popup__button--basic"
          style={{ marginLeft: 8 }}
          onClick={onCancel}
        >
          取消
        </button>
        <button
          className="tide-link-popup__button tide-link-popup__button--primary"
          onClick={handleConfirm}
          disabled={!href}
        >
          确定
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
  const { $from, from, to, empty } = selection;
  const linkMarkType = getMarkType(schema.marks.link, state.schema);
  const isInLink = isActive(state, linkMarkType.name);
  const attrs = editor.getAttributes(linkMarkType);

  // 选区
  let start: number;
  let end: number;

  if (!isInLink) {
    // 无链接: 创建链接
    start = from;
    end = to;
  } else {
    // 有链接: 编辑链接
    let range: void | Range;
    if (empty) {
      // 无选区: 编辑光标所在的 node 的链接 (连续多个相同链接的 node 会被一起编辑)
      const markRange = getMarkRange($from, linkMarkType, attrs);
      if (markRange) {
        range = {
          from: markRange.from,
          to: markRange.to,
        };
      }
    } else {
      // 有选区: 编辑对应区域的链接 (如果选区在 node 内部 或 跨多个 node, 将自动拆开)
      range = {
        from,
        to,
      };
    }
    if (!range) {
      return;
    }
    start = range.from;
    end = range.to;
  }

  // 文字/链接
  let text = '';
  let href = '';

  state.doc.nodesBetween(start, end, (node, pos, parent, index) => {
    if (!node.isInline) {
      return;
    }
    const chunk =
      node.type.spec.toText?.({
        node,
        pos,
        parent,
        index,
      }) ||
      node.textContent ||
      '';
    // 此处使用展开运算符解决 emoji unicode 多个字符截取的问题
    text += [...chunk]
      .slice(Math.max(0, start - pos), Math.max(0, end - pos))
      .join('');
  });

  if (!isInLink) {
    text = text || state.doc.textBetween(start, end) || defaultText || '';
    href = defaultHref || '';
  } else {
    text = text || state.doc.textBetween(start, end) || '';
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
            if (text === values.text) {
              // 文字未变化: 只修改链接
              editor
                .chain()
                .setTextSelection({ from: start, to: end })
                .setLink({
                  href: values.href,
                })
                .run();
            } else {
              // 文字有变化: 替换内容并添加链接

              // 插入内容 (通过 insertContentAt 插入内容可以解析 emoji, 为 emoji 创建 node)
              editor
                .chain()
                .deleteRange({ from: start, to: end })
                .insertContentAt(start, values.text, {
                  updateSelection: true,
                })
                .run();

              // 添加链接
              editor
                .chain()
                .command(({ tr }) => {
                  const markFrom = Math.min(start, tr.selection.from);
                  const markTo = tr.selection.to;
                  tr.setSelection(
                    TextSelection.create(tr.doc, markFrom, markTo)
                  );
                  return true;
                })
                .setLink({
                  href: values.href,
                })
                .run();
            }
            tippyRef.instance?.hide();
            editor.commands.focus();
          },
          onCancel: () => {
            tippyRef.instance?.hide();
            editor.commands.focus();
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
