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
            <Button rounded='none' size='xs' onClick={() => editor.chain().focus().toggleBold().run()}>
              B
            </Button>
            <Button rounded='none' size='xs' onClick={() => editor.chain().focus().toggleItalic().run()}>
              I
            </Button>
            <Button rounded='none' size='xs' onClick={() => editor.chain().focus().toggleUnderline().run()}>
              U
            </Button>
            <Button rounded='none' size='xs' onClick={() => editor.chain().focus().toggleBulletList().run()}>
              Bullet List
            </Button>
            <Button rounded='none' size='xs' onClick={() => editor.chain().focus().toggleOrderedList().run()}>
              Ordered List
            </Button>
            <Button
              rounded='none'
              size='xs'
              onClick={() => editor.chain().focus().splitListItem('listItem').run()}
              disabled={!editor.can().splitListItem('listItem')}
            >
              Split List
            </Button>
            <Button
              rounded='none'
              size='xs'
              onClick={() => editor.chain().focus().sinkListItem('listItem').run()}
              disabled={!editor.can().sinkListItem('listItem')}
            >
              Sink List
            </Button>
            <Button
              rounded='none'
              size='xs'
              onClick={() => editor.chain().focus().liftListItem('listItem').run()}
              disabled={!editor.can().liftListItem('listItem')}
            >
              Lift List
            </Button>
          </SimpleGrid>
        </BubbleMenu>
      )}
      <EditorContent editor={editor} />
    </>
  );
}
