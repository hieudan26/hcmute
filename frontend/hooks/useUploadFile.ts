import { useS3Upload } from 'next-s3-upload';
import { useRef } from 'react';
import { toggleMessage } from '../components/views/Message/index.component';

export default function useUploadFile() {
  const urlRef = useRef('');
  const { uploadToS3 } = useS3Upload();
  const { S3_URL } = process.env;

  const upload = async (file: File, foldername: string | undefined, userId: string) => {
    try {
      const res = await uploadToS3(file, {
        endpoint: {
          request: {
            body: {
              userId: userId,
              foldername: foldername,
              isPost: foldername === undefined ? true : false,
            },
            headers: {},
          },
        },
      });
      toggleMessage({
        title: 'Upload image S3',
        type: 'success',
        message: 'Upload image successfully',
      });
      urlRef.current = `https://lumiere-s3.s3.ap-southeast-1.amazonaws.com/${res.key}`;
    } catch (err: any) {
      toggleMessage({
        title: 'Upload image S3',
        type: 'error',
        message: 'Upload image failure',
      });
    }
  };

  return {
    urlRef,
    upload,
  };
}
