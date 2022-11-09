import { Box, Divider } from '@chakra-ui/react';
import { ICommentsPostResponse } from '../../../../../models/comment/comment.model';
import CommentRender from '../CommentRender/index.component';

export interface ITreeCommentRenderProps {
  commentsPost: ICommentsPostResponse;
  currentUserId: string;
}

export default function TreeCommentRender(props: ITreeCommentRenderProps) {
  const { commentsPost, currentUserId } = props;

  return (
    <>
      <Box py={commentsPost.parentId === null ? '3' : '1'} px={commentsPost.parentId === null ? '1' : '5'}>
        <CommentRender comment={commentsPost} currentUserId={currentUserId} />

        {commentsPost.childs &&
          commentsPost.childs.map((item: ICommentsPostResponse, index: number) => (
            <TreeCommentRender key={`${index}-${item.id}`} commentsPost={item} currentUserId={currentUserId} />
          ))}
      </Box>
    </>
  );
}
