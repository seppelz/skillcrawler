import React, { useState } from 'react';
import { useToast } from '../../context/ToastContext';
import SearchBar from '../../components/SearchBar';

// Mock user data - in a real application, this would come from an API
const mockUsers = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'user', status: 'active', createdAt: '2023-01-15' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'user', status: 'active', createdAt: '2023-02-20' },
  { id: 3, name: 'Admin User', email: 'admin@example.com', role: 'admin', status: 'active', createdAt: '2023-01-01' },
  { id: 4, name: 'Bob Johnson', email: 'bob@example.com', role: 'user', status: 'inactive', createdAt: '2023-03-10' }
];

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  createdAt: string;
}

const AdminUsers: React.FC = () => {
  const [users] = useState<User[]>(mockUsers);
  const [filteredUsers, setFilteredUsers] = useState<User[]>(mockUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const { addToast } = useToast();

  const handleSearch = (query: string) => {
    setSearchTerm(query);
    
    if (!query.trim()) {
      setFilteredUsers(users);
      return;
    }
    
    const results = users.filter(user => 
      user.name.toLowerCase().includes(query.toLowerCase()) ||
      user.email.toLowerCase().includes(query.toLowerCase()) ||
      user.role.toLowerCase().includes(query.toLowerCase())
    );
    
    setFilteredUsers(results);
  };

  // Display no results message with search term context if needed
  const getNoResultsMessage = () => {
    return searchTerm
      ? `No users found matching "${searchTerm}". Try a different search term.`
      : 'No users found.';
  };

  const handleRoleChange = (userId: number, newRole: string) => {
    const user = users.find(u => u.id === userId);
    if (!user) return;
    
    setSelectedUser({...user, role: newRole});
    setIsUpdating(true);
  };

  const handleStatusChange = (userId: number, newStatus: string) => {
    const user = users.find(u => u.id === userId);
    if (!user) return;
    
    setSelectedUser({...user, status: newStatus});
    setIsUpdating(true);
  };

  const cancelUpdate = () => {
    setSelectedUser(null);
    setIsUpdating(false);
  };

  const confirmUpdate = async () => {
    if (!selectedUser) return;
    
    try {
      // In a real app, we would call an API to update the user
      // await userService.updateUser(selectedUser.id, { role: selectedUser.role, status: selectedUser.status });
      
      // For now, we'll just update the local state
      // This is a mock implementation
      addToast('User updated successfully', 'success');
    } catch (err) {
      console.error('Error updating user:', err);
      addToast('Failed to update user', 'error');
    } finally {
      setIsUpdating(false);
      setSelectedUser(null);
    }
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Manage Users</h2>
      </div>

      <div className="mb-6">
        <SearchBar
          onSearch={handleSearch}
          placeholder="Search users..."
          className="w-full"
        />
      </div>

      {filteredUsers.length === 0 ? (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-4 rounded-md">
          <p>{getNoResultsMessage()}</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Member Since
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{user.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user.id, e.target.value)}
                      className="text-sm text-gray-700 border border-gray-300 rounded-md px-2 py-1"
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={user.status}
                      onChange={(e) => handleStatusChange(user.id, e.target.value)}
                      className="text-sm text-gray-700 border border-gray-300 rounded-md px-2 py-1"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="suspended">Suspended</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{new Date(user.createdAt).toLocaleDateString()}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button 
                      className="text-indigo-600 hover:text-indigo-900"
                      onClick={() => addToast('View user details functionality would be implemented here', 'info')}
                    >
                      Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Confirmation Modal for User Update */}
      {isUpdating && selectedUser && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">Confirm User Update</h3>
            <p className="mb-4">Are you sure you want to update this user?</p>
            
            <div className="mb-4">
              <p><strong>User:</strong> {selectedUser.name}</p>
              <p><strong>Role:</strong> {selectedUser.role}</p>
              <p><strong>Status:</strong> {selectedUser.status}</p>
            </div>
            
            <div className="flex justify-end space-x-2">
              <button
                onClick={cancelUpdate}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
              >
                Cancel
              </button>
              <button
                onClick={confirmUpdate}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminUsers;
