import { Box, Button, FormControl, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spinner, useDisclosure, useToast } from '@chakra-ui/react'
import React, { useState } from 'react'
import { ChatState } from '../ChatProvider';
import FoundUsers from './FoundUsers';
import UserBadge from './UserBadge';

const UpdateGroupChatModel = ({children}) => {

    const {isOpen, onOpen, onClose}=useDisclosure();
    const [groupName, setGroupName]=useState('')
    const [search, setSearch]=useState('')
    const [searchResults, setSearchResults]=useState([])
    const [loading, setloading]=useState(false)
    const [renameLoading, setRenameLoading]=useState(false)

  const {user, setChats, selectedChat, setSelectedChat} =ChatState();

  const toast =useToast()

    const handleSearch = async(query)=>{
        setSearch(query)

        setloading(true)

        await fetch(`https://chatapp-backend-7gqt.onrender.com/api/searchusers?search=${search}`, {
            headers : {
                "Authorization" : `Bearer ${user.token}`,
            }
        })
        .then(res=> res.json())
        .then(data=>{ 
            setSearchResults(data)
            setloading(false)
        })
        .catch(err=> console.log(err.message))
    }

    //alows a person to leave a group 
    const leaveGroup= async ()=>{

        try {
            await fetch("https://chatapp-backend-7gqt.onrender.com/api/removefromgroup", {
                headers : {
                    "Content-Type" : "application/json"
                },
                method : 'PUT',
                body : JSON.stringify({
                    chatId : selectedChat._id,
                    userId : user.id
                })
            })
            .then(res=> res.json())
            .then(async(data)=>{
                onClose()
                await fetch("https://chatapp-backend-7gqt.onrender.com/api/fetchchats", {
                    headers : {"Authorization" : `Bearer ${user.token}`}
                  })
                  .then(res=> res.json())
                  .then(data=> {
                    setChats(data)
                  })
                setSelectedChat(null)
            })
        } catch (error) {
            toast({
                title : error.message,
                status : "error",
                isClosable : true,
                duration : 3000,
                position : 'top'
            })
        }
    }

    //allows a person to add users he wants to add to a group
    const addUsers = async(user1)=>{

        const find=selectedChat.users.find(u=> u._id === user1._id)

        if(find){
            toast({
                title : "user already exists in this group",
                status : "warning",
                isClosable : true,
                duration : 3000,
                position : 'top'
            })

            return
        }

        if(selectedChat.groupAdmin._id !== user.id){
            toast({
                title : "Only admins can add users to a group",
                status : "warning",
                isClosable : true,
                duration : 3000,
                position : 'top'
            })

            return
        }

        try {
            await fetch("https://chatapp-backend-7gqt.onrender.com/api/addtogroup", {
                headers : {"Content-Type" : "application/json"},
                method : "PUT",
                body : JSON.stringify({
                    chatId : selectedChat._id,
                    userId : user1._id
                })
            })
            .then(res=> res.json())
            .then(async(data)=>{
                setSelectedChat(data)
                await fetch("https://chatapp-backend-7gqt.onrender.com/api/fetchchats", {
                    headers : {"Authorization" : `Bearer ${user.token}`}
                  })
                  .then(res=> res.json())
                  .then(data=> {
                    setChats(data)
                  })
            })

        } catch (error) {
            console.log(error.message)
        }
    }

    //allows only the group admin to remove a users from a group
    const deleteUsers= async (userToDel)=>{
        if(user.id !== selectedChat.groupAdmin._id){
            toast({
                title : "Only group admin can remove a user from a group",
                status : "warning",
                isClosable : true,
                duration : 3000,
                position : 'top'
            })

            return
        }

        if(user.id === userToDel._id){
            toast({
                title : "You cant delete youself. You are the groupAdmin. Instead leave the group",
                status : "warning",
                isClosable : true,
                duration : 3000,
                position : 'top'
            })

            return
        }

        try {
            await fetch("https://chatapp-backend-7gqt.onrender.com/api/removefromgroup", {
                headers : {"Content-Type" : "application/json"},
                method : "PUT",
                body : JSON.stringify({
                    userId : userToDel._id,
                    chatId : selectedChat._id
                })
            })
            .then(res=> res.json())
            .then(data=> {
                console.log(data)
                setSelectedChat(data)
            })
        } catch (error) {
            console.log(error.message)
        }
    }

    //this is the function that would call the api for updating a chats name
    const handleRename= async ()=>{
        if(groupName === ''){
            toast({
                title : "Please input a new group name",
                status : "warning",
                isClosable : true,
                position : 'top',
                duration : 5000
            })

            return
        }

        if(selectedChat.groupAdmin._id !== user.id){
            toast({
                title : "Only admins can rename a group",
                status : "warning",
                isClosable : true,
                position : 'top',
                duration : 5000
            })

            return
        }

        try{
            setRenameLoading(true)
            await fetch("https://chatapp-backend-7gqt.onrender.com/api/renamegroup", {
                method : "PUT",
                headers : {
                    "Content-Type" : "application/json",
                    "Authorization" : `Bearer ${user.token}`
                },
                body : JSON.stringify({
                    newChatName : groupName,
                    chatId : selectedChat._id
                })
            })
            .then(res=> res.json())
            .then(async(data)=>{ 
                console.log(data)
                await fetch("https://chatapp-backend-7gqt.onrender.com/api/fetchchats", {
                    headers : {"Authorization" : `Bearer ${user.token}`}
                  })
                  .then(res=> res.json())
                  .then(data=> {
                    setChats(data)
                  })
                onClose()
                setRenameLoading(false)
                setGroupName("")
                setSelectedChat(data)

            })
        }catch(err){
            console.log(err.message)
        }
    }

  return (
    <>
        <span onClick={onOpen}>{children}</span>
        <Modal size='full' isCentered isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent height={'400px'}>
                <ModalHeader fontSize={'35'} fontFamily='Work sans' display={'flex'} justifyContent={'center'}>{selectedChat.chatName}</ModalHeader>
                <ModalCloseButton />
                <ModalBody display={'flex'} flexDirection={'column'} alignItems={'center'}>
                    <Box w='100%' flexWrap={'wrap'} pd={3} display={'flex'}>
                        {selectedChat.users.map(user=>{
                           return <UserBadge key={user._id} handleFunc={()=>deleteUsers(user)} user={user}/>
                        })}
                    </Box>
                     <FormControl display={'flex'}>
                        <Input placeholder='New Chat name' marginBottom={'3px'} value={groupName} onChange={e=> setGroupName(e.target.value)}/>
                        <Button variant={'solid'} colorScheme='teal' ml={1} isLoading={renameLoading} onClick={()=> handleRename()}>
                            Update
                        </Button>
                    </FormControl>
                    <FormControl>
                        <Input placeholder='add a user to group' mb={1} onChange={e=> handleSearch(e.target.value)}/>
                    </FormControl>
                        {loading ? <Spinner /> : (
                            searchResults.slice(0, 4).map(user=>{
                                return <FoundUsers handleClick={()=>addUsers(user)} user={user} key={user._id}/>
                            })
                        )}
                </ModalBody>
                <ModalFooter>
                    <Button onClick={()=> leaveGroup()} colorScheme={'red'} margin='3px'>Leave Group</Button>
                </ModalFooter>
            </ModalContent>
            
        </Modal>
    </>
  )
}

export default UpdateGroupChatModel