import React, {
  forwardRef,
  useMemo,
  useState,
  useEffect,
  useImperativeHandle,
  useRef,
  memo,
} from 'react';
import classNames from 'classnames';
import { throttle } from 'lodash-es';
import { SuggestionProps } from '@tiptap/suggestion';
import { IconSearch } from '@gitee/icons-react';
import { appleEmojis } from './emojis';
import { getEmojisByNameList, saveEmojiToStorage } from './utils';
import type { EmojiStorage, EmojiItem } from './emoji';
import type { EmojiPanelRef } from './suggestion';
import './EmojiPanel.less';

type Group = {
  title?: string;
  group: string;
};

type EmojiIndexMapType = Record<
  number,
  {
    group: string;
    name: string;
  }
>;

type EmojiGroupNameIndexMapType = Record<string, number>;

const localStorageKey = 'tide-recent-emojis';

const EMOJI_COUNT_PER_ROW = 12;

const groups: Group[] = [
  {
    title: '最近',
    group: 'recent',
  },
  {
    title: '表情',
    group: 'smileys & emotion',
  },
  {
    title: '人物',
    group: 'people & body',
  },
  {
    title: '自然',
    group: 'animals & nature',
  },
  {
    title: '食物',
    group: 'food & drink',
  },
  {
    title: '旅行',
    group: 'travel & places',
  },
  {
    title: '活动',
    group: 'activities',
  },
  {
    title: '物品',
    group: 'objects',
  },
];

const groupMap: Record<string, Group> = groups.reduce((acc, group) => {
  acc[group.group] = group;
  return acc;
}, {} as Record<string, Group>);

const allEmojis: EmojiItem[] = appleEmojis.filter(
  (emoji) => !!groupMap[emoji.group]
);

const allEmojisGroupMap: Record<string, EmojiItem[]> = allEmojis.reduce(
  (acc, emoji) => {
    if (!acc[emoji.group]) {
      acc[emoji.group] = [];
    }
    acc[emoji.group].push(emoji);
    return acc;
  },
  {}
);

type EmojiProps = {
  emojiStorage: EmojiStorage;
  emoji: EmojiItem;
  active?: boolean;
  group: string;
  onClick: (emoji: EmojiItem) => void;
  onHover?: (emoji: EmojiItem, group: string) => void;
};

const Emoji = memo(
  ({ emojiStorage, emoji, active, group, onClick, onHover }: EmojiProps) => {
    return (
      <span
        className={classNames('tide-emoji-panel__emoji', {
          'tide-emoji-panel__emoji--active': active,
        })}
        title={emoji.name}
        data-group={group}
        data-name={emoji.name}
        onClick={() => onClick(emoji)}
        onMouseMove={() => onHover?.(emoji, group)}
      >
        {!(emojiStorage as EmojiStorage)?.isSupported(emoji) &&
        emoji.fallbackImage ? (
          <img src={emoji.fallbackImage} />
        ) : (
          emoji.emoji
        )}
      </span>
    );
  }
);

Emoji.displayName = 'Emoji';

type EmojiGroupProps = {
  group: Group;
  emojiStorage: EmojiStorage;
  emojis: EmojiItem[];
  emojiIndexMap: EmojiIndexMapType;
  activeIndex: number;
  onSelect: (emoji: EmojiItem) => void;
  onHover?: (emoji: EmojiItem, group: string) => void;
};

const EmojiGroup = memo(
  ({
    group,
    emojiStorage,
    emojis,
    emojiIndexMap,
    activeIndex,
    onSelect,
    onHover,
  }: EmojiGroupProps) => {
    return (
      <div className="tide-emoji-panel__group" data-group={group.group}>
        {group.title && (
          <div className="tide-emoji-panel__group-title">{group.title}</div>
        )}
        <div className="tide-emoji-panel__group-content">
          {emojis.map((emoji) => (
            <Emoji
              key={`${group.group}-${emoji.name}`}
              emoji={emoji}
              emojiStorage={emojiStorage}
              active={
                emojiIndexMap[activeIndex] &&
                emojiIndexMap[activeIndex].group === group.group &&
                emojiIndexMap[activeIndex].name === emoji.name
              }
              group={group.group}
              onClick={onSelect}
              onHover={onHover}
            />
          ))}
        </div>
      </div>
    );
  }
);

