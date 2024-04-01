import {
  Box,
  Button,
  Grid,
  Container,
  GridItem,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  chakra,
} from '@chakra-ui/react';
import React, { useCallback } from 'react';
import { useInteractable } from '../../../classes/TownController';
import ShopAreaInteractable from './ShopArea';
import useTownController from '../../../hooks/useTownController';
import { Image } from '@chakra-ui/react';

const StyledShopComponent = chakra(Container, {
  baseStyle: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1rem',
  },
});

const StyledButton = chakra(Box, {
  baseStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    flexBasis: '14%',
    height: '25%',
    border: '1px solid black',
    fontSize: '50px',
  },
});

function ShopArea(): JSX.Element {
  const shopArea = useInteractable('shopArea');
  const townController = useTownController();
  const closeModal = useCallback(() => {
    if (shopArea) {
      townController.interactEnd(shopArea);
    }
  }, [townController, shopArea]);
  return (
    <StyledShopComponent>
      <Grid templateColumns='repeat(2, 1fr)' templateRows='repeat(2, 1fr)' gap={5}>
        <GridItem>
        <StyledButton>
          <Grid templateColumns='repeat(2, 1fr)' gap={0}>
            <GridItem> <Image h='150px' w='100px' src='/assets/cards/SKIN1/aceOfSpades.png' /> </GridItem>
            <GridItem> <Image h='150px' w='100px' src='/assets/cards/SKIN1/backOfCard.png' /> </GridItem>
          </Grid>
          <Button>Test1</Button>
        </StyledButton>
        </GridItem>
        <GridItem>
        <StyledButton>
      <Grid templateColumns='repeat(2, 1fr)' gap={0}>
          <GridItem> <Image h='150px' w='100px' src='/assets/cards/SKIN2/aceOfSpades.png' /> </GridItem>
          <GridItem> <Image h='150px' w='100px' src='/assets/cards/SKIN2/backOfCard.png' /> </GridItem>
        </Grid>
        <Button>Test2</Button>
      </StyledButton>
        </GridItem>
        <GridItem>
        <StyledButton>
          <Grid templateColumns='repeat(2, 1fr)' gap={0}>
            <GridItem> <Image h='150px' w='100px' src='/assets/cards/SKIN3/aceOfSpades.png' /> </GridItem>
            <GridItem> <Image h='150px' w='100px' src='/assets/cards/SKIN3/backOfCard.png' /> </GridItem>
          </Grid>
          <Button>Test3</Button>
        </StyledButton>
        </GridItem>
        <GridItem>
        <StyledButton>
      <Grid templateColumns='repeat(2, 1fr)' gap={0}>
          <GridItem> <Image h='150px' w='100px' src='/assets/cards/SKIN4/aceOfSpades.png' /> </GridItem>
          <GridItem> <Image h='150px' w='100px' src='/assets/cards/SKIN4/backOfCard.png' /> </GridItem>
        </Grid>
        <Button>Test4</Button>
      </StyledButton>
        </GridItem>
        </Grid>
    </StyledShopComponent>
  );
}

export default function ShopAreaWrapper(): JSX.Element {
  const shopArea = useInteractable<ShopAreaInteractable>('shopArea');
  const townController = useTownController();
  const closeModal = useCallback(() => {
    if (shopArea) {
      townController.interactEnd(shopArea);
    }
  }, [townController, shopArea]);
  if (shopArea) {
    return (
      <Modal isOpen={true} onClose={closeModal} closeOnOverlayClick={false} size='xl'>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{shopArea.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <ShopArea />
          </ModalBody>
        </ModalContent>
      </Modal>
    );
  }
  return <></>;
}
function chackra(
  arg0: any,
  arg1: {
    baseStyle: {
      display: string;
      flexDirection: string;
      alignItems: string;
      justifyContent: string;
      padding: string;
    };
  },
) {
  throw new Error('Function not implemented.');
}
