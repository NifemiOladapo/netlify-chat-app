import { Box, Button, Stack, Text, useToast } from '@chakra-ui/react';
import { Add } from '@material-ui/icons';
import { useEffect } from 'react';
import { ChatState } from '../ChatProvider';
import ChatLoading from './ChatLoading';
import GroupChatModel from './GroupChatModel';

const MyChats = ({}) => {

  const {user, selectedChat, setSelectedChat, chats, setChats} =ChatState();

  const toast =useToast()

    // const getChats= async()=>{
    //   await fetch("http://localhost:3001/api/fetchchats", {
    //     headers : {"Authorization" : `Bearer ${user.token}`}
    //   })
    //   .then(res=> res.json())
    //   .then(data=> {
    //     setChats(data)
    //   })
    //   .catch(err=>{
    //     toast({
    //       title : err,
    //       position : "top",
    //       isClosable : true,
    //       status : "error",
    //       duration : 5000
    //     })  
    //   })
    // }

  useEffect(()=>{
       fetch("https://chatapp-backend-7gqt.onrender.com/api/fetchchats", {
        headers : {"Authorization" : `Bearer ${user.token}`}
      })
      .then(res=> res.json())
      .then(data=> {
        setChats(data)
      })
      .catch(err=>{
        toast({
          title : err,
          position : "top",
          isClosable : true,
          status : "error",
          duration : 5000
        })  
      })
  },[])

  return(
    <Box display={{base : selectedChat ? "none" : "flex", md : "flex"}} flexDir='column' alignItems={'center'} bg='white' padding={'3px'} w={{base : "100%", md : '31%'}} borderRadius='lg' borderWidth={'1px'}>
      <Box paddingBottom={'3px'} px={3} fontSize={{base : "28px", md : "30px"}} fontFamily="Work sans" display={'flex'} w="100%" justifyContent={"space-between"} alignItems={"center"}>
        My Chats Heloo
        <GroupChatModel>
          <Button display={'flex'} fontSize={{base : "17px", md : "10px", lg : "17px"}} rightIcon={<Add />}>New Group Chat</Button>
        </GroupChatModel>
      </Box>
      <Box display={'flex'} flexDirection={"column"} p={3} bg='#F8F8F8' w={'100%'} h={"100%"} borderRadius='lg' overflowY={'hidden'}>
        {
        chats ? (
          <Stack overflowY={'scroll'}>
            {chats.map(chat=>{
                  //this will check if the chat is a groupchat or one on one chat if groupchat dispaly group name else display the name of the user you are chatting with
              return <Box onClick={()=> setSelectedChat(chat)} cursor='pointer' color={selectedChat === chat ? 'white' : "black"} bg={selectedChat === chat ? '#38B2AC' : "#E8E8E8"} px={3} py={2} borderRadius='lg' key={chat._id}>
                <Text>
                  {
                    chat.isGroupChat === false ? (
                      chat.users[0]._id === user.id ? (chat.users[1].username) : (chat.users[0].username)
                    )
                    : 
                    (chat.chatName)
                  }
                </Text>
              </Box>
            })}
          </Stack>
        ) : <ChatLoading /> }
      </Box>
    </Box>
  )
}

export default MyChats