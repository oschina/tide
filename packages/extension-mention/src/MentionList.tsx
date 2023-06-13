import React, {
  forwardRef,
  Ref,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';
import classNames from 'classnames';
import type { BaseMentionListProps, BaseMentionListRef } from './utils';

export type MentionItemDataType<AttrsType = any> = {
  id: string;
  attrs: AttrsType;
};

export type MentionListProps<
  ItemDataType extends MentionItemDataType<ItemAttrsType>,
  ItemAttrsType
> = BaseMentionListProps<ItemDataType, ItemAttrsType> & {
  itemRender: (item: ItemDataType) => React.ReactNode;
  emptyRender?: () => React.ReactNode;
};

export const MentionList = forwardRef(
  <
    ItemDataType extends MentionItemDataType<ItemAttrsType>,
    ItemAttrsType = any
  >(
    props: MentionListProps<ItemDataType, ItemAttrsType>,
    ref: Ref<BaseMentionListRef>
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
      <div className="tide-dropdown-menu">
        <div className="tide-dropdown-menu__content">
          {props.items.length ? (
            props.items.map((item, index) => (
              <div
                key={item.id || index}
                className={classNames(
                  'tide-dropdown-menu__item',
                  'tide-items-between',
                  {
                    'tide-dropdown-menu__item--active': index === selectedIndex,
                  }
                )}
                onClick={() => selectItem(index)}
                onMouseOver={() => moveOverHandler(index)}
              >
                {props.itemRender?.(item)}
              </div>
            ))
          ) : (
            <div className="tide-dropdown-menu__item">
              {props.emptyRender?.() || '没有结果'}
            </div>
          )}
        </div>
      </div>
    );
  }
);

MentionList.displayName = 'MentionList';
