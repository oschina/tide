import React, {
  forwardRef,
  Ref,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';
import classNames from 'classnames';
import type { MentionListProps, MentionListRef } from './utils';
import styles from './MentionList.module.less';

export type MentionItem<A = Record<string, any>> = {
  id: string;
  label: string;
  desc?: string;
  attrs: A;
};

export const MentionList = forwardRef(
  <T extends MentionItem>(
    props: MentionListProps<T>,
    ref: Ref<MentionListRef>
  ) => {
    const [selectedIndex, setSelectedIndex] = useState(0);

    const selectItem = (index: number) => {
      const item = props.items[index];

      if (item) {
        props.command(item.attrs);
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

    const moveOverHandler = (index: number) => {
      setSelectedIndex(index);
    };

    const enterHandler = () => {
      selectItem(selectedIndex);
    };

    useEffect(() => setSelectedIndex(0), [props.items]);

    useImperativeHandle(ref, () => ({
      onKeyDown: ({ event }) => {
        if (event.key === 'ArrowUp') {
          upHandler();
          return true;
        }

        if (event.key === 'ArrowDown') {
          downHandler();
          return true;
        }

        if (event.key === 'Enter') {
          enterHandler();
          return true;
        }

        return false;
      },
    }));

    return (
      <div className="gwe-dropdown-menu">
        {props.items.length ? (
          props.items.map((item, index) => (
            <div
              key={item.id || index}
              className={classNames(
                'gwe-dropdown-menu__item',
                'gwe-items-between',
                {
                  'gwe-dropdown-menu__item--active': index === selectedIndex,
                }
              )}
              onClick={() => selectItem(index)}
              onMouseOver={() => moveOverHandler(index)}
            >
              <span className={styles.label}>{item.label}</span>
              {styles.desc && <span className={styles.desc}>{item.desc}</span>}
            </div>
          ))
        ) : (
          <div className="gwe-dropdown-menu__item">没有结果</div>
        )}
      </div>
    );
  }
);

MentionList.displayName = 'MentionList';
