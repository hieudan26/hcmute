import { Sticky, StickyBoundary, StickyViewport } from '@anubra266/stickyreact';
import { Box, Stack } from '@chakra-ui/react';
import { v4 as uuidv4 } from 'uuid';
import { ISearchResponse } from '../../../../../models/search/search.model';
import Result from '../Result/index.component';

interface ISearchResultProps {
  results: ISearchResponse[];
  close: () => void;
  activeSectionIndex: number;
  category: 'faq' | 'experience' | 'user' | 'place' | 'hashtag';
}

interface ICategoryProps {
  results: ISearchResponse[];
  category: 'faq' | 'experience' | 'user' | 'place' | 'hashtag';
  close: () => void;
  activeSectionIndex: number;
}

const Category = (props: ICategoryProps) => {
  const { results, close, category, activeSectionIndex } = props;

  return (
    <>
      <Sticky
        as={Box}
        fontWeight='bold'
        textTransform='capitalize'
        color='choc.bg'
        bg='white'
        _dark={{
          color: 'gray.400',
          bg: 'blackAlpha.100',
        }}
        py={1}
      >
        {category}
      </Sticky>
      <Stack spacing={3} mt={3}>
        {results.map((item, index) => (
          <Result
            key={`${index}-${uuidv4()}`}
            category={category}
            // active={activeSectionIndex === sectionIndex}
            active={false}
            section={item.name}
            component={item.content ? item.content : ''}
            url={item.id}
            onClick={close}
          />
        ))}
      </Stack>
    </>
  );
};
function SearchResults(props: ISearchResultProps) {
  const { results, close, activeSectionIndex, category } = props;
  return (
    <StickyViewport as={Stack} mt={7} dir='row' maxH='md' overflowY='auto'>
      {/* {
        ALL_TYPE_SEARCH.map((item, index) => (
          <StickyBoundary as={Stack} key={`category-result-${item.label}`}>
            <Category results={results} category={category} close={close} activeSectionIndex={activeSectionIndex} />
          </StickyBoundary>
        ))
      } */}
      <StickyBoundary as={Stack}>
        <Category results={results} category={category} close={close} activeSectionIndex={activeSectionIndex} />
      </StickyBoundary>
    </StickyViewport>
  );
}

export default SearchResults;
