"use client"
import { useEffect, useState } from 'react';
import Spinner from '@/components/Spinner';
import withAuth from '@/lib/withAuth';
import { Trash } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button';
import { toast } from 'react-toastify';




const Users = () =>  {


  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)

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

    // Open dialog for confirmation
  const confirmDelete = (user) => {
    setSelectedUser(user)
    setOpenDialog(true)
  }

  // Actual delete API call
  const handleDelete = async () => {
    if (!selectedUser) return
    try {
      setIsLoading(true)
      const res = await fetch(`/api/users/${selectedUser.id}`, {
        method: "DELETE",
      })

      if (res.ok) {
        setUsers((prev) => prev.filter((r) => r.id !== selectedUser.id))
        setOpenDialog(false)
        toast.success("User deleted successfully!")
      } else {
        toast.error("Failed to delete user.")
      }
    } catch (error) {
      console.error("Delete error:", error)
      toast.error("Something went wrong while deleting.")
    } finally {
      setIsLoading(false)
    }
  }


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
                        Country
                      </th>

                      <th
                        scope="col"
                        className="px-4 py-3.5 text-left text-sm font-normal text-gray-700"
                      >
                        Contact
                      </th>

                      <th
                        scope="col"
                        className="px-4 py-3.5 text-left text-sm font-normal text-gray-700"
                      >
                        Action
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
                          <br/>
                          {person.state}
                        </td>

                        <td className="text-center px-4 py-4 text-sm text-gray-700">
                          {person.country}
                        </td>

                        <td className="text-center px-4 py-4 text-sm text-gray-700">
                          {person.contact}
                        </td>
                        
                        <td className="text-center px-4 py-4 text-sm text-gray-700">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-600 hover:text-red-700"
                            onClick={() => confirmDelete(person)}
                          >
                            <Trash className="h-5 w-5" />
                          </Button>
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

    {/* ✅ Delete Confirmation Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-[400px] bg-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-red-600">
              Confirm Delete
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              Are you sure you want to delete{" "}
              <span className="font-medium text-black">
                {selectedUser?.first_name} {selectedUser?.last_name}
              </span>
              ? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="flex justify-end gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setOpenDialog(false)}
              className="border-gray-300"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              className="bg-red-600 text-white hover:bg-red-700"
              disabled={isLoading}
            >
              {isLoading ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
    
  )
}

export default withAuth(Users, [1]);