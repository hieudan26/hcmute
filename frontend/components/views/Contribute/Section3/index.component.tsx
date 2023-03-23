import { Divider, FormControl, FormHelperText, FormLabel, Text, Textarea } from '@chakra-ui/react';
import dynamic from 'next/dynamic';
import { formatsQuill, modulesQuill } from '../../../../utils';
import { Dispatch, SetStateAction } from 'react';
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false, loading: () => <p>Loading ...</p> });

export interface ISection3Props {
  valueDescription: string;
  handleDescriptionChange: (event: React.ChangeEvent<HTMLTextAreaElement> | undefined) => void;
  valueContent: string;
  setValueContent: Dispatch<SetStateAction<string>>;
}

export default function Section3(props: ISection3Props) {
  const { valueDescription, handleDescriptionChange, valueContent, setValueContent } = props;

  return (
    <>
      <FormControl>
        <FormLabel fontSize='sm'>Mô tả: </FormLabel>
        <Textarea placeholder='Mô tả về địa điểm' size='sm' value={valueDescription} onChange={handleDescriptionChange} />
        <FormHelperText fontSize='xs'>Nhận dạng của khu vực địa điểm tương ứng</FormHelperText>
      </FormControl>
      <Divider my='8' />
      <Text fontSize='sm' ml='2' mb='4'>
        Nội dung:
      </Text>
      <ReactQuill value={valueContent} onChange={setValueContent} modules={modulesQuill} formats={formatsQuill} theme='snow' />
    </>
  );
}
