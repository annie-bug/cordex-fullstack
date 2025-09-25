import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

function Navbar() {
  return (
    <nav className='bg-black text-gray-300 sticky top-0 z-50'>
        <div className='mx-auto px-4 py-3 flex justify-between items-center'>
            <Image src={'/logo.svg'} width={40} height={40} alt='logo'/>
            <Link href='/' className='text-2xl font-semibold hover:text-gray-500'>cordex</Link>
            <div className='space-x-6 font-light'>
              <Link href={'#'}>Home</Link>
              <Link href={'#'}>About</Link>
              <Link href={'#'}>Login</Link>
            </div>
        </div>
    </nav>
  )
}

export default Navbar