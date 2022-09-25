import { extendTheme } from "@chakra-ui/react";
import { Button } from "./button.chakra";

export const theme = extendTheme({
  fonts: {
    headlineFont: "MontserratAlternates",
    subheadFont: "MontserratAlternates",
    textFont: "MontserratAlternates Regular",
    titleFont: "MontserratAlternates SemiBold",
    fontBold: "MontserratAlternates Bold",
    extraBold: 'MontserratAlternates ExtraBold',
  },
  colors: {
    backgroundButton: {
      primary: '#D0637C',
      secondary: '#F5DDe0'
    },
    header: {
      primary_lightMode: '#ffffffcc',
      primary_darkMode: '#000000cc'
    },
    backgroundPage: {
      primary_lightMode: '#F9F9F9',
      primary_darkMode: '#121212',
    },
    backgroundBox: {
      primary_lightMode: '#ffffff',
      primary_darkMode: '#303030'
    },
    textColor: {
      primary_lightMode: '#303030',
      secondary_lightMode: '#0000008a',
      primary_darkMode: '#f6f6f6',
      secondary_darkMode: '#ffffffb3',
      highlight: '#D53F8C',
      black: '#303030',
      white: '#f6f6f6',
      logo: '#D0637C',
    }
  },
  styles: {
    global: () => ({
      body: {
        bg: "#F9F9F9",
      },
    }),
  },
  components: {
    Button,
  },
});