import React from 'react'
import {Box, Container, Text} from '@chakra-ui/react'
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react"
import Login from '../Components/Login'
import Signin from '../Components/Signin'

const Home = () => {
  return (
    <Container maxw='xxl' centerContent>
      <Box p={'2'} d='flex' justifyContent='center' m='40px 0 15px 0' bg='white' w={'100%'} borderRadius='lg' borderWidth={'1px'}>
        <Text fontSize={'3xl'} color='black' textAlign={'center'} fontFamily={'sans-serif'}>Talk-A-Tive</Text>
      </Box>
      <Box bg={'white'} w='100%' p={4} borderRadius='lg' borderWidth={'1px'}>
        <Tabs variant={'soft-rounded'}>
          <TabList mb='1em'>
            <Tab w='50%'>Login</Tab>
            <Tab w='50%'>Signup</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login />
            </TabPanel>
            <TabPanel>
              <Signin />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  )
}

export default Home