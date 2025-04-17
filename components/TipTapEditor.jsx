'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import { useEffect } from 'react'

export default function TiptapEditor({ value, onChange }) {
  const editor = useEditor({
    extensions: [StarterKit, Underline],
    content: value,
    onUpdate({ editor }) {
      onChange(editor.getHTML())
    },
  })

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value)
    }
  }, [value, editor])

  if (!editor) return null

  return (
    <div className="border rounded p-4 space-y-2">
      <div className="flex flex-wrap gap-2 mb-2">
        <button onClick={() => editor.chain().focus().toggleBold().run()} className="btn">Bold</button>
        <button onClick={() => editor.chain().focus().toggleItalic().run()} className="btn">Italic</button>
        {/* <button onClick={() => editor.chain().focus().toggleUnderline().run()} className="btn">Underline</button> */}
        <button onClick={() => editor.chain().focus().toggleBulletList().run()} className="btn">• List</button>
        <button onClick={() => editor.chain().focus().setParagraph().run()} className="btn">P</button>
        <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className="btn">H2</button>
        <button onClick={() => editor.chain().focus().setHardBreak().run()} className="btn">Break</button>
        <button onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()} className="btn text-red-600">Clear</button>
      </div>

      <div className="min-h-[200px] border rounded p-2">
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}
