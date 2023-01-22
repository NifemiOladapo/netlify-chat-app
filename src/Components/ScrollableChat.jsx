import React from 'react'
import { ChatState } from '../ChatProvider'
import ScrollableFeed from "react-scrollable-feed"

const ScrollableChat = ({messages}) => {

    const {user}=ChatState()

  return (
    <ScrollableFeed>
        {
            messages.map(mess=>{
                return <div key={mess._id} style={{backgroundColor : mess.sender._id === user.id ? '#BEE3F8' : '#B9F5D0', borderRadius : '30px', maxWidth : '50%', padding : '5px 15px', marginLeft : mess.sender._id === user.id ? "auto" : "0px", marginBottom : "3px"}}>{mess.content}</div>
            })
        }
    </ScrollableFeed>
  )
}

export default ScrollableChat