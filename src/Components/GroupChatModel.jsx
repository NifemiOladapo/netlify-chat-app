import { Box, Button, FormControl, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spinner, useDisclosure, useToast } from '@chakra-ui/react'
import React, { useState } from 'react'
import { ChatState } from '../ChatProvider';
import FoundUsers from './FoundUsers';
import UserBadge from './UserBadge';

const GroupChatModel = ({children}) => {
    const {isOpen, onOpen, onClose}=useDisclosure();
    const [groupName, setGroupName]=useState('')
    const [selectedUsers, setSelectedUsers]=useState([])
    const [search, setSearch]=useState('')
    const [searchResults, setSearchResults]=useState([])
    const [loading, setloading]=useState(false)

  const {user, chats, setChats} =ChatState();

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
            console.log(data)
            setSearchResults(data)
            setloading(false)
        })
        .catch(err=> console.log(err.message))
    }

    //alows a person to create a group chat
    const handleSubmit= async ()=>{

        if(!groupName || !selectedUsers){
            toast({
                title : "please fill all the fields",
                status : "warning",
                isClosable : true,
                duration : 3000,
                position : 'top'
            }) 
        }
        try {
            await fetch("https://chatapp-backend-7gqt.onrender.com/api/creategroup", {
                headers : {
                    "Authorization" : `Bearer ${user.token}`,
                    "Content-Type" : "application/json"
                },
                method : 'POST',
                body : JSON.stringify({
                    chatName : groupName,
                    users : JSON.stringify(selectedUsers.map(user=> user._id))
                })
            })
            .then(res=> res.json())
            .then(data=>{
                chats.push(data)
                setChats([...chats])
                onClose()
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

    //allows a person to add users he wnts to create a group with
    const addUsers =(user)=>{
        if(selectedUsers.includes(user)){
            toast({
                title : "user already added",
                status : "warning",
                isClosable : true,
                duration : 3000,
                position : 'top'
            })

            return
        }
        selectedUsers.push(user)
        setSelectedUsers([...selectedUsers])
    }

    //allows a person to remove from users he wants to create a group with
    const deleteUsers=(userToDel)=>{
        setSelectedUsers(selectedUsers.filter(user=> userToDel._id !== user._id))
    }

  return (
    <>
        <span onClick={onOpen}>{children}</span>
        <Modal size='full' isCentered isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent height={'400px'}>
                <ModalHeader fontSize={'35'} fontFamily='Work sans' display={'flex'} justifyContent={'center'}>Create Group Chat</ModalHeader>
                <ModalCloseButton />
                <ModalBody display={'flex'} flexDirection={'column'} alignItems={'center'}>
                    <FormControl>
                        <Input placeholder='Chat name' marginBottom={'3px'} onChange={e=> setGroupName(e.target.value)}/>
                        <Input placeholder='Add Users. e.g John, Mary, Joseph' marginBottom={'1px'} onChange={(e)=> handleSearch(e.target.value)}/>
                    </FormControl>
                    <Box display={'flex'}>
                        {selectedUsers.map(user=>{
                            return <UserBadge key={user._id} handleFunc={()=>deleteUsers(user)} user={user}/>
                        })}
                    </Box>
                        {loading ? <Spinner /> : (
                            searchResults.slice(0, 4).map(user=>{
                                return <FoundUsers handleClick={()=>addUsers(user)} user={user} key={user._id}/>
                            })
                        )}        
                </ModalBody>
                <ModalFooter>
                    <Button colorScheme={'blue'} margin='3px' onClick={()=>handleSubmit()}>Create</Button>
                </ModalFooter>
            </ModalContent>
            
        </Modal>
    </>
  )
}

export default GroupChatModel