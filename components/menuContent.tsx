
import React from 'react'

function MenuContent({ toggleMenu}) {
  return (
        <div className="p-6 flex flex-col h-full">
          <button
            onClick={toggleMenu}
            className="self-end text-gray-600 hover:text-gray-800 transition-colors duration-200 mb-6"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <nav className="flex-grow flex items-center justify-center">
            <ul className="space-y-6 text-center">
              <li><a href="#" className="text-2xl font-semibold text-gray-800 hover:text-purple-600 transition-colors duration-200">Home</a></li>
              <li><a href="#" className="text-2xl font-semibold text-gray-800 hover:text-purple-600 transition-colors duration-200">About</a></li>
              <li><a href="#" className="text-2xl font-semibold text-gray-800 hover:text-purple-600 transition-colors duration-200">Contact</a></li>
            </ul>
          </nav>
        </div>
  )
}

export default MenuContent