import { useS3Upload } from 'next-s3-upload';
import { useRef } from 'react';
import { toggleMessage } from '../components/views/Message/index.component';

export default function useUploadFile() {
  const urlRef = useRef('');
  const urlsRef = useRef<string[]>([]);
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

  const uploadMultipleFiles = async (files: File[], foldername: string | undefined, userId: string) => {
    try {
      const tempArray = [];
      for (let index = 0; index < files.length; index++) {
        const file = files[index];
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
        tempArray.push(`https://lumiere-s3.s3.ap-southeast-1.amazonaws.com/${res.key}`);
      }
      toggleMessage({
        title: 'Upload images S3',
        type: 'success',
        message: 'Upload images successfully',
      });
      urlsRef.current = tempArray;
    } catch (err: any) {
      toggleMessage({
        title: 'Upload images S3',
        type: 'error',
        message: 'Upload images failure',
      });
    }
  };

  return {
    urlRef,
    urlsRef,
    uploadMultipleFiles,
    upload,
  };
}
