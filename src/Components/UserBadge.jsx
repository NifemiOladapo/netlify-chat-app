import { Box } from '@chakra-ui/react'
import React from 'react'

const UserBadge = ({user, handleFunc}) => {
  return (
    <Box color='white' px={2} py={1} display='flex' borderRadius='lg' m={1} mb={2} variant='solid' fontSize={12} backgroundColor='purple' cursor={'pointer'} onClick={handleFunc}>
        {user.username}
    </Box>
    )
}

export default UserBadge