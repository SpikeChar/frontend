import React from 'react'
import {Menu} from 'lucide-react'

const Navbar = () => {
    return (
        <header className='w-full flex items-center px-32 py-10 bg-transparent text-white backdrop-blur-xs shadow fixed top-0 left-0 z-99 '>
            <nav className='w-full flex items-center justify-between relative'>
                <div className="links flex items-center gap-10">
                <Menu className='cursor-pointer' size={40} />
                    {/* <div className="link flex items-center gap-6">
                        <span>Home</span>
                        <span>About Us</span>
                        <span>Services</span>
                        <span>Contact Us</span>
                    </div> */}
                </div>
                    <div className="logo cursor-pointer absolute top-0  left-1/2 -translate-x-1/2 size-16 rounded-full overflow-hidden">
                        <img className='w-full h-full bg-cover' src="/logo.jpeg" alt="" />
                    </div>
                    <div className="btn cursor-pointer  rounded-full px-6 py-2 border border-white">Login</div>
            </nav>
        </header>
    )
}

export default Navbar