'use client'
import React, {useState} from 'react'
import { AuthButton } from './authButton'
import Link from 'next/link'

function SectionWrapper({children}:any) {
    return (
        <div className='border-[0.5px] bg-white border-zinc-200 rounded h-[90%]'>
            {children}
        </div>
    )

}


function ButtonWrapper ({children}:any) {
    return (
        <div className='flex justify-start'>
            <div className='flex justify-center rounded border-2 border-gray-400 bg-white px-10 max-w-[3rem] items-center font-bold'>{children}</div>
        </div>
    )

}

function MenuContent({ toggleMenu, session, buildSessions }: any) {
    console.log(buildSessions, 'bulshit')
    if (!session) return null

    const  {email} = session.user

  return (
        <div className="py-3 px-4 flex flex-col h-full ">
          <button
            onClick={toggleMenu}
            className="self-end text-gray-600 hover:text-gray-800 transition-colors duration-200 mb-6"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div className="grid justify-center grid-cols-[2fr_1fr_2fr] h-full space-x-5">
            <div className='space-y-2'>
            <ButtonWrapper>
                    <h3>Library</h3>
            </ButtonWrapper>
            <SectionWrapper>
            {buildSessions.length > 0 
                        ?
                        buildSessions.map((session:any) => (
                            <div key={session.id} className='flex justify-center space-x-2 py- hover:bg-orange-200 transition duration-300'>
                                <Link className='w-[90%] font-medium text-lg' href={`chat/${session.id}`}>
                                    {`${session.title}`}
                                </Link>
                                <div></div>
                            </div>
                        ))
                        : 
                        <div className='flex flex-col h-full items-center justify-center space-y-3'>
                            <p className='text-gray-600'>It seems like we didn't build anything together yet</p>
                            <button className='bg-gradient-to-r font-semibold hover:opacity-80 transition-all duration-300 from-red-500 via-pink-500 to-blue-500 text-white px-3 py-2 rounded' onClick={()=>toggleMenu(false)}>Start a build session!</button>
                        </div>
                    }
            </SectionWrapper>
            </div>

            <div className='space-y-2 h-full'>
                <ButtonWrapper><h3>Account</h3></ButtonWrapper>
                <SectionWrapper>
                    <div className='flex flex-col items-center font-medium text-lg  h-full'>
                        {email}
                        <AuthButton setIsOpen={toggleMenu} className='px-[4rem]' session={session}/>
                    </div>
                </SectionWrapper>
            </div>
            <div className='space-y-2  h-full'>
                <ButtonWrapper><h3>Settings</h3></ButtonWrapper>
                <SectionWrapper>

                </SectionWrapper>
            </div>
          </div>
        </div>
  )
}

export default MenuContent