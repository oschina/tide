import * as React from "react";
import Blockquote from "@tiptap/extension-blockquote";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import { EditorContent, useEditor } from "@tiptap/react";

const Editor = () => {
  const editor = useEditor({
    extensions: [Document, Paragraph, Text, Blockquote],
    content: `
      <blockquote>
        Nothing is impossible, the word itself says “I’m possible!”
      </blockquote>
      <p>Audrey Hepburn</p>
    `,
  });

  if (!editor) {
    return null;
  }

  return (
    <>
      <EditorContent editor={editor} />
    </>
  );
};

export default Editor;
