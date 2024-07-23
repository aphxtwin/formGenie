'use client';
import React, {useState} from "react";
import BuildYourForm from "./build-your-form";
import GradientButton from "./menuButton";
import { AuthButton } from "./authButton";
import MenuContent from "./menuContent";
export default function MainPage({session, signOut}:any) {
    const [isOpen, setIsOpen] = useState(false);


    return (
        <div className="grid grid-rows-[1fr_3fr] min-h-screen">
        <div>
            <div className="flex justify-end w-full p-3">
                {session? <GradientButton onClick={()=>setIsOpen(!isOpen)}/>:<AuthButton signOut={signOut} session={session}/>}
            </div>
        </div>
        {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={()=>setIsOpen(!isOpen)}></div>
        )}
        
        <div
        className={`fixed h-[80%] w-[80%]  inset-x-1/6 bg-white shadow-2xl z-[100] transition-transform duration-300 ease-in-out transform ${
          isOpen ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <MenuContent toggleMenu={()=>setIsOpen(!isOpen)}/>
        </div>
        <div className="flex justify-center pt-[5rem]">
            <BuildYourForm session={session} /> 
        </div>
        </div>
    );
}