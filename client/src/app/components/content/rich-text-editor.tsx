"use client";

import { useEffect, useRef } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Placeholder } from "@tiptap/extensions";
import { Bold, Italic, Underline, List, ListOrdered } from "lucide-react";
import { isHtml, plainTextToHtml } from "./rich-content";

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  invalid?: boolean;
}

const toEditorHtml = (value: string) =>
  !value ? "" : isHtml(value) ? value : plainTextToHtml(value);

export default function RichTextEditor({
  value,
  onChange,
  placeholder,
  invalid = false,
}: RichTextEditorProps) {
  const lastEmitted = useRef(value);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false,
        blockquote: false,
        code: false,
        codeBlock: false,
        horizontalRule: false,
        strike: false,
        link: false,
      }),
      Placeholder.configure({ placeholder: placeholder ?? "" }),
    ],
    content: toEditorHtml(value),
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: "rich-content font-raleway text-bodytext text-sm sm:text-base leading-relaxed min-h-40 px-4 py-3 outline-none",
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.isEmpty ? "" : editor.getHTML();
      lastEmitted.current = html;
      onChange(html);
    },
  });

  // Follow outside changes (opening another item, resetting the form) without
  // fighting the editor on its own keystrokes.
  useEffect(() => {
    if (editor && value !== lastEmitted.current) {
      lastEmitted.current = value;
      editor.commands.setContent(toEditorHtml(value), { emitUpdate: false });
    }
  }, [value, editor]);

  const buttons = [
    { label: "Bold", icon: Bold, active: "bold", run: () => editor?.chain().focus().toggleBold().run() },
    { label: "Italic", icon: Italic, active: "italic", run: () => editor?.chain().focus().toggleItalic().run() },
    { label: "Underline", icon: Underline, active: "underline", run: () => editor?.chain().focus().toggleUnderline().run() },
    { label: "Bullet list", icon: List, active: "bulletList", run: () => editor?.chain().focus().toggleBulletList().run() },
    { label: "Numbered list", icon: ListOrdered, active: "orderedList", run: () => editor?.chain().focus().toggleOrderedList().run() },
  ];

  return (
    <div
      className={`rounded-2xl border bg-white overflow-hidden transition-colors focus-within:border-primary1 ${
        invalid ? "border-red-300" : "border-gray-200"
      }`}
    >
      <div className="flex items-center gap-1 border-b border-gray-100 bg-gray-50/60 px-2 py-1.5">
        {buttons.map(({ label, icon: Icon, active, run }) => (
          <button
            key={label}
            type="button"
            title={label}
            aria-label={label}
            aria-pressed={editor?.isActive(active) ?? false}
            onMouseDown={(e) => e.preventDefault()}
            onClick={run}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              editor?.isActive(active)
                ? "bg-primary1/15 text-primary1"
                : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
            }`}
          >
            <Icon className="w-4 h-4" />
          </button>
        ))}
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
