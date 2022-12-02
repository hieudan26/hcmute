import { Box, Flex, Stack, Text } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { IRoute, ISection } from '../../../../../types/navigation';
import Brand from '../Brand/index.component';
import Links from '../Links/index.component';

interface SidebarContentProps {
  routes: IRoute[];
}

function SidebarContent(props: SidebarContentProps) {
  const { routes } = props;
  const [section, setSection] = useState<ISection[]>([]);

  useEffect(() => {
    const sectionNames: string[] = [];
    routes.forEach((item) => {
      sectionNames.push(item.section);
    });
    let result: ISection[] = [];
    const uniqueSectionNames = [...new Set(sectionNames)];
    uniqueSectionNames.forEach((sectionName) => {
      let sectionTemp: ISection = { section: sectionName, routes: [] };
      routes.forEach((route) => {
        if (sectionName === route.section) {
          sectionTemp.routes.push(route);
        }
      });
      result.push(sectionTemp);
      setSection(result);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Flex direction='column' height='100%' pt='25px' borderRadius='30px' overflow='auto'>
      <Brand />
      {section &&
        section.length &&
        section.map((item, index) => (
          <Stack key={index} direction='column' mt='8px' mb='4'>
            <Box ps='20px' pe={{ lg: '16px', '2xl': '16px' }}>
              <Text fontWeight='bold' color='gray.400' fontSize='xs' as='i'>
                {item.section}
              </Text>
              <Stack spacing='4' mt='4' align='stretch'>
                <Links routes={item.routes} />
              </Stack>
            </Box>
          </Stack>
        ))}
    </Flex>
  );
}

export default SidebarContent;
