import React, {
  forwardRef,
  useMemo,
  useState,
  useEffect,
  useImperativeHandle,
  useRef,
} from 'react';
import classNames from 'classnames';
import { SuggestionProps } from '@tiptap/suggestion';
import type { EmojiStorage, EmojiItem } from './emoji';
import { appleEmojis } from './emojis';
import { getEmojisByNameList, saveEmojiToStorage } from './utils';
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

const EmojiPanel = forwardRef<EmojiPanelRef, SuggestionProps<EmojiItem>>(
  (props, ref) => {
    const { editor } = props;
    const { storage } = editor;
    const [search, setSearch] = useState(props?.query || '');
    const [activeGroup, setActiveGroup] = useState(groups[0]);

    const [historyEmojis, setHistoryEmojis] = useState([]);
    const inputRef = useRef<HTMLInputElement>();

    const activeGroupEmojis = useMemo(() => {
      if (activeGroup?.group === 'recent') {
        return historyEmojis;
      } else {
        return appleEmojis.filter((i) => i?.group === activeGroup?.group);
      }
    }, [activeGroup, historyEmojis]);

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

    // 从本地存储获取最近使用的emojis
    const getEmojisFromStorage = () => {
      const historyEmojis = localStorage.getItem(localStorageKey);
      if (historyEmojis) {
        try {
          const json = JSON.parse(historyEmojis);
          if (json && json.length) {
            setHistoryEmojis(getEmojisByNameList(json, appleEmojis));
            setActiveGroup(groups[0]);
          }
        } catch (e) {
          console.error('localStorage value json parse error:', e);
        }
      }
    };

    useEffect(() => {
      // 若是输入：搜索的，需设置input的值
      if (props?.query) {
        setSearch(props?.query);
        setActiveGroup(null);
      }
    }, [props?.query]);

    useEffect(() => {
      getEmojisFromStorage();
    }, []);

    const selectEmoji = (emoji: EmojiItem) => {
      if (props.command && typeof props.command === 'function') {
        props.command({ name: emoji.name } as any);
      } else {
        editor?.commands.insertEmoji(emoji.name);
      }
      const nameList = saveEmojiToStorage(emoji);
      setHistoryEmojis(getEmojisByNameList(nameList, appleEmojis));
    };

    useImperativeHandle(ref, () => ({
      onShow: () => {
        getEmojisFromStorage();
        setTimeout(() => inputRef?.current?.focus());
      },
    }));

    return (
      <div className="gwe-emoji-panel">
        <div className="gwe-emoji-panel__input-wrap">
          <input
            ref={inputRef}
            className="gwe-emoji-panel__input"
            type="text"
            placeholder="请输入关键字"
            value={search}
            onChange={(e) => {
              const val = e.target.value.trim();
              setSearch(val);
              if (val) {
                setActiveGroup(null);
              } else {
                setActiveGroup(groups[0]);
              }
            }}
          />
        </div>
        <div className="gwe-emoji-panel__content">
          {search &&
            searchedEmojis &&
            searchedEmojis.map((emoji) => (
              <Emoji
                key={emoji.name}
                emoji={emoji}
                emojiStorage={storage.emoji}
                onClick={() => selectEmoji(emoji)}
              />
            ))}
          {activeGroup && (
            <>
              <div>
                <span className="gwe-emoji-panel__group-title">
                  {activeGroup.title}
                </span>
              </div>
              {activeGroupEmojis.map((emoji) => (
                <Emoji
                  key={emoji.name}
                  emoji={emoji}
                  emojiStorage={storage.emoji}
                  onClick={() => selectEmoji(emoji)}
                />
              ))}
            </>
          )}
        </div>
        <div className="gwe-emoji-panel__menu">
          {groups.map((item) => (
            <button
              className={classNames(
                'gwe-emoji-panel__menu-btn',
                activeGroup?.group === item.group
                  ? 'gwe-emoji-panel__menu-btn--active'
                  : ''
              )}
              key={item.title}
              onClick={() => {
                setActiveGroup(item);
                setSearch('');
              }}
            >
              {item.title}
            </button>
          ))}
        </div>
      </div>
    );
  }
);

export default EmojiPanel;
