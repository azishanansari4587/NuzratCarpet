"use client"
import { useEffect, useState } from 'react';
import Spinner from '@/components/Spinner';
import withAuth from '@/lib/withAuth';





const Users = () =>  {


  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await fetch('/api/users');
        const data = await res.json();
        setUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
      finally {
        setIsLoading(false);
      }
    }

    fetchUsers();
  }, []);

  return (
    
    <>
    { isLoading ? ( <Spinner/>) : (
      <section className="mx-auto w-full max-w-7xl px-4 py-4">
        <div className="flex flex-col space-y-4  md:flex-row md:items-center md:justify-between md:space-y-0">
          <div>
            <h2 className="text-3xl font-semibold">Users</h2>
          </div>
          
        </div>
        <hr className='my-4 py-0.5 text-black bg-black'/>
        <div className="mt-6 flex flex-col">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
              <div className="overflow-hidden border border-gray-200 md:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-4 py-3.5 text-left text-sm font-normal text-gray-700"
                      >
                        <span>Customer</span>
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3.5 text-left text-sm font-normal text-gray-700"
                      >
                        <span>Business</span>
                      </th>
                      <th
                        scope="col"
                        className="px-12 py-3.5 text-left text-sm font-normal text-gray-700"
                      >
                        Address
                      </th>

                      <th
                        scope="col"
                        className="px-12 py-3.5 text-left text-sm font-normal text-gray-700"
                      >
                        City
                      </th>

                      <th
                        scope="col"
                        className="px-12 py-3.5 text-left text-sm font-normal text-gray-700"
                      >
                        State
                      </th>

                      <th
                        scope="col"
                        className="px-12 py-3.5 text-left text-sm font-normal text-gray-700"
                      >
                        Country
                      </th>

                      <th
                        scope="col"
                        className="px-4 py-3.5 text-left text-sm font-normal text-gray-700"
                      >
                        Contact
                      </th>

                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                  
                    {users.map((person) => (
                      <tr key={person.id}>
                        <td className="whitespace-nowrap px-4 py-4">
                          <div className="flex items-center">
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{person.first_name} {person.last_name}</div>
                              <div className="text-sm text-gray-700">{person.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="text-center px-12 py-4">
                          <div className="text-sm text-gray-900 ">{person.businessType}</div>
                        </td>
                        <td className="text-center px-12 py-4">
                          <div className="text-sm text-gray-900 ">{person.address}</div>
                        </td>

                        <td className="text-center px-4 py-4 text-sm text-gray-700">
                          {person.city}
                        </td>

                        <td className="text-center px-4 py-4 text-sm text-gray-700">
                          {person.state}
                        </td>

                        <td className="text-center px-4 py-4 text-sm text-gray-700">
                          {person.country}
                        </td>

                        <td className="text-center px-4 py-4 text-sm text-gray-700">
                          {person.contact}
                        </td>
                        
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>
    )}
    </>
    
  )
}

export default withAuth(Users, [1]);