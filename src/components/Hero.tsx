import React from 'react'

function Hero() {
  return (
    <section className='bg-gradient-to-r from from-blue-600 to-blue-400 text-white py-20 px-4 text-center'>
        <div className='container mx-auto max-w-3xl'>
            <h1 className='text-5xl font-extrabold mb-4 drop-shadow-md'>
                Manage Your Contacts Effortlessly
            </h1>
            <p className='text-lg mb-6 drop-shadow-sm'>
                A modern and secure contact manager to keep your important connections
                organized and accessible from anywhere.
            </p>
            <a href="#contact-form" className='bg-white text-blue-700 font-bold rounded px-6 py-3 shsadow hover:bg-gray-100 transition'>Get Started</a>
        </div>
    </section>
  )
}

export default Hero