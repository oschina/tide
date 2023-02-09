import { Selection } from '@tiptap/pm/state';
import { Node } from '@tiptap/pm/model';

export function getSelectedLineRange(
  selection: Selection,
  codeBlockNode: Node
) {
  const { $from, from, to } = selection;
  const text = codeBlockNode.textContent || '';
  const lines = text.split('\n');
  const lineLastIndexMap = lines.reduce((acc, line, index) => {
    acc[index] = (acc[index - 1] || 0) + line.length + (index === 0 ? 0 : 1);
    return acc;
  }, {} as { [key: number]: number });
  const selectedTextStart = $from.parentOffset;
  const selectedTextEnd = $from.parentOffset + to - from;
  const lineKeys = Object.keys(lineLastIndexMap) as unknown as number[];
  const selectedLineStart: number | undefined = lineKeys.find(
    (index) => lineLastIndexMap[index] >= selectedTextStart
  );
  const selectedLineEnd: number | undefined = lineKeys.find(
    (index) => lineLastIndexMap[index] >= selectedTextEnd
  );
  return {
    start: selectedLineStart,
    end: selectedLineEnd,
  };
}
