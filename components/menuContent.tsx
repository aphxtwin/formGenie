
import React from 'react'


function ButtonWrapper ({children}:any) {
    return (
        <div className='flex justify-start'>
            <div className='flex justify-center rounded border-2 border-gray-400 bg-white px-10 max-w-[3rem] items-center font-bold'>{children}</div>
        </div>
    )

}

function MenuContent({ toggleMenu, session }: any) {
    const { user } = session
    const {name,email,image } = user
  return (
        <div className="py-3 px-4 flex flex-col h-full">
          <button
            onClick={toggleMenu}
            className="self-end text-gray-600 hover:text-gray-800 transition-colors duration-200 mb-6"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div className="grid justify-center grid-cols-[2fr_2fr_2fr] h-full space-x-5">
            <div className='space-y-2'>
            <ButtonWrapper>
                    <h3>Library</h3>
            </ButtonWrapper>
                <div className='border-2  border-gray-300 rounded h-[90%]'>
                    
                </div>

            </div>
            <div className=''>
                <ButtonWrapper><h3>Settings</h3></ButtonWrapper>
            </div>
            <div>
                <div className='space-y-2 h-full'>
                <ButtonWrapper><h3>Account</h3></ButtonWrapper>
                <div className='border-2 bg-gray-200 border-gray-300 rounded h-[90%]'>
                    { email}
                </div>
                </div>

            </div>
          </div>
        </div>
  )
}

export default MenuContent