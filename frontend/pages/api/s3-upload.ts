import { NextApiRequest } from 'next';
import { APIRoute } from 'next-s3-upload';
import { v4 as uuidv4 } from 'uuid';

export default APIRoute.configure({
  key(req: NextApiRequest, filename: string) {
    const { foldername, userId, isPost } = req.body;
    // is needed handle name ??
    const filenames = filename.split('.');
    // filename = filenames[0].concat(uuidv4().toString()).concat('.', filenames[1]);
    filename = uuidv4().toString().concat('.', filenames[1]);
    if (!isPost) {
      return `lumiere/${userId}/${foldername}/${filename.replace(/\s/g, '-')}`;
    } else {
      return `lumiere/${userId}/post/${filename.replace(/\s/g, '-')}`;
    }
  },
});
