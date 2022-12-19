import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from 'react';
import classNames from 'classnames';
import type { SuggestionProps } from '@tiptap/suggestion';
import type { EmojiItem, EmojiStorage } from './emoji';
import type { EmojiListRef } from './suggestion';
import styles from './EmojiList.module.less';

export const EmojiList = forwardRef<EmojiListRef, SuggestionProps<EmojiItem>>(
  (props, ref) => {
    const [selectedIndex, setSelectedIndex] = useState(0);

    const selectItem = (index: number) => {
      const item = props.items[index];

      if (item) {
        props.command({ name: item.name } as any);
      }
    };

    const upHandler = () => {
      setSelectedIndex(
        (selectedIndex + props.items.length - 1) % props.items.length
      );
    };

    const downHandler = () => {
      setSelectedIndex((selectedIndex + 1) % props.items.length);
    };

    const enterHandler = () => {
      selectItem(selectedIndex);
    };

    const moveOverHandler = (index: number) => {
      setSelectedIndex(index);
    };

    useEffect(() => setSelectedIndex(0), [props.items]);

    useImperativeHandle(
      ref,
      () => {
        return {
          onKeyDown: (x) => {
            if (x.event.key === 'ArrowUp') {
              upHandler();
              return true;
            }

            if (x.event.key === 'ArrowDown') {
              downHandler();
              return true;
            }

            if (x.event.key === 'Enter') {
              enterHandler();
              return true;
            }

            return false;
          },
        };
      },
      [upHandler, downHandler, enterHandler]
    );

    return (
      <div className={styles.items}>
        {props.items.map((item, index) => (
          <div
            key={index}
            className={classNames(styles.item, {
              [styles['is-selected']]: index === selectedIndex,
            })}
            onClick={() => selectItem(index)}
            onMouseOver={() => moveOverHandler(index)}
          >
            <span className={styles.emoji}>
              {!(props.editor.storage.emoji as EmojiStorage)?.isSupported(
                item
              ) && item.fallbackImage ? (
                <img src={item.fallbackImage} />
              ) : (
                item.emoji
              )}
            </span>
            <span className={styles.label}>:{item.name}:</span>
          </div>
        ))}
      </div>
    );
  }
);

EmojiList.displayName = 'EmojiList';
