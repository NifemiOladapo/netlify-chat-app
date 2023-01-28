import { Box, Button, Tooltip, Text, Menu, MenuButton, StatDownArrow, Avatar, MenuList, MenuItem, MenuDivider, Drawer, useDisclosure, DrawerOverlay, DrawerHeader, DrawerContent, DrawerBody, Input, useToast, Spinner } from '@chakra-ui/react'
import {Search, Notifications} from '@material-ui/icons'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { ChatState } from '../ChatProvider';
import ChatLoading from './ChatLoading';
import FoundUsers from './FoundUsers';
import ProfileModel from './ProfileModel';
import {Effect} from 'react-notification-badge'
import NotificationBadge from 'react-notification-badge/lib/components/NotificationBadge';

const SideDrawer = ({getChats}) => {

  const {isOpen, onOpen, onClose}=useDisclosure()

  //to get the user state
  const {user, setSelectedChat, chats, setChats, notification, setNotification} =ChatState();
  const navigate=useNavigate()
  const toast =useToast()

  const [search, setSearch]=useState("")
  //Users we get after searching for users
  const [users, setUsers]=useState([])
  const [loading, setLoading]=useState(false)
  const [loadingChat, setLoadingChat]=useState(false)

  const logoutFunc=()=>{
    localStorage.removeItem("userInfo")
    navigate("/")
  }

  const searchFunc= async ()=>{
    if(search === ''){
      toast({
        title : "Please enter something in the search bar",
        status : 'warning',
        isClosable : true,
        duration : 5000,
        position : 'top-left'
      })

      return
    }

    try{
      setLoading(true)
      await fetch(`https://chatapp-backend-7gqt.onrender.com/api/searchusers?search=${search}`, {
        headers : {'Authorization' : `Bearer ${user.token}`}
      })
      .then(res=> res.json())
      .then(data=> {
          setUsers(data)
          setSearch('')
          setLoading(false)
      }) 
    }catch(err){
      toast({
        title : "An error occured",
        status : 'error',
        isClosable : true,
        duration : 5000,
        position : 'top-left'
      })
    }

  }

  const accessChat= async(userId)=>{
    try{
      setLoadingChat(true)

      console.log(user)

      await fetch("https://chatapp-backend-7gqt.onrender.com/api/accesschat", {
        method : 'POST',
        headers : {
          "Authorization" : `Bearer ${user.token}`,
          "Content-Type" : "application/json"
        },
        body : JSON.stringify({userId})
      })
      .then(res=> res.json())
      .then(data=> {
        console.log(data)
        setLoadingChat(false)
        onClose()
        setSelectedChat(null)
        if(!chats.find(c=> c._id === data._id)){
          chats.push(data)
          setChats([...chats])
        }
      })

    }catch(err){
      console.log(err.message)
    }
  }

  return (
    <>
      <Box display={'flex'} justifyContent='space-between' alignItems={'center'} backgroundColor='white' width={'100%'} padding={"5px 10px 5px 10px"} borderWidth='5px'>
        <Tooltip label='search users to chat' hasArrow placement='bottom'>
          <Button variant={'ghost'} onClick={onOpen}>
            <Search />
            <Text display={{base : "none", md : "flex"}} padding='4px'>Search Users</Text>
          </Button>
        </Tooltip>
        <Text fontSize={'2xl'} fontFamily={"Work sans"}>Social Larva</Text>
        <Box display={'flex'} alignItems={'center'}>
          <Menu>
            <MenuButton padding={"1px"}>
              <NotificationBadge count={notification.length} effect={Effect.SCALE}/>
              <Notifications fontSize='2xl' margin={'1px'}/>
            </MenuButton>
            <MenuList>
              {!notification.length ? <div>no new messages</div> : (
                notification.map(not=>{
                  console.log(not.chat)
                  return <div key={not._id} style={{padding : "5px"}} onClick={()=> {
                    setSelectedChat(not.chat);
                    setNotification(notification.filter(noti=> not._id !== noti._id))
                  }}>
                     {not.chat.isGroupChat ? 
                    `new message in ${not.chat.chatName}` :
                    `new message from ${not.sender.username}`}
                  </div>
                })
              )}
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton as={Button} rightIcon={<StatDownArrow />}>
              <Avatar size={'sm'} cursor={"pointer"} name={user.username} src={user.profilePicture}/>
            </MenuButton>
            <MenuList>
              <ProfileModel user={user}>
                <MenuItem>My Profile</MenuItem>
              </ProfileModel>
              <MenuDivider />
              <MenuItem onClick={()=>logoutFunc()}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </Box>
      </Box>
      <Drawer placement='left' onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth={"1px"}>Search Users</DrawerHeader>
          <DrawerBody>
            <Box display={'flex'} paddingBottom={'2px'}>
              <Input placeholder='Search users by name or email' marginRight={'3px'} value={search} onChange={e=> setSearch(e.target.value)}/>
              <Button onClick={()=> searchFunc()}>Go</Button>
            </Box>
            {loading ? <ChatLoading /> : (
              //the users we get after performing the search operation
            users.map(user=>{
              return <FoundUsers handleClick={()=>accessChat(user._id)} user={user} key={user._id}/>
            })
          )}
          {loadingChat ? <Spinner ml={'auto'} display='flex'/> : null}

          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  )
}

export default SideDrawer