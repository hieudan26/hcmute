import { Box, Button, Flex, Icon, IconButton, Text, useDisclosure } from '@chakra-ui/react';
import { useState } from 'react';
import { BsDashSquareDotted } from 'react-icons/bs';
import { HiTrash } from 'react-icons/hi';
import { IoMdMenu } from 'react-icons/io';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import ModalDetailChooseBox from '../Modals/ModalDetailChooseBox/index.component';
import ModalDeleteChooseBox from '../Modals/ModalDeleteChooseBox/index.component';

export interface IChooseBoxProps {}

type Item = {
  id: string;
  label: string;
  index: number;
};

export default function ChooseBox(props: IChooseBoxProps) {
  const { isOpen: isOpenDetail, onOpen: onOpenDetail, onClose: onCloseDetail } = useDisclosure();
  const { isOpen: isOpenDelete, onOpen: onOpenDelete, onClose: onCloseDelete } = useDisclosure();

  const [items, setItems] = useState<Item[]>([
    { id: 'item-1', label: 'Núi Sam - Miếu Bà Chúa Xứ', index: 1 },
    { id: 'item-2', label: 'Chợ Châu Đốc', index: 2 },
    { id: 'item-3', label: 'LĂNG THOẠI NGỌC HẬU', index: 3 },
    { id: 'item-4', label: 'Khu Sinh Thái Ecolodge Mù Cang Chải (Mu Cang Chai Ecolodge)', index: 4 },
    { id: 'item-5', label: 'Suối Giàng', index: 5 },
    { id: 'item-6', label: 'Thánh Thất Cao Đài (Gaotai Temple In Tay Ninh)', index: 6 },
    { id: 'item-7', label: 'Thánh Thất Cao Đài (Gaotai Temple In Tay Ninh)', index: 7 },
    { id: 'item-8', label: 'Thánh Thất Cao Đài (Gaotai Temple In Tay Ninh)', index: 8 },
    { id: 'item-9', label: 'Thánh Thất Cao Đài (Gaotai Temple In Tay Ninh)', index: 9 },
    { id: 'item-10', label: 'Thánh Thất Cao Đài (Gaotai Temple In Tay Ninh)', index: 10 },
  ]);

  const handleDragEnd = (result: DropResult) => {
    console.log('Result:', result);

    if (!result.destination) {
      return;
    }

    const newItems = Array.from(items);
    const [reorderedItem] = newItems.splice(result.source.index, 1);
    newItems.splice(result.destination.index, 0, reorderedItem);

    setItems(newItems);

    // Lưu vị trí mới vào LocalStorage
    localStorage.setItem('items', JSON.stringify(newItems));
  };

  return (
    <>
      <ModalDetailChooseBox isOpen={isOpenDetail} onClose={onCloseDetail} onOpen={onOpenDetail} />
      <ModalDeleteChooseBox isOpen={isOpenDelete} onClose={onCloseDelete} onOpen={onOpenDelete} />
      <Flex rounded='md' shadow='md' mx='3' my='2' direction='column' p='3' h='84vh' bg='white'>
        <Box fontSize='sm' borderBottom='1px' borderBottomColor='gray.400' h='20'>
          <Text>Ngày 1: </Text>
        </Box>
        <Box overflow='auto'>
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId='items'>
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  {items.map((item, index) => (
                    <Draggable key={item.id} draggableId={item.id} index={index}>
                      {(provided) => (
                        <div {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef}>
                          <Box mt='8' mx='2'>
                            <Flex align='center' justify='space-between'>
                              <Flex gap='4' align='center'>
                                <Icon as={BsDashSquareDotted} />
                                <Button w='fit-content' size='sm'>
                                  {item.index}
                                </Button>
                                <Text>{item.label}</Text>
                              </Flex>
                              <Flex gap='4' align='center'>
                                <Icon
                                  _hover={{ color: '#D0637C' }}
                                  fontSize='md'
                                  as={IoMdMenu}
                                  cursor='pointer'
                                  onClick={onOpenDetail}
                                />
                                <Icon
                                  _hover={{ color: '#D0637C' }}
                                  fontSize='md'
                                  as={HiTrash}
                                  cursor='pointer'
                                  onClick={onOpenDelete}
                                />
                              </Flex>
                            </Flex>
                          </Box>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </Box>
      </Flex>
    </>
  );
}
