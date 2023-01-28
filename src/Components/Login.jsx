import { FormControl, FormLabel, Input, VStack,  InputGroup, InputRightElement, Button, useToast } from '@chakra-ui/react'
import React,{useState} from 'react'
import {useNavigate} from 'react-router-dom'


const Login = () => {
    const [show, setShow]=useState(false);
    const [isLoading, setIsloading]=useState(false)
    const [password, setPassword] =useState('')
    const [username, setUsername] =useState('')

    const toast =useToast()

    const navigate = useNavigate()

    const handleClick=()=>{
        setShow(!show)
    }

    const loginFunc= async ()=>{

        if(password === '' || username === ''){
            toast({
                title : 'Input all the neccessary fields',
                status : 'warning',
                duration : 5000,
                position : 'top',
                isClosable : true
            })
            return
        }

        try {
            setIsloading(true)
            await fetch("https://chatapp-backend-7gqt.onrender.com/api/login", {
                method : 'POST',
                headers : {'Content-Type' : 'application/json'},
                body : JSON.stringify({
                    username,
                    password
                })
            })
            .then(res=> res.json())
            .then(data=> {
                setIsloading(false)
                if(data === 'User not found'){
                    toast({
                        title : data,
                        status : 'error',
                        duration : 5000,
                        position : 'top',
                        isClosable : true
                    })
                    return
                }

                localStorage.setItem('userInfo', JSON.stringify(data))

                setPassword('')
                setUsername('')
                setShow(false)

                toast({
                    title : 'User successfully loged in',
                    status : 'success',
                    duration : 5000,
                    position : 'top',
                    isClosable : true
                })

                navigate('/chats')

        
            })       
            .catch(err=> {
                toast({
                    title : err.message,
                    status : 'success',
                    duration : 5000,
                    position : 'top',
                    isClosable : true
                })                
            }) 
        } catch (error) {
            console.log(error.message)
        }


    }


  return (
    <VStack spacing={'5px'} color='black'>
        <FormControl id='email' isRequired >
            <FormLabel>Username:</FormLabel>
            <Input value={username} placeholder="Enter your username..."  onChange={(e)=> setUsername(e.target.value)}/>
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
        <Button colorScheme={'blue'} width='100%' mt={'15px'} isLoading={isLoading} onClick={()=> loginFunc()}>Login</Button>
    </VStack>
  )
}

export default Login