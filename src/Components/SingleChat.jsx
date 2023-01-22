import { Box, FormControl, IconButton, Input, Spinner, Text, useToast } from '@chakra-ui/react'
import { ArrowBack, ViewAgenda } from '@material-ui/icons'
import ProfileModel from "./ProfileModel"
import { ChatState } from '../ChatProvider'
import UpdateGroupChatModel from './UpdateGroupChatModel'
import { useState } from 'react'
import { useEffect } from 'react'
import io from 'socket.io-client'
import ScrollableChat from './ScrollableChat'

let selectedChatCompare;

const socket =io.connect('http://localhost:3001')


 const SingleChat = () => {

    const [messageText, setMessageText]=useState('')
    const [messages, setMessages]=useState([])
    const [typing, setTyping] = useState(false)
    const [isTyping, setIsTyping] = useState(false)
    const [socketConnected, setSocketConnected]=useState(false)
    const [loading, setLoading] = useState(false)
    const toast=useToast()

    const {user, selectedChat, setSelectedChat, notification, setNotification}=ChatState()



    useEffect(()=>{   
        const fechmessages=async()=>{
            if(!selectedChat)return
            try {
                setLoading(true)
                await fetch(`http://localhost:3001/api/getmessages/${selectedChat._id}`)
                .then(res=> res.json())
                .then(data=> {
                    setLoading(false)
                    setMessages(data)
                    socket.emit("join chat", selectedChat._id)
                })
            } catch (error) {
                console.log(error.message)
                toast({
                    title : error.message,
                    position : 'top',
                    isClosable : true,
                    duration : 5000,
                    status : "error"
                })
            }
        }
        selectedChatCompare=selectedChat;
    },[selectedChat])

    useEffect(()=>{
        socket.emit("setup", user)
        socket.on("connected", ()=>{
            setSocketConnected(true)
        })
        socket.on("typing", ()=>{
            setIsTyping(true)
        })

        socket.on("stop typing", ()=>{
            setIsTyping(false)
        })
    },[user])

    useEffect(()=>{
        socket.on("receive message", (mess)=>{
            if(!selectedChatCompare || selectedChatCompare._id !== mess.chat._id){
                // console.log(mess.chat._id)
                // console.log(selectedChatCompare);

                if(!notification.includes(mess)){
                    notification.push(mess)
                    setNotification([...notification])
                }
                    
            }else{
                messages.push(mess);
                setMessages([...messages])
            }
        })
    },[messages, notification, setNotification])

    const sendmessage= async(event)=>{
        if(event.key === "Enter" && messageText){
            try {
                setMessageText("")
                await fetch("http://localhost:3001/api/sendmessage", {
                    method : "POST",
                    headers : {
                        "Content-type" : "application/json",
                        "Authorization" : `Bearer ${user.token}`
                    },
                    body : JSON.stringify({
                        content : messageText,
                        chatId : selectedChat._id
                    })
                })
                .then(res=> res.json())
                .then(data=> {
                    console.log(data)
                    socket.emit("stop typing", selectedChat._id)
                    socket.emit("send message", data)
                    messages.push(data)
                    setMessages([...messages])
                })
            } catch (error) {
                console.log(error.message)
            }
        }
    }

    const typingHandler=(e)=>{
        setMessageText(e.target.value)
        if(!socketConnected)return;
        if(!typing){
            setTyping(true)
            socket.emit("typing", selectedChat._id)
            return
        }

        socket.emit('stop typing', selectedChat._id)
        setTyping(false)
    }

  return (
    <>
       {
        selectedChat ? (
            <>
            <Text fontSize={{base : "28px", md : "30px"}} pd={3} px={2} w='100%' fontFamily={'Work sans'} display='flex' justifyContent={{base : "space-between"}} alignItems='center'>
                <IconButton display={{base : "flex", md : "none"}} icon={<ArrowBack />} onClick={()=> setSelectedChat(null)}/>
                {selectedChat.isGroupChat ? (selectedChat.chatName) : (selectedChat.users[1]._id === user.id ? selectedChat.users[0].username : selectedChat.users[1].username)}
                {selectedChat.isGroupChat ? (
                    <UpdateGroupChatModel selectedChat={selectedChat} setSelectedChat={setSelectedChat}>
                        <IconButton icon={<ViewAgenda />}/>
                    </UpdateGroupChatModel>
                ) : (
                    <ProfileModel user={selectedChat.users[1]._id === user.id ? selectedChat.users[0] : selectedChat.users[1]}>
                        <IconButton icon={<ViewAgenda />}/>
                    </ProfileModel>
                )}
            </Text>
            <Box display={'flex'} flexDir='column' justifyContent={'flex-end'} p={3} bg='#E8E8E8' w='100%' h="100%" borderRadius={'lg'} overflowY='hidden'>
                {loading ? <Spinner size={'xl'} w={20} h={20} alignSelf='center' margin={'auto'}/> : 
                    <div style={{display : "flex", flexDirection : "column", overflowY : 'scroll', scrollbarWidth : 'none'}}>
                        <ScrollableChat messages={messages} />
                    </div>}
 
                <FormControl onKeyDown={sendmessage} isRequired mt={3}>
                    {isTyping ? <div>typing</div> : <></>}
                    <Input placeholder='Input a message' variant={'filled'} bg={"#E0E0E0"} onChange={typingHandler} value={messageText} />
                </FormControl>
            </Box>
            </>
        ) : (
            <Box display={'flex'} alignItems='center' justifyContent={'center'} h='100%'>
                <Text fontSize={'3xl'} pb={3} fontFamily="Work sans">
                    Click on a user to start chatting
                </Text>
            </Box>
        )
       }
    </>
    )
}

export default SingleChat