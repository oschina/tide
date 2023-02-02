import React, { useMemo, useState, useEffect } from 'react';
import './EmojiPanel.less';
import classNames from 'classnames';
import { SuggestionProps } from '@tiptap/suggestion';
import type { EmojiStorage, EmojiItem } from './emoji';
import { appleEmojis } from './emojis';

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

const EmojiPanel: React.FC<SuggestionProps<EmojiItem>> = (props) => {
  const { editor } = props;
  const { storage } = editor;
  const [search, setSearch] = useState(props?.query || '');
  const [activeGroup, setActiveGroup] = useState({
    title: '表情',
    group: 'smileys & emotion',
  });

  const groups = [
    {
      title: '最近',
      group: '',
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

  useEffect(() => {
    if (props?.query) {
      setSearch(props?.query);
      setActiveGroup(null);
    }
  }, [props?.query]);

  const activeGroupEmojis = useMemo(
    () => appleEmojis.filter((i) => i?.group === activeGroup?.group),
    [activeGroup]
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

  const selectEmoji = (emoji: EmojiItem) => {
    if (props.command && typeof props.command === 'function') {
      props.command({ name: emoji.name } as any);
    } else {
      editor?.commands.insertEmoji(emoji.name);
    }
  };

  return (
    <div className="gwe-emoji-panel">
      <div className="gwe-emoji-panel__input-wrap">
        <input
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
};

export default EmojiPanel;
