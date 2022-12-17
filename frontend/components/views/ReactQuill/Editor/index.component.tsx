import React from 'react';
import dynamic from 'next/dynamic';
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false, loading: () => <p>Loading ...</p> });
import EditorToolbar, { modules, formats } from '../EditorToolbar/index.component';
import 'react-quill/dist/quill.snow.css';

export const Editor = () => {
  const [state, setState] = React.useState({ value: undefined });
  const handleChange = (value: any) => {
    setState({ value });
  };
  return (
    <div className='text-editor'>
      {/* <EditorToolbar /> */}
      <ReactQuill
        theme='snow'
        // value={state.value}
        // onChange={handleChange}
        placeholder={'Write something awesome...'}
        modules={modules}
        formats={formats}
      />
    </div>
  );
};

export default Editor;
