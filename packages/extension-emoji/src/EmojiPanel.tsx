import React, {
  forwardRef,
  useMemo,
  useState,
  useEffect,
  useImperativeHandle,
  useRef,
} from 'react';
import classNames from 'classnames';
import { throttle } from 'lodash';
import { SuggestionProps } from '@tiptap/suggestion';
import { IconSearch } from '@gitee/icons-react';
import { appleEmojis } from './emojis';
import { getEmojisByNameList, saveEmojiToStorage } from './utils';
import type { EmojiStorage, EmojiItem } from './emoji';
import type { EmojiPanelRef } from './suggestion';
import './EmojiPanel.less';

const localStorageKey = 'gwe-recent-emojis';

const groups = [
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

const appleEmojisGroupMap: Record<string, EmojiItem[]> = appleEmojis.reduce(
  (acc, emoji) => {
    if (!acc[emoji.group]) {
      acc[emoji.group] = [];
    }
    acc[emoji.group].push(emoji);
    return acc;
  },
  {}
);

const Emoji: React.FC<{
  emojiStorage: EmojiStorage;
  emoji: EmojiItem;
  onClick: () => void;
}> = ({ emojiStorage, emoji, onClick }) => {
  return (
    <span
      className="gwe-emoji-panel__emoji"
      title={emoji.name}
      onClick={onClick}
    >
      {!(emojiStorage as EmojiStorage)?.isSupported(emoji) &&
      emoji.fallbackImage ? (
        <img src={emoji.fallbackImage} />
      ) : (
        emoji.emoji
      )}
    </span>
  );
};

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

  const emojisGroupMap: Record<string, EmojiItem[]> = useMemo(
    () => ({
      recent: historyEmojis,
      ...appleEmojisGroupMap,
    }),
    [historyEmojis]
  );

  const searchedEmojis = useMemo(
    () =>
      appleEmojis.filter(({ name, shortcodes, tags }) => {
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
          setHistoryEmojis(getEmojisByNameList(json, appleEmojis));
          return;
        }
      } catch (e) {
        console.error('localStorage value json parse error:', e);
      }
    }
  };

  const selectEmoji = (emoji: EmojiItem) => {
    if (props.command && typeof props.command === 'function') {
      props.command({ name: emoji.name } as any);
    } else {
      editor?.commands.insertEmoji(emoji.name);
    }
    props.onSelect?.(emoji);
    const nameList = saveEmojiToStorage(emoji);
    setHistoryEmojis(getEmojisByNameList(nameList, appleEmojis));
  };

  const scrollToGroup = (group: string) => {
    const el: HTMLDivElement = document.querySelector(
      `[data-group="${group}"]`
    );
    if (el) {
      contentElRef.current.scrollTop = el.offsetTop;
    }
  };

  const scrollToTop = () => {
    contentElRef.current.scrollTop = 0;
  };

  const getActiveGroupName = () => {
    const contentElTop = contentElRef.current.getBoundingClientRect().top;
    const groupEls: NodeListOf<HTMLDivElement> =
      document.querySelectorAll('[data-group]');
    const activeGroupEl = Array.from(groupEls).find((el) => {
      const elTop = el.getBoundingClientRect().top;
      const elBottom = elTop + el.offsetHeight;
      if (elTop <= contentElTop && elBottom >= contentElTop) {
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
    contentElRef.current.addEventListener('scroll', onScroll);
    return () => {
      contentElRef.current.removeEventListener('scroll', onScroll);
    };
  }, []);

  useEffect(() => {
    setActiveGroup(search ? null : getActiveGroupName());
  }, [search]);

  useEffect(() => {
    // 通过快捷语法输入 : 唤起的搜索, 需设置 search 值
    if (props?.query !== undefined) {
      setSearch(props?.query);
      scrollToTop();
    }
  }, [props?.query]);

  useEffect(() => {
    getEmojisFromStorage();
  }, []);

  useImperativeHandle(ref, () => ({
    onShow: () => {
      getEmojisFromStorage();
      setTimeout(() => inputRef?.current?.focus());
    },
  }));

  return (
    <div className="gwe-editor-popup gwe-emoji-panel">
      <div className="gwe-emoji-panel__input-wrap">
        <IconSearch />
        <input
          ref={inputRef}
          className="gwe-emoji-panel__input"
          type="text"
          placeholder="请输入关键字"
          value={search}
          onChange={(e) => {
            setSearch((e.target.value || '').trim());
            scrollToTop();
          }}
        />
      </div>
      <div ref={contentElRef} className="gwe-emoji-panel__content">
        {search ? (
          <>
            <div className="gwe-emoji-panel__group">
              <div className="gwe-emoji-panel__group-content">
                {searchedEmojis.map((emoji) => (
                  <Emoji
                    key={emoji.name}
                    emoji={emoji}
                    emojiStorage={editor.storage.emoji}
                    onClick={() => selectEmoji(emoji)}
                  />
                ))}
              </div>
            </div>
          </>
        ) : (
          displayGroups.map((group) => (
            <div
              key={group.group}
              className="gwe-emoji-panel__group"
              data-group={group.group}
            >
              <div className="gwe-emoji-panel__group-title">{group.title}</div>
              <div className="gwe-emoji-panel__group-content">
                {emojisGroupMap[group.group].map((emoji) => (
                  <Emoji
                    key={emoji.name}
                    emoji={emoji}
                    emojiStorage={editor.storage.emoji}
                    onClick={() => selectEmoji(emoji)}
                  />
                ))}
              </div>
            </div>
          ))
        )}
      </div>
      <div className="gwe-emoji-panel__menu">
        {displayGroups.map((item) => (
          <button
            key={item.group}
            className={classNames(
              'gwe-emoji-panel__menu-btn',
              activeGroup === item.group
                ? 'gwe-emoji-panel__menu-btn--active'
                : ''
            )}
            onClick={() => {
              setSearch('');
              scrollToGroup(item.group);
            }}
          >
            {item.title}
          </button>
        ))}
      </div>
    </div>
  );
});

EmojiPanel.displayName = 'EmojiPanel';

export default EmojiPanel;
