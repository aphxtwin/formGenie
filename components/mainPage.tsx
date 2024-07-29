'use client';
import React, {useState} from "react";
import BuildYourForm from "./build-your-form";
import GradientButton from "./menuButton";
import { AuthButton } from "./authButton";
import MenuContent from "./menuContent";

export default function MainPage({session, buildSessions}:any) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="grid grid-rows-[1fr_3fr] min-h-screen">
        <div>
            <div className="flex justify-end p-3">
                {session ? <GradientButton onClick={()=>setIsOpen(!isOpen)}/>:<AuthButton setIsOpen={setIsOpen} className={'px-[2rem]'} session={session}/>}
            </div>
        </div>
        {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={()=>setIsOpen(!isOpen)}></div>
        )}
            <div
            className={`fixed h-[95%] w-[95%] rounded-xl mx-[3%] my-[1%]  bg-white shadow-2xl z-[100]  transition-transform duration-300 ease-in-out transform ${
            isOpen ? 'translate-y-0' : 'translate-y-[105.5%]'
            }`}
        >
            <MenuContent session={session} buildSessions={buildSessions} toggleMenu={()=>setIsOpen(!isOpen)}/>
            </div>

        <div className="flex justify-center pt-[5rem]">
            <BuildYourForm session={session} /> 
        </div>
        </div>
    );
}