EmojiGroup.displayName = 'EmojiGroup';

export type EmojiPanelProps = SuggestionProps<EmojiItem> & {
  onSelect?: (emoji: EmojiItem) => void;
};

const EmojiPanel = forwardRef<EmojiPanelRef, EmojiPanelProps>((props, ref) => {
  const { editor } = props;

  const contentElRef = useRef<HTMLDivElement>();
  const inputRef = useRef<HTMLInputElement>();
  const [search, setSearch] = useState(props?.query || '');
  const [historyEmojis, setHistoryEmojis] = useState([]);
  const [activeGroup, setActiveGroup] = useState<string>(null);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [emojiIndexMap, setEmojiIndexMap] = useState<EmojiIndexMapType>({});
  const [emojiGroupNameIndexMap, setEmojiGroupNameIndexMap] =
    useState<EmojiGroupNameIndexMapType>({});

  const emojisGroupMap: Record<string, EmojiItem[]> = useMemo(
    () => ({
      recent: historyEmojis,
      ...allEmojisGroupMap,
    }),
    [historyEmojis]
  );

  const searchedEmojis = useMemo(
    () =>
      allEmojis.filter(({ name, shortcodes, tags }) => {
        return (
          name.startsWith(search.toLowerCase()) ||
          shortcodes.find((shortcode) =>
            shortcode.startsWith(search.toLowerCase())
          ) ||
          tags.find((tag) => tag.startsWith(search.toLowerCase()))
        );
      }),
    [search]
  );

  const displayGroups = useMemo(() => {
    if (historyEmojis.length) {
      return groups;
    } else {
      return groups.slice(1);
    }
  }, [historyEmojis]);

  const getEmojisFromStorage = () => {
    const historyEmojis = localStorage.getItem(localStorageKey);
    if (historyEmojis) {
      try {
        const json = JSON.parse(historyEmojis);
        if (json && json.length) {
          setHistoryEmojis(getEmojisByNameList(json, allEmojis));
          return;
        }
      } catch (e) {
        console.error('localStorage value json parse error:', e);
      }
    }
  };

  const handleSelectEmoji = (emoji: EmojiItem) => {
    if (props.command && typeof props.command === 'function') {
      props.command({ name: emoji.name } as any);
    } else {
      editor?.commands.insertEmoji?.(emoji.name);
    }
    props.onSelect?.(emoji);
    const nameList = saveEmojiToStorage(emoji);
    setHistoryEmojis(getEmojisByNameList(nameList, allEmojis));
  };

  const scrollToGroup = (group: string) => {
    if (!contentElRef.current) return null;
    const el: HTMLDivElement = document.querySelector(
      `[data-group="${group}"]`
    );
    if (el) {
      contentElRef.current.scrollTop = el.offsetTop;
    }
  };

  const scrollToTop = () => {
    if (!contentElRef.current) return null;
    contentElRef.current.scrollTop = 0;
  };

  const scrollToEmoji = (group: string, name: string) => {
    if (!contentElRef.current) return null;
    const el: HTMLDivElement = contentElRef.current.querySelector(
      `[data-group="${group}"] [data-name="${name}"]`
    );
    if (el) {
      const topOffset = 24;
      const bottomOffset = 12;
      if (
        el.offsetTop + el.offsetHeight + bottomOffset >
        contentElRef.current.scrollTop + contentElRef.current.offsetHeight
      ) {
        contentElRef.current.scrollTop =
          el.offsetTop +
          el.offsetHeight +
          bottomOffset -
          contentElRef.current.offsetHeight;
      } else if (el.offsetTop < contentElRef.current.scrollTop + topOffset) {
        contentElRef.current.scrollTop = el.offsetTop - topOffset;
      }
    }
  };

  const getActiveGroupName = () => {
    if (!contentElRef.current) return null;
    const contentElTop = contentElRef.current.getBoundingClientRect().top;
    const groupEls: NodeListOf<HTMLDivElement> =
      document.querySelectorAll('[data-group]');
    const activeGroupEl = Array.from(groupEls)
      .reverse()
      .find((el) => {
        const elTop = el.getBoundingClientRect().top;
        if (elTop <= contentElTop) {
          return true;
        }
        return false;
      });
    if (activeGroupEl) {
      return activeGroupEl.getAttribute('data-group');
    }
    return null;
  };

  useEffect(() => {
    const onScroll = throttle(() => {
      setActiveGroup(getActiveGroupName());
    }, 100);
    contentElRef.current?.addEventListener('scroll', onScroll);
    return () => {
      contentElRef.current?.removeEventListener('scroll', onScroll);
    };
  }, []);

  useEffect(() => {
    setActiveGroup(search ? null : getActiveGroupName());
    setActiveIndex(0);
  }, [search]);

  useEffect(() => {
    // 通过快捷语法输入 : 唤起的搜索, 需设置 search 值
    if (props.query !== undefined) {
      setSearch(props.query);
      scrollToTop();
    }
  }, [props.query]);

  useEffect(() => {
    getEmojisFromStorage();
  }, []);

  useEffect(() => {
    const newEmojiIndexMap: EmojiIndexMapType = {};
    const newEmojiGroupNameIndexMap: EmojiGroupNameIndexMapType = {};
    let index = 0;
    if (search) {
      searchedEmojis.forEach((emoji) => {
        newEmojiIndexMap[index] = {
          group: 'search',
          name: emoji.name,
        };
        newEmojiGroupNameIndexMap[`search-${emoji.name}`] = index;
        index++;
      });
      if (index % EMOJI_COUNT_PER_ROW > 0) {
        index += EMOJI_COUNT_PER_ROW - (index % EMOJI_COUNT_PER_ROW);
      }
    } else {
      Object.keys(emojisGroupMap).forEach((group) => {
        emojisGroupMap[group].forEach((emoji) => {
          newEmojiIndexMap[index] = {
            group,
            name: emoji.name,
          };
          newEmojiGroupNameIndexMap[`${group}-${emoji.name}`] = index;
          index++;
        });
        if (index % EMOJI_COUNT_PER_ROW > 0) {
          index += EMOJI_COUNT_PER_ROW - (index % EMOJI_COUNT_PER_ROW);
        }
      });
    }
    setEmojiIndexMap(newEmojiIndexMap);
    setEmojiGroupNameIndexMap(newEmojiGroupNameIndexMap);
  }, [historyEmojis, search, searchedEmojis]);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    let newIndex: number | undefined;
    if (event.key === 'ArrowUp') {
      if (emojiIndexMap[activeIndex - EMOJI_COUNT_PER_ROW]) {
        newIndex = activeIndex - EMOJI_COUNT_PER_ROW;
      } else {
        const currentGroup = emojiIndexMap[activeIndex].group;
        const currentGroupIndex = displayGroups.findIndex(
          (group) => group.group === currentGroup
        );
        const prevGroup = displayGroups[currentGroupIndex - 1]?.group;
        if (prevGroup) {
          const prevGroupLastIndex = Object.keys(emojiIndexMap)
            .reverse()
            .find((key) => emojiIndexMap[key].group === prevGroup);
          if (prevGroupLastIndex) {
            newIndex = parseInt(prevGroupLastIndex);
          }
        }
      }
    } else if (event.key === 'ArrowDown') {
      if (emojiIndexMap[activeIndex + EMOJI_COUNT_PER_ROW]) {
        newIndex = activeIndex + EMOJI_COUNT_PER_ROW;
      } else {
        const currentGroup = emojiIndexMap[activeIndex].group;
        const currentGroupLastIndex = Object.keys(emojiIndexMap)
          .reverse()
          .find((key) => emojiIndexMap[key].group === currentGroup);
        if (currentGroupLastIndex) {
          newIndex = parseInt(currentGroupLastIndex);
        }
      }
    } else if (event.key === 'ArrowLeft') {
      if (emojiIndexMap[activeIndex - 1]) {
        newIndex = activeIndex - 1;
      } else {
        const prevHasValueIndex = Object.keys(emojiIndexMap)
          .reverse()
          .find((key) => parseInt(key) < activeIndex && emojiIndexMap[key]);
        if (prevHasValueIndex) {
          newIndex = parseInt(prevHasValueIndex);
        }
      }
    } else if (event.key === 'ArrowRight') {
      if (emojiIndexMap[activeIndex + 1]) {
        newIndex = activeIndex + 1;
      } else {
        const nextHasValueIndex = Object.keys(emojiIndexMap).find(
          (key) => parseInt(key) > activeIndex && emojiIndexMap[key]
        );
        if (nextHasValueIndex) {
          newIndex = parseInt(nextHasValueIndex);
        }
      }
    }
    if (newIndex !== undefined && newIndex >= 0) {
      setActiveIndex(newIndex);
      const { group, name } = emojiIndexMap[newIndex];
      scrollToEmoji(group, name);
      return true;
    }

    if (event.key === 'Tab') {
      if (search) {
        return false;
      }
      event.preventDefault();
      const currentGroupIndex = displayGroups.findIndex(
        (group) => group.group === activeGroup
      );
      let nextGroupIndex = currentGroupIndex;
      if (event.shiftKey) {
        if (displayGroups[currentGroupIndex - 1]) {
          nextGroupIndex = currentGroupIndex - 1;
        } else {
          nextGroupIndex = displayGroups.length - 1;
        }
      } else {
        if (displayGroups[currentGroupIndex + 1]) {
          nextGroupIndex = currentGroupIndex + 1;
        } else {
          nextGroupIndex = 0;
        }
      }
      const nextGroup = displayGroups[nextGroupIndex]?.group;
      if (!nextGroup) {
        return false;
      }
      setActiveGroup(nextGroup);
      scrollToGroup(nextGroup);
      setActiveIndex(
        emojiGroupNameIndexMap[
          `${nextGroup}-${emojisGroupMap[nextGroup][0].name}`
        ]
      );
      return true;
    }

    if (event.key === 'Enter') {
      event.preventDefault();
      const emojiIndexData = emojiIndexMap[activeIndex];
      if (emojiIndexData) {
        const { name } = emojiIndexData;
        const emoji = allEmojis.find((emoji) => emoji.name === name);
        handleSelectEmoji(emoji);
        return true;
      }
    }

    return false;
  };

  const handleHoverEmoji = (emoji: EmojiItem, group: string) => {
    setActiveIndex(emojiGroupNameIndexMap[`${group}-${emoji.name}`]);
  };

  useImperativeHandle(ref, () => ({
    onShow: () => {
      getEmojisFromStorage();
      setTimeout(() => inputRef?.current?.focus());
    },
    onKeyDown: ({ event }) =>
      handleKeyDown(event as unknown as React.KeyboardEvent),
  }));

  return (
    <div
      className="tide-editor-popup tide-emoji-panel"
      onKeyDown={handleKeyDown}
    >
      <div className="tide-emoji-panel__input-wrap">
        <IconSearch />
        <input
          ref={inputRef}
          className="tide-emoji-panel__input"
          type="text"
          placeholder="请输入关键字"
          value={search}
          onChange={(e) => {
            setSearch((e.target.value || '').trim());
            scrollToTop();
          }}
        />
      </div>
      <div ref={contentElRef} className="tide-emoji-panel__content">
        {search ? (
          <EmojiGroup
            key={`emoji-group-search`}
            group={{ group: 'search' }}
            emojiStorage={editor.storage.emoji}
            emojis={searchedEmojis}
            emojiIndexMap={emojiIndexMap}
            activeIndex={activeIndex}
            onSelect={handleSelectEmoji}
            onHover={handleHoverEmoji}
          />
        ) : (
          displayGroups.map((group) => (
            <EmojiGroup
              key={`emoji-group-${group.group}`}
              group={group}
              emojiStorage={editor.storage.emoji}
              emojis={emojisGroupMap[group.group]}
              emojiIndexMap={emojiIndexMap}
              activeIndex={activeIndex}
              onSelect={handleSelectEmoji}
              onHover={handleHoverEmoji}
            />
          ))
        )}
      </div>
      <div className="tide-emoji-panel__menu">
        {displayGroups.map((group) => (
          <button
            key={`tab-group-${group.group}`}
            className={classNames('tide-emoji-panel__menu-btn', {
              'tide-emoji-panel__menu-btn--active': activeGroup === group.group,
            })}
            onClick={() => {
              setSearch('');
              scrollToGroup(group.group);
            }}
          >
            {group.title}
          </button>
        ))}
      </div>
    </div>
  );
});

EmojiPanel.displayName = 'EmojiPanel';

export default EmojiPanel;
