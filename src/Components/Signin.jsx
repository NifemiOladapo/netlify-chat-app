import { FormControl, FormLabel, Input, VStack,  InputGroup, InputRightElement, Button, useToast } from '@chakra-ui/react';
import {useNavigate} from 'react-router-dom'
import React,{useState} from 'react'

const Signin = () => {
    const [show, setShow]=useState(false);
    const [loading, setLoading]=useState(false)
    const [username, setUsername] =useState('')
    const [password, setPassword] =useState('')
    const [email, setEmail] =useState('')
    const [profilePicture, setProfilePicture] =useState('')
    const [confirmPassword, setConfirmPassword]=useState('')

    const toast =useToast()

    const navigate = useNavigate()

    const handleClick=()=>{
        setShow(!show)
    }

    const handlePic= async (pic)=>{

        if(pic === ''){
            toast({
                title : "Please input a valid image",
                status : 'warning',
                isClosable : true,
                duration : 5000,
                position : "top"
            })
        
            return
        }

        try{
           setLoading(true)

            const data=new FormData()

            data.append("upload_preset", "chat-app");
            data.append("cloud_name", "nifemioladapo")
            data.append("file", pic) 
            await fetch("https://api.cloudinary.com/v1_1/nifemioladapo/image/upload", {
                method : 'POST',
                body : data
            })
            .then(res=> res.json())
            .then(data=>{
                console.log(data)
                setProfilePicture(data.url.toString())
                setLoading(false)
            })
            .catch(err=> {
                toast({
                    title : err.message,
                    status : 'error',
                    isClosable : true,
                    duration : 5000,
                    position : "top"
                })
            })
        }catch(err){
            console.log(err.message)
            setLoading(false)
            toast({
                title : err.message,
                status : 'error',
                isClosable : true,
                duration : 5000,
                position : "top"
            })   
        }
    }

    const registerFunc= async ()=>{

        if(username === '' || password === '' || email === '' || confirmPassword === ''){
            toast({
                title : 'Input all the needed fields',
                status : 'warning',
                duration : 5000,
                position : 'top',
                isClosable : true
            })
            return
        }

        if(password !== confirmPassword){
            toast({
                title : 'Your passwords do not match',
                status : 'warning',
                duration : 5000,
                position : 'top',
                isClosable : true
            })
            return
        }

        try {

            setLoading(true)
            await fetch("https://chatapp-backend-7gqt.onrender.com/api/register",{
                method : 'POST',
                headers : {'Content-Type' : 'application/json'},
                body : JSON.stringify({
                    username,
                    email,
                    password, 
                    profilePicture
                })
            })
            .then(res=> res.json())
            .then(data=>{
                setLoading(false)
                if(data === "Please change your username. Username taken" || data === "User not created"){
                    toast({
                        title : data,
                        status : 'warning',
                        duration : 5000,
                        position : 'top',
                        isClosable : true
                    })
                    return
                }

                localStorage.setItem('userInfo', JSON.stringify(data))

                setProfilePicture('')
                setUsername('')
                setPassword('')
                setConfirmPassword('')
                setEmail('')
                setShow(true)

                toast({
                    title : 'User successfuly Registered',
                    status : 'success',
                    duration : 5000,
                    position : 'top',
                    isClosable : true,
                })

                navigate("/chats")
        })            
        } catch (error) {
            console.log(error.message)
            toast({
                title : error.message,
                status : 'error',
                isClosable : true,
                duration : 5000,
                position : "top"
            })
        }
    }

  return (
    <VStack spacing={'5px'} color='black'>
        <FormControl id='first-name' isRequired >
            <FormLabel>Name:</FormLabel>
            <Input value={username} placeholder="Enter your username..."  onChange={(e)=> setUsername(e.target.value)}/>
        </FormControl>
        <FormControl id='email' isRequired >
            <FormLabel>Email:</FormLabel>
            <Input value={email} placeholder="Enter your email..."  onChange={(e)=> setEmail(e.target.value)}/>
        </FormControl>
        
        <FormControl id='password' isRequired>
            <FormLabel>Password:</FormLabel>
            <InputGroup>
            <Input type={show ? 'text' : 'password'} value={password} placeholder="Enter your password"  onChange={(e)=> setPassword(e.target.value)}/>
            <InputRightElement width='4.5rem'>
                <Button h='1.75rem' size='sm' onClick={handleClick}>
                    {show ? 'Hide' : 'show'}
                </Button>
            </InputRightElement>
        </InputGroup>

        </FormControl>
        <FormControl id='password' isRequired>
            <FormLabel>Confirm Password:</FormLabel>
            <InputGroup>
            <Input type={show ? 'text' : 'password'} value={confirmPassword} placeholder="confirm your password..."  onChange={(e)=> setConfirmPassword(e.target.value)}/>
            <InputRightElement width='4.5rem'>
                <Button h='1.75rem' size='sm' onClick={handleClick}>
                    {show ? 'Hide' : 'show'}
                </Button>
            </InputRightElement>
        </InputGroup>
        </FormControl>
        <FormControl id='pic'>
            <FormLabel>Upload your picture</FormLabel>
            <Input type={'file'} accept='image/*' onChange={(e)=> handlePic(e.target.files[0])} p='1.5px'/>
        </FormControl>
        <Button isLoading={loading} colorScheme={'blue'} width='100%' mt={'15px'} onClick={()=> registerFunc()}>SignUp</Button>
    </VStack>
  )
}

export default Signin