import type { EmojiItem } from './emoji';

const emojiSupportsMap = new Map();

const supportsEmoji = (() => {
  let ctx: CanvasRenderingContext2D | null = null;
  try {
    ctx = document.createElement('canvas').getContext('2d');
  } catch {
    // do nothing
  }
  if (!ctx) {
    return () => false;
  }
  const o = 25;
  const e = 20;
  const n = Math.floor(o / 2);

  ctx.font = `${n}px Arial, Sans-Serif`;
  ctx.textBaseline = 'top';
  ctx.canvas.width = e * 2;
  ctx.canvas.height = o;
  return (t: string) => {
    if (!ctx) {
      return false;
    }
    ctx.clearRect(0, 0, e * 2, o);
    ctx.fillStyle = '#FF0000';
    ctx.fillText(t, 0, 22);
    ctx.fillStyle = '#0000FF';
    ctx.fillText(t, e, 22);
    const l = ctx.getImageData(0, 0, e, o).data;
    const g = l.length;
    let p = 0;
    for (; p < g && !l[p + 3]; p += 4);
    if (p >= g) return !1;
    const sx = e + ((p / 4) % e);
    const sy = Math.floor(p / 4 / e);
    const j = ctx.getImageData(sx, sy, 1, 1).data;
    return !(
      l[p] !== j[0] ||
      l[p + 2] !== j[2] ||
      ctx.measureText(t).width >= e
    );
  };
})();

export function findEmoji(name: string, emojis: EmojiItem[]) {
  return emojis.find(
    (emoji) => name === emoji.name || emoji.shortcodes.includes(name)
  );
}

export function getEmojiName(emoji: string, emojis: EmojiItem[]) {
  const e = emojis.find(
    (item) => item.emoji === emoji.replace('\uFE0E', '').replace('\uFE0F', '')
  );
  return e?.shortcodes?.[0];
}

export function checkEmojiSupport(emojiSymbol: string) {
  if (emojiSupportsMap.has(emojiSymbol)) {
    return emojiSupportsMap.get(emojiSymbol);
  }
  const isSupported = supportsEmoji(emojiSymbol);
  emojiSupportsMap.set(emojiSymbol, isSupported);
  return isSupported;
}

export const getEmojisByNameList = (
  nameList: string[],
  emojis: EmojiItem[]
) => {
  const list = [];
  nameList.forEach((name) => {
    const emoji = emojis.find((i) => i.name === name);
    if (emoji) {
      list.push(emoji);
    }
  });
  return list;
};

export const saveEmojiToStorage = (emoji: EmojiItem) => {
  const localStorageKey = 'tide-recent-emojis';
  try {
    const historyEmojis = localStorage.getItem(localStorageKey);
    let nameList = [];
    if (historyEmojis) {
      nameList = JSON.parse(historyEmojis);
      nameList.unshift(emoji.name);
    } else {
      nameList = [emoji.name];
    }
    nameList = Array.from(new Set(nameList)).slice(0, 24);

    localStorage.setItem(localStorageKey, JSON.stringify(nameList));
    return nameList;
  } catch (e) {
    console.log('localStorage setItem error:', e);
    return [emoji.name];
  }
};
