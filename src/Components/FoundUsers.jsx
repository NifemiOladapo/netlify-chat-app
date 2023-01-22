import { Avatar, Box, Text } from '@chakra-ui/react'
import React from 'react'

const FoundUsers = ({user, handleClick}) => {
  return (
    <Box onClick={handleClick} cursor='pointer' bg={'#E8E8E8'} _hover={{backgroundColor : "#38B2Ac", color : "white"}} w='100%' display={'flex'} alignItems={"center"} color='black' px={3} py={2} mb={2} borderRadius='lg'>
        <Avatar mr={2} size='sm' cursor={"pointer"} name={user.username} src={user.profilepicture} />
        <Box>
            <Text>{user.username}</Text>
            <Text fontSize='xl'>{user.email}</Text>
        </Box>
    </Box>
  )
}

export default FoundUsers