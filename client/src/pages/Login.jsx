import React from 'react'

// clert imports
import { SignIn } from '@clerk/clerk-react'

// assets imports
import { assets } from '../assets/assets';

// icons library imports
import { Star } from 'lucide-react';

const Login = () => {
  return (
  <>
    <div className='min-h-screen flex flex-col md:flex-row'>
      {/* {Background Image} */}
      <img src={assets.bgImage} alt="" className="absolute top-0 left-0 -z-1 w-full h-full object-cover"/>

      {/* left side : branding */}
      <div className='flex-1 flex flex-col items-start justify-between p-6 md:p-10 lg:pl-40'>
        <img src={assets.logo} alt="" className="h-50 object-contain" />
        <div>
          <div className='flex items-center gap-3 mb-4 max-md:mt-10'>
            <img src={assets.group_users} alt="" className="h-8 md:h-10" />
            <div>
              <div className='flex'>
                {Array(5).fill(0).map((_, i) => (
                  <Star key={i} className='size-4 md:size-4.5 text-transparent fill-amber-500'/>
                  ))}
              </div>
              <p>Developed by and for Language Enthusiasts!</p>
            </div>
          </div>
          <h1 className='text-3xl md:text-6xl md:pb-2 font-bold bg-gradient-to-l from-red-500 to-indigo-700 bg-clip-text text-transparent'>The Social Media platform for Language and Culture Learners!</h1>
          <p className='text-xl md:text-3xl text-indigo-900 max-w-72 md:max-w-md'>Connect and learn with a global community on Vertena!</p>
        </div>
        <span className='md:h-10'></span>
      </div>
      {/* Right side : login form */}
      <div className='flex-1 flex items-center justify-center p-6 sm:p-10'>
        <SignIn/>
      </div>
    </div>

    <div>
      Hello, this is another section. 
    </div>
  </> 
  )
}

export default Login;
