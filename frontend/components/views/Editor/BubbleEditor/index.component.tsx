import { Button, SimpleGrid } from '@chakra-ui/react';
import { BubbleMenu, Editor, EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import BulletList from '@tiptap/extension-bullet-list';
import Document from '@tiptap/extension-document';
import ListItem from '@tiptap/extension-list-item';
import OrderedList from '@tiptap/extension-ordered-list';
import Paragraph from '@tiptap/extension-paragraph';
import Text from '@tiptap/extension-text';
import Underline from '@tiptap/extension-underline';

export interface IBubbleEditorProps {
  editor: Editor | null;
}

export default function BubbleEditor(props: IBubbleEditorProps) {
  const { editor } = props;

  return (
    <>
      {editor && (
        <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }}>
          <SimpleGrid columns={4} spacing='0.5'>
            <Button fontWeight='semibold' rounded='none' size='xs' onClick={() => editor.chain().focus().toggleBold().run()}>
              B
            </Button>
            <Button fontStyle='italic' rounded='none' size='xs' onClick={() => editor.chain().focus().toggleItalic().run()}>
              I
            </Button>
            <Button
              textDecoration='underline'
              rounded='none'
              size='xs'
              onClick={() => editor.chain().focus().toggleUnderline().run()}
            >
              U
            </Button>
          </SimpleGrid>
        </BubbleMenu>
      )}
      <EditorContent editor={editor} />
    </>
  );
}
