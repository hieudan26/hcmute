import { Box, Divider } from '@chakra-ui/react';
import CommentRender from '../CommentRender/index.component';

export interface ITreeCommentRenderProps {
  a: any;
}

export default function TreeCommentRender(props: ITreeCommentRenderProps) {
  const { a } = props;

  return (
    <>
      <Divider orientation='horizontal' />
      <Box py='2' px='2'>
        <CommentRender />
        {a.childrens && a.childrens.map((person: any, index: number) => <TreeCommentRender key={index} a={person} />)}
      </Box>
    </>
  );
}
