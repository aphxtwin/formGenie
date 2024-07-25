
'use client'
import React, {useState} from 'react'
import GradientButton from './menuButton'
import { AuthButton } from './authButton'

function ToggleButton({session}:any) {
    const [isOpen, setIsOpen] = useState(false)
    
  return (
    <div>{session? <GradientButton onClick={()=>setIsOpen(!isOpen)}/>:<AuthButton session={session}/>}</div>
  )
}

export default ToggleButton