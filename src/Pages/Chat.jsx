import { useEffect, useState} from 'react'
import { ChatState } from '../ChatProvider'
import {Box, useToast} from '@chakra-ui/react'
import SideDrawer from '../Components/SideDrawer';
import ChatBox from '../Components/ChatBox';
import MyChats from '../Components/MyChats';

const Chat = () => {

  const toast=useToast()

  //to get the user state
  const {user, setChats} =ChatState();

  const getChats= async()=>{
    await fetch("http://localhost:3001/api/fetchchats", {
      headers : {"Authorization" : `Bearer ${user.token}`}
    })
    .then(res=> res.json())
    .then(data=> {
      console.log(data)
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
  }

  return (
    <div style={{width : '100%'}}>
     {user ?  <SideDrawer getChats={getChats}/> : null} 
     <Box display='flex' justifyContent='space-between' w='100%' h="91vh" padding={'10px'}>
      {user ? <MyChats getChats={getChats}/> : null} 
      {user ? <ChatBox/> : null}
     </Box>
    </div>
  )
}

export default Chat