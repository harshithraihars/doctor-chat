import React from 'react'

const LeftSideBar = () => {
  return (
    <div className="hidden lg:flex flex-col items-center justify-center space-y-6">
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-cyan-200 to-blue-200 rounded-full blur-2xl opacity-30"></div>
            <img
              className="relative z-10 drop-shadow-2xl"
              src="src/assets/images/login.png"
              alt="Healthcare"
              width="400"
              height="400"
            />
          </div>
          
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-gray-800">
              Welcome Back!
            </h1>
            <p className="text-gray-600 text-lg max-w-md">
              Access your personalized healthcare dashboard and continue your wellness journey
            </p>
            
            <div className="flex items-center justify-center space-x-6 pt-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-600">Secure Login</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-600">24/7 Support</span>
              </div>
            </div>
          </div>
        </div>
  )
}

export default LeftSideBar