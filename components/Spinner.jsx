import React from 'react'

const Spinner = () => {
  return (
    // <div className="flex items-center justify-center min-h-screen">
    //   <div className="w-16 h-16 border-4 border-blue-500 border-dotted rounded-full animate-slow-spin"></div>
    // </div>

    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="relative w-24 h-24">
        {/* Circular Spinner */}
        <div
          className="absolute top-0 left-0 w-full h-full border-4 border-blue-500 border-t-transparent rounded-full animate-spin"
        ></div>
        {/* Centered Text */}
        <div className="absolute inset-0 flex items-center justify-center text-center text-sm font-semibold text-gray-700">
          Nuzrat<br />Carpet<br />Emporium
        </div>
      </div>
    </div>
  )
}

export default Spinner