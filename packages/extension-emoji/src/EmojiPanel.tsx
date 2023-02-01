import React, { useMemo, useState } from 'react';
import { Editor } from '@tiptap/core';
import './EmojiPanel.less';
import classNames from 'classnames';
import type { EmojiStorage, EmojiItem } from './emoji';

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

const EmojiPanel: React.FC<{
  editor: Editor;
}> = ({ editor }) => {
  const [search, setSearch] = useState('');
  const [activeGroup, setActiveGroup] = useState({
    title: '表情',
    group: 'smileys & emotion',
  });
  const { storage } = editor;

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
    // {
    //   title: '符号',
    //   group: 'symbols',
    // },
    // {
    //   title: '国旗',
    //   group: 'flags',
    // },
  ];

  const activeGroupEmojis = useMemo(
    () => storage?.emoji?.emojis.filter((i) => i?.group === activeGroup?.group),
    [storage, activeGroup]
  );

  const searchedEmojis = useMemo(
    () =>
      storage?.emoji?.emojis.filter(({ name, shortcodes, tags }) => {
        return (
          name.startsWith(search.toLowerCase()) ||
          shortcodes.find((shortcode) =>
            shortcode.startsWith(search.toLowerCase())
          ) ||
          tags.find((tag) => tag.startsWith(search.toLowerCase()))
        );
      }),
    [storage, search]
  );

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
              onClick={() => editor?.commands.insertEmoji(emoji.name)}
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
                onClick={() => editor?.commands.insertEmoji(emoji.name)}
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
