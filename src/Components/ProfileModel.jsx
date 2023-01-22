import { Button, IconButton, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure, Text, Image } from '@chakra-ui/react'
import { ViewAgenda, ViewCarousel } from '@material-ui/icons'
import React from 'react'

const ProfileModel = ({user, children}) => {
    const {isOpen, onOpen, onClose}=useDisclosure()
  return (
    <>
        {children ? <span onClick={onOpen}>{children}</span> : <IconButton d={{base : 'flex'}} onClick={onOpen} icon={<ViewCarousel />}/>}
        <Modal size={'lg'} isCentered isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent height={'400px'}>
                <ModalHeader fontSize={'40px'} fontFamily='Work sans' display={'flex'} justifyContent={'center'}>{user.username}</ModalHeader>
                <ModalCloseButton />
                <ModalBody display={'flex'} flexDirection={'column'} alignItems={'center'} justifyContent={'space-around'}>
                    <Image src={user.profilePicture} alt={user.username} borderRadius={'full'} boxSize={'150px'}/>
                    <Text fontSize={'lg'}>Email : {user.email}</Text>
                </ModalBody>
                <ModalFooter>
                    <Button colorScheme={'blue'} margin='3px' onClick={onClose}>Close</Button>
                </ModalFooter>
            </ModalContent>
            
        </Modal>
    </>
    
  )
}

export default ProfileModel