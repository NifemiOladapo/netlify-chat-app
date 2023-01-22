import { Box } from '@chakra-ui/react';
import { ChatState } from '../ChatProvider'
import SingleChat from './SingleChat';


const ChatBox = () => {

  const {selectedChat} =ChatState();

  return (
   <Box display={{base : selectedChat ? "flex" : "none", md : "flex"}} alignItems='center' flexDir={'column'} p={3} bg="white" w={{base : "100%", md : "68%"}} borderRadius='lg' borderWidth={'2px'}>
    <SingleChat />
   </Box>
  )
}

export default ChatBox