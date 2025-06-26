import React from 'react';
import {
  ChakraProvider,
  Box,
  Text,
  Link,
  VStack,
  Code,
  Grid,
  theme,
} from '@chakra-ui/react';
import 'dayjs/locale/en';
import { MantineProvider } from '@mantine/core';
import { DatesProvider } from '@mantine/dates';
import { ColorModeSwitcher } from './ColorModeSwitcher';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { RecoilRoot } from 'recoil';
//import { useUserQuery} from './react-query/global/useUserQuery'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Main from './components/Main';
import SignIn from './components/SignIn';
import { Loading } from './helpers/Loading';
import useLocalStorageState from 'use-local-storage-state';
import { user_localstorage_key } from './utils/constants';

const queryClient = new QueryClient();

const themeMantine = {
  primaryColor: 'teal',
  defaultRadius: 'md',
  fontFamily: 'Montserrat, Verdana, sans-serif',
  fontFamilyMonospace: 'Monaco, Courier, monospace',
  headings: { fontFamily: 'Greycliff CF, sans-serif' },
};

function App() {
  const [localstate, setLocalState] = useLocalStorageState(
    user_localstorage_key,
    { defaultValue: {} }
  );

  return (
    <MantineProvider theme={themeMantine}>
      <DatesProvider
        settings={{
          locale: 'en-SG',
          firstDayOfWeek: 0,
          weekendDays: [0],
          timezone: 'UTC+08:00',
        }}
      >
        <ChakraProvider theme={{ ...theme }}>
          <QueryClientProvider client={queryClient}>
            <BrowserRouter>
              <RecoilRoot>
                <Box textAlign="center" fontSize="xl">
                  {localstate.userid ? <Main /> : <SignIn />}
                </Box>
                <Loading />
                <ToastContainer
                  autoClose={2000}
                  position={'bottom-center'}
                  theme="dark"
                />
                <ReactQueryDevtools />
              </RecoilRoot>
            </BrowserRouter>
          </QueryClientProvider>
        </ChakraProvider>
      </DatesProvider>
    </MantineProvider>
  );
}

export default App;
