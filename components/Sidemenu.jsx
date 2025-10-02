import React from 'react'
import { Shapes,LayoutDashboard,ShoppingBag, ListTodo, Settings, Users,  LogOut, Globe, Mail, ImageIcon, Projector, SquareDashedBottom, Book  } from 'lucide-react'
import Link from 'next/link'
import Logo1 from '@/public/LOGO1.png'
import Logo2 from '@/public/LOGO2.png'
import Image from 'next/image'


const sideMenu =[
    {
        title: 'Dashboard',
        icon: <LayoutDashboard className="h-5 w-5" aria-hidden="true" />,
        path: '/dashboard',
    },
    {
      title: 'Collections',
      icon: <Shapes className="h-5 w-5" aria-hidden="true"/>,
      path: '/collections',
    },
    {
      title: 'Products',
      icon: <ListTodo className="h-5 w-5" aria-hidden="true"/>,
      path: '/products',
    },
    {
        title: 'Product Enquiry',
        icon: <ShoppingBag className="h-5 w-5" aria-hidden="true"/>,
        path: '/enquiry',
    },
    {
        title: 'Custom Rugs',
        icon: <SquareDashedBottom className="h-5 w-5" aria-hidden="true"/>,
        path: '/customRugs',
    },

    {
        title: 'Catalogue',
        icon: <Book className="h-5 w-5" aria-hidden="true"/>,
        path: '/catalogue',
    },
    
    {
        title: 'Users',
        icon: <Users className="h-5 w-5" aria-hidden="true"/>,
        path: '/users',
    },
    {
        title: 'Subscribers',
        icon: <Mail className="h-5 w-5" aria-hidden="true"/>,
        path: '/subscribers',
    },
    {
        title: 'Projects',
        icon: <Projector className="h-5 w-5" aria-hidden="true"/>,
        path: '/projects',
    },
    {
        title: 'Banners',
        icon: <ImageIcon className="h-5 w-5" aria-hidden="true"/>,
        path: '/banners',
    },
    {
        title: 'Website',
        icon: <Globe className="h-5 w-5" aria-hidden="true"/>,
        path: '/link',
    },

]
const SideMenu = () => {
  return (
    <aside className="hidden lg:flex w-64 flex-col overflow-y-auto border-r bg-white px-5 py-8">
      <Link href="/" className='text-center'>
        <Image src={Logo1}  className='w-12 py-4 item-center' alt="Logo1" />
        <Image src={Logo2} alt="Logo2" priority />
      </Link>
      <hr className='mt-4 font-bold text-black'/>
      <div className="mt-6 flex flex-1 flex-col justify-between">
        <nav className="-mx-3 space-y-6 ">
          <div className="space-y-3 ">
            {sideMenu.map((items, index)=>(
                <a
                key={index}
                    className="flex transform items-center rounded-lg px-3 py-2 text-gray-600 transition-colors duration-300 hover:bg-gray-100 hover:text-gray-700"
                    href={items.path}
                >
                    {items.icon}
                    <span className="mx-2 text-sm font-medium">{items.title}</span>
                </a>
            ))}
          </div>
        </nav>

        <div className="flex flex-col justify-between space-y-6">
            <a 
                href="#"
                className="flex justify-between transform items-center rounded-lg px-3 py-2 text-gray-600 transition-colors duration-300 hover:bg-gray-100 hover:text-gray-700"
            >
            <Image
                className="h-8 w-8 rounded-full object-contain"
                src={Logo1}
                alt="User avatar"
            />
            <span className='text-xs font-bold'>LogOut</span>
            <LogOut />
            </a>
            
        </div>

      </div>
    </aside>
  )
}

export default SideMenu