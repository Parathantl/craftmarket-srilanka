import { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  ChartBarIcon,
  UsersIcon,
  ShoppingBagIcon,
  ClipboardDocumentListIcon,
  TagIcon,
  EnvelopeIcon,
} from '@heroicons/react/24/outline';
import axios from 'axios';
import toast from 'react-hot-toast';
import StatusBadge from '../components/UI/StatusBadge';

const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:4000';

const tabs = [
  { name: 'Overview', path: '/admin', icon: ChartBarIcon },
  { name: 'Users', path: '/admin/users', icon: UsersIcon },
  { name: 'Products', path: '/admin/products', icon: ShoppingBagIcon },
  { name: 'Orders', path: '/admin/orders', icon: ClipboardDocumentListIcon },
  { name: 'Categories', path: '/admin/categories', icon: TagIcon },
  { name: 'Messages', path: '/admin/messages', icon: EnvelopeIcon },
];

// ============ Overview Tab ============
function Overview() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get(`${apiBase}/api/admin/dashboard`);
        setStats(response.data);
      } catch (error) {
        toast.error('Failed to load dashboard stats');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-gray-200 h-32 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  if (!stats) return <p className="text-gray-500">Failed to load statistics.</p>;

  const statCards = [
    { label: 'Total Users', value: stats.users.total + stats.users.creators, sub: `${stats.users.creators} creators` },
    { label: 'Total Products', value: stats.products.total, sub: `${stats.products.active} active` },
    { label: 'Total Orders', value: stats.orders.total, sub: `${stats.orders.pending} pending` },
    { label: 'Total Revenue', value: `LKR ${stats.revenue.total.toLocaleString()}`, sub: 'from paid orders' },
  ];

  return (
    <div className="space-y-8">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => (
          <div key={card.label} className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <p className="text-sm font-medium text-gray-500 truncate">{card.label}</p>
              <p className="mt-1 text-3xl font-semibold text-gray-900">{card.value}</p>
              <p className="mt-1 text-sm text-gray-500">{card.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Order Status Breakdown</h3>
          <div className="space-y-3">
            {[
              { label: 'Pending', value: stats.orders.pending, color: 'bg-yellow-500' },
              { label: 'Confirmed', value: stats.orders.confirmed, color: 'bg-blue-500' },
              { label: 'Shipped', value: stats.orders.shipped, color: 'bg-purple-500' },
              { label: 'Delivered', value: stats.orders.delivered, color: 'bg-green-500' },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className={`w-3 h-3 rounded-full ${item.color} mr-2`}></span>
                  <span className="text-sm text-gray-600">{item.label}</span>
                </div>
                <span className="text-sm font-medium text-gray-900">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Product Stats</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Active Products</span>
              <span className="text-sm font-medium text-green-600">{stats.products.active}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Inactive Products</span>
              <span className="text-sm font-medium text-red-600">{stats.products.inactive}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Low Stock ({"<"}10)</span>
              <span className="text-sm font-medium text-yellow-600">{stats.products.lowStock}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Orders</h3>
          {stats.recent.orders.length === 0 ? (
            <p className="text-sm text-gray-500">No recent orders.</p>
          ) : (
            <div className="space-y-3">
              {stats.recent.orders.map((order) => (
                <div key={order._id} className="flex items-center justify-between text-sm">
                  <div>
                    <p className="font-medium text-gray-900">{order.user?.name || order.customerInfo?.name || 'Guest'}</p>
                    <p className="text-gray-500">LKR {order.totalAmount}</p>
                  </div>
                  <StatusBadge status={order.status} />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Products</h3>
          {stats.recent.products.length === 0 ? (
            <p className="text-sm text-gray-500">No recent products.</p>
          ) : (
            <div className="space-y-3">
              {stats.recent.products.map((product) => (
                <div key={product._id} className="flex items-center justify-between text-sm">
                  <div>
                    <p className="font-medium text-gray-900">{product.title}</p>
                    <p className="text-gray-500">by {product.creator?.name} - {product.category?.name}</p>
                  </div>
                  <span className="text-gray-900 font-medium">LKR {product.price}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ============ Users Tab ============
function UsersManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, total: 0 });

  const fetchUsers = async (page = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 20 });
      if (search) params.append('search', search);
      if (roleFilter) params.append('role', roleFilter);

      const response = await axios.get(`${apiBase}/api/admin/users?${params}`);
      setUsers(response.data.users);
      setPagination({
        currentPage: parseInt(response.data.currentPage),
        totalPages: response.data.totalPages,
        total: response.data.total,
      });
    } catch (error) {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [roleFilter]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchUsers(1);
  };

  const toggleUserStatus = async (userId) => {
    try {
      const response = await axios.patch(`${apiBase}/api/admin/users/${userId}/toggle-status`);
      toast.success(response.data.message);
      fetchUsers(pagination.currentPage);
    } catch (error) {
      toast.error('Failed to update user status');
    }
  };

  const deleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await axios.delete(`${apiBase}/api/admin/users/${userId}`);
      toast.success('User deleted');
      fetchUsers(pagination.currentPage);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to delete user');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <form onSubmit={handleSearch} className="flex-1">
          <div className="flex">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search users..."
              className="flex-1 border border-gray-300 rounded-l-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-r-md text-sm hover:bg-indigo-700">
              Search
            </button>
          </div>
        </form>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">All Roles</option>
          <option value="user">Customer</option>
          <option value="creator">Creator</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      <p className="text-sm text-gray-500">{pagination.total} users found</p>

      {loading ? (
        <div className="animate-pulse space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-gray-200 h-12 rounded"></div>
          ))}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Joined</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={user.role} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={user.isActive ? 'active' : 'inactive'} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                    <button
                      onClick={() => toggleUserStatus(user._id)}
                      className={`text-sm font-medium ${user.isActive ? 'text-red-600 hover:text-red-500' : 'text-green-600 hover:text-green-500'}`}
                    >
                      {user.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                    {user.role !== 'admin' && (
                      <button
                        onClick={() => deleteUser(user._id)}
                        className="text-sm font-medium text-red-600 hover:text-red-500"
                      >
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {pagination.totalPages > 1 && (
        <div className="flex justify-center space-x-2 mt-4">
          <button
            onClick={() => fetchUsers(pagination.currentPage - 1)}
            disabled={pagination.currentPage === 1}
            className="px-3 py-1 text-sm border rounded-md disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-3 py-1 text-sm">
            Page {pagination.currentPage} of {pagination.totalPages}
          </span>
          <button
            onClick={() => fetchUsers(pagination.currentPage + 1)}
            disabled={pagination.currentPage === pagination.totalPages}
            className="px-3 py-1 text-sm border rounded-md disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

// ============ Products Tab ============
function ProductsManagement() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, total: 0 });

  const buildImageUrl = (path) => {
    if (!path) return '/placeholder-product.jpg';
    const normalized = path.startsWith('/') ? path : `/${path}`;
    return `${apiBase}${normalized}`;
  };

  const fetchProducts = async (page = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 20 });
      if (search) params.append('search', search);

      const response = await axios.get(`${apiBase}/api/admin/products?${params}`);
      setProducts(response.data.products);
      setPagination({
        currentPage: parseInt(response.data.currentPage),
        totalPages: response.data.totalPages,
        total: response.data.total,
      });
    } catch (error) {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProducts(1);
  };

  const toggleProductStatus = async (productId, currentStatus) => {
    try {
      await axios.patch(`${apiBase}/api/admin/products/${productId}/status`, { isActive: !currentStatus });
      toast.success(`Product ${!currentStatus ? 'activated' : 'deactivated'}`);
      fetchProducts(pagination.currentPage);
    } catch (error) {
      toast.error('Failed to update product status');
    }
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSearch} className="flex max-w-md">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products..."
          className="flex-1 border border-gray-300 rounded-l-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-r-md text-sm hover:bg-indigo-700">
          Search
        </button>
      </form>

      <p className="text-sm text-gray-500">{pagination.total} products found</p>

      {loading ? (
        <div className="animate-pulse space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-gray-200 h-12 rounded"></div>
          ))}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Creator</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.map((product) => (
                <tr key={product._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img
                        src={buildImageUrl(product.images?.[0])}
                        alt={product.title}
                        className="h-10 w-10 rounded object-cover mr-3"
                      />
                      <span className="text-sm font-medium text-gray-900">{product.title}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.creator?.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.category?.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">LKR {product.price}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-sm font-medium ${product.stock < 10 ? 'text-red-600' : 'text-gray-900'}`}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={product.isActive ? 'active' : 'inactive'} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      onClick={() => toggleProductStatus(product._id, product.isActive)}
                      className={`text-sm font-medium ${product.isActive ? 'text-red-600 hover:text-red-500' : 'text-green-600 hover:text-green-500'}`}
                    >
                      {product.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {pagination.totalPages > 1 && (
        <div className="flex justify-center space-x-2 mt-4">
          <button
            onClick={() => fetchProducts(pagination.currentPage - 1)}
            disabled={pagination.currentPage === 1}
            className="px-3 py-1 text-sm border rounded-md disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-3 py-1 text-sm">
            Page {pagination.currentPage} of {pagination.totalPages}
          </span>
          <button
            onClick={() => fetchProducts(pagination.currentPage + 1)}
            disabled={pagination.currentPage === pagination.totalPages}
            className="px-3 py-1 text-sm border rounded-md disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

// ============ Orders Tab ============
function OrdersManagement() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, total: 0 });

  const fetchOrders = async (page = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 20 });
      if (statusFilter) params.append('status', statusFilter);

      const response = await axios.get(`${apiBase}/api/orders/admin/all?${params}`);
      setOrders(response.data.orders);
      setPagination({
        currentPage: parseInt(response.data.currentPage),
        totalPages: response.data.totalPages,
        total: response.data.total,
      });
    } catch (error) {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await axios.patch(`${apiBase}/api/orders/${orderId}/status`, { status: newStatus });
      toast.success(`Order status updated to ${newStatus}`);
      fetchOrders(pagination.currentPage);
    } catch (error) {
      toast.error('Failed to update order status');
    }
  };

  const statusOptions = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled', 'returned'];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">All Statuses</option>
          {statusOptions.map((s) => (
            <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
          ))}
        </select>
        <span className="text-sm text-gray-500">{pagination.total} orders found</span>
      </div>

      {loading ? (
        <div className="animate-pulse space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-gray-200 h-12 rounded"></div>
          ))}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Products</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-500">
                    {order._id.slice(-8)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {order.user?.name || order.customerInfo?.name || 'Guest'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {order.products.map(p => p.product?.title || 'Unknown').join(', ').substring(0, 50)}
                    {order.products.map(p => p.product?.title || '').join(', ').length > 50 ? '...' : ''}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    LKR {order.totalAmount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={order.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <select
                      value={order.status}
                      onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                      className="border border-gray-300 rounded-md px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      {statusOptions.map((s) => (
                        <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {pagination.totalPages > 1 && (
        <div className="flex justify-center space-x-2 mt-4">
          <button
            onClick={() => fetchOrders(pagination.currentPage - 1)}
            disabled={pagination.currentPage === 1}
            className="px-3 py-1 text-sm border rounded-md disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-3 py-1 text-sm">
            Page {pagination.currentPage} of {pagination.totalPages}
          </span>
          <button
            onClick={() => fetchOrders(pagination.currentPage + 1)}
            disabled={pagination.currentPage === pagination.totalPages}
            className="px-3 py-1 text-sm border rounded-md disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

// ============ Categories Tab ============
function CategoriesManagement() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '' });

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${apiBase}/api/admin/categories`);
      setCategories(response.data);
    } catch (error) {
      toast.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`${apiBase}/api/admin/categories/${editingId}`, formData);
        toast.success('Category updated');
      } else {
        await axios.post(`${apiBase}/api/admin/categories`, formData);
        toast.success('Category created');
      }
      setFormData({ name: '', description: '' });
      setShowForm(false);
      setEditingId(null);
      fetchCategories();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to save category');
    }
  };

  const startEdit = (category) => {
    setFormData({ name: category.name, description: category.description || '' });
    setEditingId(category._id);
    setShowForm(true);
  };

  const deleteCategory = async (categoryId) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;
    try {
      await axios.delete(`${apiBase}/api/admin/categories/${categoryId}`);
      toast.success('Category deleted');
      fetchCategories();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to delete category');
    }
  };

  return (
    <div className="space-y-4">
      <button
        onClick={() => {
          setShowForm(!showForm);
          setEditingId(null);
          setFormData({ name: '', description: '' });
        }}
        className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700"
      >
        {showForm ? 'Cancel' : 'Add Category'}
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-gray-50 rounded-lg p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
              className="mt-1 block w-full max-w-md rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
              className="mt-1 block w-full max-w-md rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          <button
            type="submit"
            className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700"
          >
            {editingId ? 'Update' : 'Create'} Category
          </button>
        </form>
      )}

      {loading ? (
        <div className="animate-pulse space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-gray-200 h-12 rounded"></div>
          ))}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {categories.map((category) => (
                <tr key={category._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{category.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{category.description || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(category.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                    <button
                      onClick={() => startEdit(category)}
                      className="text-indigo-600 hover:text-indigo-500 font-medium"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteCategory(category._id)}
                      className="text-red-600 hover:text-red-500 font-medium"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ============ Messages Tab ============
function MessagesManagement() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, total: 0 });
  const [selectedMessage, setSelectedMessage] = useState(null);

  const fetchContacts = async (page = 1) => {
    setLoading(true);
    try {
      const response = await axios.get(`${apiBase}/api/contact?page=${page}&limit=20`);
      setContacts(response.data.contacts);
      setPagination({
        currentPage: parseInt(response.data.currentPage),
        totalPages: response.data.totalPages,
        total: response.data.total,
      });
    } catch (error) {
      toast.error('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const markAsRead = async (contactId) => {
    try {
      await axios.patch(`${apiBase}/api/contact/${contactId}/read`);
      fetchContacts(pagination.currentPage);
    } catch (error) {
      toast.error('Failed to update message');
    }
  };

  const deleteContact = async (contactId) => {
    if (!window.confirm('Delete this message?')) return;
    try {
      await axios.delete(`${apiBase}/api/contact/${contactId}`);
      toast.success('Message deleted');
      setSelectedMessage(null);
      fetchContacts(pagination.currentPage);
    } catch (error) {
      toast.error('Failed to delete message');
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500">{pagination.total} messages</p>

      {selectedMessage && (
        <div className="bg-white shadow rounded-lg p-6 border border-indigo-200">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-medium text-gray-900">{selectedMessage.subject}</h3>
              <p className="text-sm text-gray-500">
                From: {selectedMessage.name} ({selectedMessage.email})
              </p>
              <p className="text-sm text-gray-500">
                {new Date(selectedMessage.createdAt).toLocaleString()}
              </p>
            </div>
            <button
              onClick={() => setSelectedMessage(null)}
              className="text-gray-400 hover:text-gray-500 text-sm"
            >
              Close
            </button>
          </div>
          <p className="mt-4 text-gray-700 whitespace-pre-wrap">{selectedMessage.message}</p>
          <div className="mt-4 space-x-2">
            {!selectedMessage.isRead && (
              <button
                onClick={() => markAsRead(selectedMessage._id)}
                className="text-sm text-indigo-600 hover:text-indigo-500 font-medium"
              >
                Mark as Read
              </button>
            )}
            <button
              onClick={() => deleteContact(selectedMessage._id)}
              className="text-sm text-red-600 hover:text-red-500 font-medium"
            >
              Delete
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="animate-pulse space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-gray-200 h-12 rounded"></div>
          ))}
        </div>
      ) : contacts.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No messages yet.</p>
      ) : (
        <div className="space-y-2">
          {contacts.map((contact) => (
            <div
              key={contact._id}
              onClick={() => {
                setSelectedMessage(contact);
                if (!contact.isRead) markAsRead(contact._id);
              }}
              className={`p-4 rounded-lg border cursor-pointer hover:bg-gray-50 ${
                contact.isRead ? 'bg-white border-gray-200' : 'bg-indigo-50 border-indigo-200'
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className={`text-sm ${contact.isRead ? 'font-normal text-gray-900' : 'font-semibold text-gray-900'}`}>
                    {contact.subject}
                  </p>
                  <p className="text-sm text-gray-500">{contact.name} - {contact.email}</p>
                </div>
                <div className="flex items-center space-x-2">
                  {!contact.isRead && (
                    <span className="inline-block w-2 h-2 rounded-full bg-indigo-600"></span>
                  )}
                  <span className="text-xs text-gray-400">
                    {new Date(contact.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <p className="mt-1 text-sm text-gray-500 truncate">{contact.message}</p>
            </div>
          ))}
        </div>
      )}

      {pagination.totalPages > 1 && (
        <div className="flex justify-center space-x-2 mt-4">
          <button
            onClick={() => fetchContacts(pagination.currentPage - 1)}
            disabled={pagination.currentPage === 1}
            className="px-3 py-1 text-sm border rounded-md disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-3 py-1 text-sm">
            Page {pagination.currentPage} of {pagination.totalPages}
          </span>
          <button
            onClick={() => fetchContacts(pagination.currentPage + 1)}
            disabled={pagination.currentPage === pagination.totalPages}
            className="px-3 py-1 text-sm border rounded-md disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

// ============ Main Admin Dashboard Layout ============
export default function AdminDashboard() {
  const location = useLocation();
  const navigate = useNavigate();

  // Redirect /admin/ to /admin on first load
  useEffect(() => {
    if (location.pathname === '/admin/') {
      navigate('/admin', { replace: true });
    }
  }, [location.pathname, navigate]);

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8 overflow-x-auto" aria-label="Tabs">
            {tabs.map((tab) => {
              const isActive = location.pathname === tab.path ||
                (tab.path === '/admin' && location.pathname === '/admin');
              return (
                <Link
                  key={tab.name}
                  to={tab.path}
                  className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                    isActive
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="h-5 w-5" />
                  <span>{tab.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <Routes>
          <Route index element={<Overview />} />
          <Route path="users" element={<UsersManagement />} />
          <Route path="products" element={<ProductsManagement />} />
          <Route path="orders" element={<OrdersManagement />} />
          <Route path="categories" element={<CategoriesManagement />} />
          <Route path="messages" element={<MessagesManagement />} />
        </Routes>
      </div>
    </div>
  );
}
