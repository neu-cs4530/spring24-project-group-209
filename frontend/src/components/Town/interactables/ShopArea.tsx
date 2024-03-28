import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Flex,
  Heading,
  List,
  ListItem,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';
import React, { useCallback, useEffect, useState } from 'react';
import TownController, { useInteractable, useInteractableAreaController } from '../../../classes/TownController';
import { InteractableID } from '../../../types/CoveyTownSocket';
import ShopAreaInteractable from './ShopArea';
import useTownController from '../../../hooks/useTownController';
import ShopAreaController from '../../../classes/interactable/ShopAreaController';

function ShopArea({ controller }: { controller: ShopAreaController }): JSX.Element {
  return <></>;
}

export default function ShopAreaWrapper(): JSX.Element {
  const shopArea = useInteractable<ShopAreaInteractable>('shopArea');
  const townController = useTownController();
    const closeModal = useCallback(() => {
    if (shopArea) {
      townController.interactEnd(shopArea);
    }
  }, [townController, shopArea]);
  if (shopArea && shopArea.getData('type') === 'ShopArea') {
    return (
      <Modal isOpen={true} onClose={closeModal} closeOnOverlayClick={false} size='xl'>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{shopArea.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <ShopArea controller={townController.getShopController(shopArea)} />
          </ModalBody>
        </ModalContent>
      </Modal>
    );
  }
  return <></>;
}


