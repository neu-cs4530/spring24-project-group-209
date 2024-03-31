import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';
import React, { useCallback } from 'react';
import { useInteractable } from '../../../classes/TownController';
import ShopAreaInteractable from './ShopArea';
import useTownController from '../../../hooks/useTownController';

function ShopArea(): JSX.Element {
  const shopArea = useInteractable('shopArea');
  const townController = useTownController();
  const closeModal = useCallback(() => {
    if (shopArea) {
      townController.interactEnd(shopArea);
    }
  }, [townController, shopArea]);
  return (
    <Modal>
      <Button onClick={closeModal}>Cancel</Button>
    </Modal>
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
