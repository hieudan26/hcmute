import { ArrowUpIcon } from '@chakra-ui/icons';
import { IconButton, useColorModeValue } from '@chakra-ui/react';
import { gsap } from 'gsap';
import React, { useEffect, useRef } from 'react';

interface IScrollToTopProps {
  spaceRight?: boolean;
}

const ScrollToTop = (props: IScrollToTopProps) => {
  const { spaceRight } = props;
  const [isVisible, setIsVisible] = React.useState(false);
  const scrollButton = useRef<any | undefined>();
  const arrowUpIconColor = useColorModeValue('textColor.primary_lightMode', 'textColor.primary_darkMode');

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isVisible) {
      gsap.to(scrollButton.current, {
        duration: 0.5,
        opacity: 1,
        zIndex: 100,
      });
    } else {
      gsap.to(scrollButton.current, {
        duration: 0.5,
        opacity: 0,
        zIndex: -1,
      });
    }
  }, [isVisible]);

  const handleScroll = () => {
    if (window.scrollY > 100) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const handleClick = () => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
    scrollButton.current.blur();
  };

  return (
    <IconButton
      aria-label='scroll to top'
      icon={<ArrowUpIcon color={arrowUpIconColor} />}
      size='lg'
      colorScheme='purple'
      variant='outline'
      border='2px solid'
      ref={scrollButton}
      onClick={handleClick}
      position='fixed'
      bottom='4rem'
      right={spaceRight ? '1rem' : '4rem'}
      zIndex='-1'
      opacity='0'
    />
  );
};

export default ScrollToTop;
