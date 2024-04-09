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
  Text,
  useToast,
  Tooltip,
} from '@chakra-ui/react';
import React, { useCallback, useEffect, useState } from 'react';
import { useInteractable } from '../../../classes/TownController';
import ShopAreaInteractable from './ShopArea';
import useTownController from '../../../hooks/useTownController';
import { Image } from '@chakra-ui/react';
import * as firebaseUtils from '../../../firebaseUtils';

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
  // const shopArea = useInteractable('shopArea');
  const toast = useToast();
  const townController = useTownController();
  const username = townController.ourPlayer.userName;
  const [balance, setBalance] = useState(0);
  const [inventory, setInventory] = useState<string[]>([]);

  useEffect(() => {
    async function fetchData() {
      const fetchedBalance = await firebaseUtils.getCurrency(username);
      const fetchedInventory = await firebaseUtils.getInventory(username);
      setBalance(fetchedBalance);
      setInventory(fetchedInventory);
    }
    fetchData();
  }, [username]);

  const handlePurchase = async (item: string, cost: number) => {
    if (cost > balance) {
      toast({
        title: 'Insufficient funds',
        description: 'You do not have enough money to purchase this item',
        status: 'error',
      });
      return;
    }
    await firebaseUtils.updateCurrencyIncrement(username, -cost);
    await firebaseUtils.updateInventory(username, item);
    const newBalance = balance - cost;
    const newInventory = inventory.includes(item) ? inventory : [...inventory, item];
    setBalance(newBalance);
    setInventory(newInventory);
    toast({
      title: 'Purchase successful',
      description: `${item} has been equipped`,
      status: 'success',
    });
  };
  if (inventory.length === 0) {
    return <Text fontSize='xl'>Loading...</Text>;
  } else {
    return (
      <StyledShopComponent>
        <Text fontSize='lg'>Balance: ${balance}</Text>
        <Tooltip
          label='Skins that are owned can be equipped here or new skins can be purchased!'
          aria-label='A tooltip'>
          Help
        </Tooltip>
        <Grid templateColumns='repeat(2, 1fr)' templateRows='repeat(2, 1fr)' gap={5}>
          {[1, 2, 3, 4].map(skin => (
            <GridItem key={`skin${skin}`}>
              <StyledButton>
                <Grid templateColumns='repeat(2, 1fr)' gap={0}>
                  <GridItem>
                    <Image h='150px' w='100px' src={`/assets/cards/SKIN${skin}/aceOfSpades.png`} />
                  </GridItem>
                  <GridItem>
                    <Image h='150px' w='100px' src={`/assets/cards/SKIN${skin}/backOfCard.png`} />
                  </GridItem>
                </Grid>
                <Button
                  onClick={() => {
                    handlePurchase(
                      `SKIN${skin}`,
                      inventory.includes(`SKIN${skin}`) ? 0 : 1000 * skin,
                    );
                  }}>
                  {!inventory.includes(`SKIN${skin}`) ? 'Buy' : 'Equip'}
                </Button>
                {!inventory.includes(`SKIN${skin}`) && (
                  <Text fontSize='md'>Cost: ${1000 * skin}</Text>
                )}
              </StyledButton>
            </GridItem>
          ))}
        </Grid>
      </StyledShopComponent>
    );
  }
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
// function chackra(
//   arg0: any,
//   arg1: {
//     baseStyle: {
//       display: string;
//       flexDirection: string;
//       alignItems: string;
//       justifyContent: string;
//       padding: string;
//     };
//   },
// ) {
//   throw new Error('Function not implemented.');
// }
