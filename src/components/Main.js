import { Grid, GridItem } from '@chakra-ui/react';
import NavBar from './NavBar';
import RoutesMain from './RoutesMain';

const Main = () => {
  return (
    <Grid flexDirection="rows">
      <GridItem>
        <NavBar />
      </GridItem>
      <GridItem>
        <RoutesMain />
      </GridItem>
    </Grid>
  );
};

export default Main;
