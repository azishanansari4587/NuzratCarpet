import React from 'react'
import { Shapes,LayoutDashboard,ShoppingBag, ListTodo, Settings, Users,  LogOut, Globe  } from 'lucide-react'
import Link from 'next/link'
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
        title: 'Users',
        icon: <Users className="h-5 w-5" aria-hidden="true"/>,
        path: '/users',
    },
    {
        title: 'Website',
        icon: <Globe className="h-5 w-5" aria-hidden="true"/>,
        path: '/link',
    },
    {
        title: 'Setting',
        icon: <Settings className="h-5 w-5" aria-hidden="true"/>,
        path: '/link',
    },
]
const SideMenu = () => {
  return (
    <aside className="hidden lg:flex w-64 flex-col overflow-y-auto border-r bg-white px-5 py-8">
      <Link href="#" className='text-center'>
        <img src="/48.jpg"  className='w-12 py-4 item-center' alt="" />
        <img src="/47.jpg" alt="" />
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
            <img
                className="h-8 w-8 rounded-full object-contain"
                src="/48.jpg"
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