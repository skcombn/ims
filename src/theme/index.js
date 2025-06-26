import { extendTheme, withDefaultColorScheme, withDefaultVariant } from "@chakra-ui/react";

// const config = {
//   initialColorMode: "light",
//   useSystemColorMode: false,
// };

//export const theme = extendTheme({ config });

export const theme = extendTheme({
  styles: {
    global: {
      body: {
        color: 'olive.800',
        backgroundColor: 'olive.100',
        lightbackgroundColor: 'olive.50',
      },
    },
  },
  fonts: {
    body: 'Lato, sans-serif',
    heading: 'Forum, sans-serif',
    mono: 'Menlo, monospace',
  },
  colors: {
    olive: {
      50: '#e2f9f9',
      100: '#c8e5e7',
      200: '#a9d2d3',
      300: '#8ac0c2',
      400: '#6aaeb0',
      500: '#529497',
      600: '#3d7375',
      700: '#2a5254',
      800: '#143233',
      900: '#001215',
    },
  },
  // withDefaultColorScheme({ colorScheme: "olive", components: ['Checkbox'] }),
  // withDefaultVariant({ variant: "filled", components:['Input', 'Select']})
});
