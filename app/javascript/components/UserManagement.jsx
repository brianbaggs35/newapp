import React, { useState, useEffect } from 'react';
import { Card, Table, Badge, Button, Modal, TextInput, Label } from 'flowbite-react';
import { HiUser, HiMail, HiTrash, HiPencil, HiPlus } from 'react-icons/hi';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    email: '',
    role: 'user'
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/admin/users', {
        headers: {
          'X-CSRF-Token': document.querySelector('[name="csrf-token"]').content
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      email: user.email,
      role: user.role || 'user'
    });
    setShowModal(true);
  };

  const handleAdd = () => {
    setEditingUser(null);
    setFormData({
      email: '',
      role: 'user'
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const url = editingUser ? `/admin/users/${editingUser.id}` : '/admin/users';
      const method = editingUser ? 'PATCH' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': document.querySelector('[name="csrf-token"]').content
        },
        body: JSON.stringify({ user: formData })
      });

      if (response.ok) {
        setShowModal(false);
        fetchUsers();
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to save user:', error);
    }
  };

  const handleDelete = async (userId) => {
    if (confirm('Are you sure you want to delete this user?')) {
      try {
        const response = await fetch(`/admin/users/${userId}`, {
          method: 'DELETE',
          headers: {
            'X-CSRF-Token': document.querySelector('[name="csrf-token"]').content
          }
        });

        if (response.ok) {
          fetchUsers();
        }
      } catch (error) {
        // eslint-disable-next-line no-console
      console.error('Failed to delete user:', error);
      }
    }
  };

  const handleConfirmUser = async (userId) => {
    try {
      const response = await fetch(`/admin/users/${userId}/confirm`, {
        method: 'PATCH',
        headers: {
          'X-CSRF-Token': document.querySelector('[name="csrf-token"]').content
        }
      });

      if (response.ok) {
        fetchUsers();
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to confirm user:', error);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading users...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            User Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage user accounts and permissions
          </p>
        </div>
        <Button onClick={handleAdd} color="blue">
          <HiPlus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </div>

      <Card>
        <Table>
          <Table.Head>
            <Table.HeadCell>
              <HiUser className="inline mr-2 h-4 w-4" />
              User
            </Table.HeadCell>
            <Table.HeadCell>Status</Table.HeadCell>
            <Table.HeadCell>Role</Table.HeadCell>
            <Table.HeadCell>Joined</Table.HeadCell>
            <Table.HeadCell>Actions</Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {users.map((user) => (
              <Table.Row key={user.id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                  <div className="flex items-center">
                    <HiMail className="mr-2 h-4 w-4 text-gray-400" />
                    {user.email}
                  </div>
                </Table.Cell>
                <Table.Cell>
                  {user.confirmed_at ? (
                    <Badge color="success">Confirmed</Badge>
                  ) : (
                    <div className="flex gap-2">
                      <Badge color="warning">Unconfirmed</Badge>
                      <Button 
                        size="xs" 
                        color="light" 
                        onClick={() => handleConfirmUser(user.id)}
                      >
                        Confirm
                      </Button>
                    </div>
                  )}
                </Table.Cell>
                <Table.Cell>
                  <Badge color="info">{user.role || 'User'}</Badge>
                </Table.Cell>
                <Table.Cell>
                  {new Date(user.created_at).toLocaleDateString()}
                </Table.Cell>
                <Table.Cell>
                  <div className="flex gap-2">
                    <Button size="xs" color="gray" onClick={() => handleEdit(user)}>
                      <HiPencil className="h-3 w-3" />
                    </Button>
                    <Button size="xs" color="failure" onClick={() => handleDelete(user.id)}>
                      <HiTrash className="h-3 w-3" />
                    </Button>
                  </div>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </Card>

      <Modal show={showModal} onClose={() => setShowModal(false)}>
        <Modal.Header>
          {editingUser ? 'Edit User' : 'Add New User'}
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email" value="Email" />
              <TextInput
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="role" value="Role" />
              <select
                id="role"
                className="w-full rounded-lg border border-gray-300 p-2.5"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleSubmit} color="blue">
            {editingUser ? 'Update' : 'Create'}
          </Button>
          <Button color="gray" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default UserManagement;