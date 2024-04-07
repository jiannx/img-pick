import { Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, useDisclosure, Box } from '@chakra-ui/react';

export default function Confirm({
  onOk,
  onCancel,
  context,
  children,
}: {
  onOk?: () => void;
  onCancel?: () => void;
  context: any;
  children?: any;
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Box onClick={onOpen}>{children}</Box>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>提示</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {context}
          </ModalBody>
          <ModalFooter>
            <Button
              onClick={() => {
                onClose();
                onOk?.();
              }}
              mr={4}
            >
              确定
            </Button>
            <Button
              variant='ghost'
              onClick={() => {
                onClose();
                onCancel?.();
              }}
            >
              取消
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}