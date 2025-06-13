import { useState , useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetAllUsersQuery,
          useDeleteUserMutation,
          useGetAllRequestsQuery,
          useApproveRequestMutation,
          useDeleteRequestMutation,
          useGetRestaurantsQuery,
          useGetAllBookingsQuery,
          useDeleteRestaurantMutation,
          useDeleteReviewMutation,
      } from '../../slices/apiSlice';
import { toast } from 'react-toastify';
import { Button } from "@material-tailwind/react";
import { Search, Filter, Star, Trash2, Eye, X, Calendar, MapPin, Clock, Phone, Edit3 } from 'lucide-react';


function Sidebar({ setView, currentView }) {
  const navigate = useNavigate();
  
  const menuItems = [
    { id: 'requests', label: 'Manager Requests', icon: '📋' },
    { id: 'users', label: 'Users', icon: '👥' },
    // { id: 'restaurants', label: 'Restaurant Management', icon: '🏪' },
    { id: 'stats', label: 'Restaurant Stats', icon: '📊' },
    // { id: 'settings', label: 'Settings', icon: '⚙️' },
  ];

  const handlegoback = () => {
    // You could add any logout logic here (clear tokens, etc.)
    navigate('/');
  };

  return (
    <div className="w-64 h-screen bg-gradient-to-b from-blue-800 to-indigo-900 text-white p-6 flex flex-col shadow-xl sticky top-0">
      <div className="mb-10">
        <h2 className="text-2xl font-bold text-center">Admin Dashboard</h2>
        <div className="mt-2 w-16 h-1 bg-blue-400 mx-auto rounded-full"></div>
      </div>
      
      <nav className="flex-1 space-y-2">
        {menuItems.map(item => (
          <button
            key={item.id}
            onClick={() => setView(item.id)}
            className={`flex items-center w-full px-4 py-3 rounded-lg text-md font-medium transition duration-200 ${
              currentView === item.id
                ? 'bg-blue-700 text-white shadow-lg'
                : 'text-blue-100 hover:bg-blue-700/50'
            }`}
          >
            <span className="mr-3 text-xl">{item.icon}</span>
            <span>{item.label}</span>
            {currentView === item.id && (
              <span className="ml-auto w-2 h-2 bg-blue-300 rounded-full"></span>
            )}
          </button>
        ))}
      </nav>
      
      <div className="pt-6 border-t border-blue-700/50">
        <div className="flex items-center px-4 py-3">
          <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
            AD
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium">Admin User</p>
            <p className="text-xs text-blue-300">admin@example.com</p>
          </div>
        </div>
        <button 
          onClick={handlegoback}
          className="mt-4 w-full px-4 py-2 text-sm text-blue-200 hover:text-white flex items-center justify-center rounded-lg hover:bg-blue-700/50 transition duration-200"
        >
          <span className="mr-2">⬅️</span> Go back
        </button>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color }) {
  const bgColorClass = `bg-${color}-100`;
  const textColorClass = `text-${color}-800`;
  const iconBgClass = `bg-${color}-200`;
  const iconTextClass = `text-${color}-600`;
  
  return (
    <div className={`p-6 rounded-xl shadow-md ${bgColorClass} flex items-center`}>
      <div className={`w-12 h-12 rounded-lg ${iconBgClass} flex items-center justify-center mr-4`}>
        <span className={`text-2xl ${iconTextClass}`}>{icon}</span>
      </div>
      <div>
        <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
        <p className={`text-2xl font-bold ${textColorClass}`}>{value}</p>
      </div>
    </div>
  );
}

function ManagerRequests() {
  const { data: requests = [], isLoading, isError, refetch } = useGetAllRequestsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  
  const [approveRequest] = useApproveRequestMutation();
  const [deleteManagerRequest] = useDeleteRequestMutation();
  
  const handleApprove = async (id) => {
    try {
      await approveRequest(id).unwrap();
     
      console.log('Approved successfully');
      toast.success("Manager registred successfully"); refetch();
    } catch (err) {
      console.error('Error approving request:', err);
    }
  };
  const handleDelete = async (id) => {
    try {
      await deleteManagerRequest(id).unwrap();
      toast.success('Request deleted successfully');refetch();
      // Optionally re-fetch list if you're not using cache invalidation
    } catch (error) {
      console.error('Error deleting request:', error);
      toast.error('Failed to delete request');
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading requests.</div>;
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-semibold text-gray-800">Manager Requests</h3>
        <div className="text-sm text-gray-500">{requests.length} pending requests</div>
      </div>

      {requests.length > 0 ? (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {requests.map((request) => (
                  <tr key={request._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{request.fullName}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{request.email}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{request.status}</td>
                    <td className="px-6 py-4 text-right text-sm font-medium">
                    <Button
                          size="sm"
                          onClick={() => handleApprove(request._id)}
                          disabled={request.status === 'approved'}
                          className={`${
                            request.status === 'approved'
                              ? 'bg-gray-300 text-gray-700 cursor-not-allowed'
                              : 'bg-green-500 hover:bg-green-600 text-white'
                          }`}>  Approve
                              
                    </Button>


                      <button
                        onClick={() => handleDelete(request._id)}
                        className="text-red-600 hover:text-red-900 bg-red-100 hover:bg-red-200 px-3 py-1 rounded-md"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <div className="text-gray-400 text-6xl mb-4">📋</div>
          <h4 className="text-xl font-medium text-gray-800 mb-2">No Pending Requests</h4>
          <p className="text-gray-500">All manager requests have been handled.</p>
        </div>
      )}
    </div>
  );
}



// Confirmation Modal Component
const DeleteUserConfirmationModal = ({ isOpen, onClose, onConfirm, user }) => {
  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="p-6">
          <div className="flex items-center mb-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">Delete User</h3>
            </div>
          </div>
          
          <div className="mb-6">
            <p className="text-gray-600 mb-4">
              Are you sure you want to permanently delete this user? This action cannot be undone.
            </p>
            
            {/* User Info Preview */}
            <div className="bg-gray-50 rounded-lg p-4 border">
              <div className="flex items-center">
                <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium overflow-hidden">
                  {user.avatar ? (
                    <img src={user.avatar} alt="avatar" className="h-12 w-12 object-cover" />
                  ) : (
                    user.fullName?.split(' ').map(n => n[0]).join('').toUpperCase()
                  )}
                </div>
                <div className="ml-3">
                  <div className="text-sm font-medium text-gray-900">{user.fullName}</div>
                  <div className="text-sm text-gray-500">{user.email}</div>
                  <div className="text-xs text-gray-400">Role: {user.role}</div>
                </div>
              </div>
            </div>
            
            <div className="mt-4 text-sm text-gray-500">
              <strong>Warning:</strong> All user data, bookings, and associated records will be permanently removed.
            </div>
          </div>
          
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 bg-gray-200 hover:bg-gray-300 rounded-md transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors duration-200"
            >
              Delete User
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

function Users() {
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteConfirmation, setDeleteConfirmation] = useState({
    isOpen: false,
    user: null
  });

  const { data: users = [], isLoading, isError } = useGetAllUsersQuery();
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();

  // Show delete confirmation modal
  const handleDeleteConfirmation = (user) => {
    setDeleteConfirmation({
      isOpen: true,
      user: user
    });
  };

  // Close confirmation modal
  const closeDeleteConfirmation = () => {
    setDeleteConfirmation({
      isOpen: false,
      user: null
    });
  };

  // Actual delete function (called after confirmation)
  const confirmDeleteUser = async () => {
    if (!deleteConfirmation.user) return;

    try {
      await deleteUser(deleteConfirmation.user._id).unwrap();
      toast.success(`User   deleted successfully`, {
        position: "top-right"
      });
      closeDeleteConfirmation();
    } catch (error) {
      console.error('Delete user error:', error);
      toast.error('Failed to delete user. Please try again.', {
        position: "top-right"
      });
      closeDeleteConfirmation();
    }
  };

  // // Temporary UI-only ban logic (commented out until backend is ready)
  // const [bannedUsers, setBannedUsers] = useState([]);

  // const toggleBan = (id) => {
  //   setBannedUsers(prev =>
  //     prev.includes(id) ? prev.filter(uid => uid !== id) : [...prev, id]
  //   );
  // };

  // const getStatus = (userId) =>
  //   bannedUsers.includes(userId) ? 'Banned' : 'Active';

  const filteredUsers = users.filter(user =>
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.fullName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return 'bg-purple-100 text-purple-800';
      case 'manager': return 'bg-blue-100 text-blue-800';
      case 'user': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      // case 'Banned': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) return <div className="text-center py-10">Loading users...</div>;
  if (isError) return <div className="text-center text-red-500 py-10">Failed to load users.</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-semibold text-gray-800">Manage Users</h3>
        <div className="text-sm text-gray-500">{users.length} users total</div>
      </div>

      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <span className="text-gray-400">🔍</span>
        </div>
        <input
          type="text"
          className="block w-full p-2 pl-10 text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500"
          placeholder="Search users by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredUsers.map((user) => (
              <tr key={user._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium overflow-hidden">
                      {user.avatar ? (
                        <img src={user.avatar} alt="avatar" className="h-10 w-10 object-cover" />
                      ) : (
                        user.fullName?.split(' ').map(n => n[0]).join('').toUpperCase()
                      )}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{user.fullName}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-medium rounded-full ${getRoleColor(user.role)}`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-medium rounded-full ${getStatusColor('Active')}`}>
                    Active
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  {/* <button
                    onClick={() => toggleBan(user._id)}
                    className="text-red-600 hover:text-red-900 bg-red-100 hover:bg-red-200 px-3 py-1 rounded-md mr-2 transition-colors duration-200"
                  >
                    Ban
                  </button> */}
                  <button
                    onClick={() => handleDeleteConfirmation(user)}
                    disabled={isDeleting}
                    className="text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isDeleting ? 'Deleting...' : 'Delete'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredUsers.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            {searchTerm ? 'No users found matching your search.' : 'No users found.'}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteUserConfirmationModal
        isOpen={deleteConfirmation.isOpen}
        onClose={closeDeleteConfirmation}
        onConfirm={confirmDeleteUser}
        user={deleteConfirmation.user}
      />
    </div>
  );
}



function RestaurantStats() {
  const { data: restaurantsData, isLoading: restaurantsLoading, error: restaurantsError } = useGetRestaurantsQuery();
  const { data: bookingsData, isLoading: bookingsLoading, error: bookingsError } = useGetAllBookingsQuery();
  
  const [stats, setStats] = useState({
    totalRestaurants: 0,
    totalReservations: 0,
    activeRestaurants: 0,
    averageRating: 0
  });
  const [chartData, setChartData] = useState([]);
  const [topRestaurants, setTopRestaurants] = useState([]);

  useEffect(() => {
    if (restaurantsData?.data && bookingsData?.data) {
      const restaurants = restaurantsData.data;
      const bookings = bookingsData.data || [];
      
      // Calculate stats
      const totalRestaurants = restaurants.length;
      const activeRestaurants = restaurants.filter(r => r.isActive).length;
      const totalReservations = bookings.length;
      
      const ratingsSum = restaurants.reduce((sum, r) => sum + (r.rating || 0), 0);
      const averageRating = totalRestaurants > 0 
        ? parseFloat((ratingsSum / totalRestaurants).toFixed(1)) 
        : 0;
      
      setStats({
        totalRestaurants,
        totalReservations,
        activeRestaurants,
        averageRating
      });

      // Create chart data with actual restaurants and their booking counts
      const restaurantBookings = restaurants.map(restaurant => {
        const restaurantId = restaurant._id;
        const bookingsCount = bookings.filter(booking => 
          booking.restaurant?.id === restaurantId || booking.restaurantId === restaurantId
        ).length;
        
        return {
          name: restaurant.name,
          bookings: bookingsCount
        };
      });
      
      setChartData(restaurantBookings);
      
      // Calculate top restaurants based on booking count
      const restaurantBookingCount = restaurants.map(restaurant => {
        const restaurantId = restaurant._id;
        const bookingsCount = bookings.filter(booking => 
          booking.restaurant?.id === restaurantId || booking.restaurantId === restaurantId
        ).length;
        
        return {
          ...restaurant,
          bookingsCount
        };
      });
      
      const sortedRestaurants = [...restaurantBookingCount]
        .sort((a, b) => b.bookingsCount - a.bookingsCount)
        .slice(0, 5)
        .map(r => ({
          name: r.name,
          reservations: r.bookingsCount,
          rating: r.rating || 0
        }));
      
      setTopRestaurants(sortedRestaurants);
    }
  }, [restaurantsData, bookingsData]);

  if (restaurantsLoading || bookingsLoading) {
    return <div className="p-8 text-center">Loading restaurant statistics...</div>;
  }

  if (restaurantsError || bookingsError) {
    return <div className="p-8 text-center text-red-500">Error loading data</div>;
  }

  // Find max bookings for chart scaling
  const maxBookings = Math.max(...chartData.map(data => data.bookings), 1);

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-semibold text-gray-800">Restaurant Statistics</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Restaurants" value={stats.totalRestaurants} icon="🏢" color="blue" />
        <StatCard title="Total Reservations" value={stats.totalReservations} icon="📅" color="green" />
        {/* <StatCard title="Active Restaurants" value={stats.activeRestaurants} icon="✅" color="indigo" /> */}
        <StatCard title="Average Rating" value={stats.averageRating} icon="⭐" color="yellow" />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h4 className="text-lg font-medium text-gray-800 mb-4">Restaurant Bookings</h4>
          <div className="h-64 flex items-end justify-around space-x-2">
            {chartData.map((data) => (
              <div key={data.name} className="flex flex-col items-center flex-1 min-w-0">
                <div className="text-xs font-medium text-gray-700 mb-1">{data.bookings}</div>
                <div
                  className="bg-blue-500 rounded-t-lg w-full transition-all hover:bg-blue-600 min-h-2"
                  style={{ height: `${Math.max((data.bookings / maxBookings) * 180, 8)}px` }}
                ></div>
                <div className="text-xs font-medium text-gray-500 mt-2 text-center truncate w-full" title={data.name}>
                  {data.name}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h4 className="text-lg font-medium text-gray-800 mb-4">Top Performing Restaurants</h4>
          {topRestaurants.length > 0 ? (
            <div className="space-y-4">
              {topRestaurants.map((restaurant, index) => (
                <div key={index} className="flex items-center justify-between py-2">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{restaurant.name}</div>
                    <div className="text-xs text-gray-500">{restaurant.reservations} reservations</div>
                  </div>
                  <div className="flex items-center">
                    <span className="text-yellow-500 mr-1">⭐</span>
                    <span className="text-sm text-gray-700">{restaurant.rating.toFixed(1)}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 py-4">No restaurant data available</div>
          )}
        </div>
      </div>
    </div>
  );
}


function RestaurantManagement() {
  // API hooks
  const { data: restaurantsData, isLoading: restaurantsLoading, error: restaurantsError, refetch } = useGetRestaurantsQuery();
  const [deleteRestaurant] = useDeleteRestaurantMutation();
  const [deleteReview] = useDeleteReviewMutation();

  // Local state
  const [restaurants, setRestaurants] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [restaurantToDelete, setRestaurantToDelete] = useState(null);
  const [reviewToDelete, setReviewToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Update restaurants when data is fetched
  useEffect(() => {
    if (restaurantsData?.data) {
      setRestaurants(restaurantsData.data);
      setFilteredRestaurants(restaurantsData.data);
    }
  }, [restaurantsData]);

  // Filter and search functionality
  useEffect(() => {
    let filtered = [...restaurants];
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(restaurant =>
        restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        restaurant.cuisine.toLowerCase().includes(searchTerm.toLowerCase()) ||
        restaurant.location?.address?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply status filter - check if restaurant has isActive property
    if (filterStatus !== 'all') {
      filtered = filtered.filter(restaurant => {
        // If isActive property doesn't exist, consider it active by default
        const isActive = restaurant.isActive !== undefined ? restaurant.isActive : true;
        return filterStatus === 'active' ? isActive : !isActive;
      });
    }
    
    setFilteredRestaurants(filtered);
  }, [restaurants, searchTerm, filterStatus]);

  const handleViewDetails = (restaurant) => {
    setSelectedRestaurant(restaurant);
    setShowDetailsModal(true);
  };

  const handleDeleteRestaurant = (restaurant) => {
    setRestaurantToDelete(restaurant);
    setReviewToDelete(null);
    setShowDeleteModal(true);
  };

  const handleDeleteReview = (restaurant, review) => {
    setRestaurantToDelete(restaurant);
    setReviewToDelete(review);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    setIsDeleting(true);
    try {
      if (reviewToDelete) {
        // Delete review
        await deleteReview({
          restaurantId: restaurantToDelete._id,
          reviewId: reviewToDelete._id
        }).unwrap();
        
        toast.success("Review deleted successfully!");
        
        // Refetch data to get updated restaurant info
        await refetch();
        
        // Update selected restaurant if it's the one being viewed
        if (selectedRestaurant && selectedRestaurant._id === restaurantToDelete._id) {
          const updatedRestaurantData = await refetch();
          const updatedRestaurant = updatedRestaurantData.data?.data?.find(r => r._id === restaurantToDelete._id);
          if (updatedRestaurant) {
            setSelectedRestaurant(updatedRestaurant);
          }
        }
      } else {
        // Delete restaurant
        await deleteRestaurant(restaurantToDelete._id).unwrap();
        
        toast.success("Restaurant deleted successfully!");
        
        // Refetch data
        await refetch();
        
        // Close details modal if the deleted restaurant was being viewed
        if (selectedRestaurant && selectedRestaurant._id === restaurantToDelete._id) {
          setShowDetailsModal(false);
          setSelectedRestaurant(null);
        }
      }
    } catch (error) {
      console.error('Delete failed:', error);
      toast.error(error.data?.message || "Delete failed. Please try again.");
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
      setRestaurantToDelete(null);
      setReviewToDelete(null);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Date unavailable';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getRestaurantRating = (restaurant) => {
    if (restaurant.rating) return restaurant.rating;
    if (restaurant.reviews && restaurant.reviews.length > 0) {
      const avgRating = restaurant.reviews.reduce((sum, review) => sum + review.rating, 0) / restaurant.reviews.length;
      return avgRating;
    }
    return 0;
  };

  const getRestaurantStatus = (restaurant) => {
    // If isActive property doesn't exist, consider it active by default
    return restaurant.isActive !== undefined ? restaurant.isActive : true;
  };

  if (restaurantsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading restaurants...</p>
        </div>
      </div>
    );
  }

  if (restaurantsError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <X className="h-12 w-12 mx-auto" />
          </div>
          <p className="text-red-600">Error loading restaurants: {restaurantsError.message}</p>
          <button 
            onClick={() => refetch()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Restaurant Management</h1>
        <div className="text-sm text-gray-600 bg-white px-4 py-2 rounded-lg shadow">
          Total: {filteredRestaurants.length} restaurants
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, cuisine, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
            >
              <option value="all">All Status</option>
              <option value="active">Active Only</option>
              <option value="inactive">Inactive Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* Restaurants Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRestaurants.length > 0 ? (
          filteredRestaurants.map((restaurant) => (
            <div key={restaurant._id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative h-48">
                <img
                  src={restaurant.images && restaurant.images.length > 0 
                    ? restaurant.images[0] 
                    : 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400'
                  }
                  alt={restaurant.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4">
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                    getRestaurantStatus(restaurant)
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {getRestaurantStatus(restaurant) ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-semibold text-gray-800 line-clamp-1">{restaurant.name}</h3>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="ml-1 text-sm text-gray-600">{getRestaurantRating(restaurant).toFixed(1)}</span>
                  </div>
                </div>
                
                <p className="text-gray-600 text-sm mb-2">{restaurant.cuisine}</p>
                <p className="text-gray-500 text-sm mb-4 line-clamp-2">{restaurant.description || 'No description available'}</p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span className="line-clamp-1">{restaurant.location?.address || 'Address not provided'}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                   
                    <span>Capacity: {restaurant.capacity || 'Not specified'}</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">
                    {restaurant.reviews ? restaurant.reviews.length : 0} review{restaurant.reviews && restaurant.reviews.length !== 1 ? 's' : ''}
                  </span>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleViewDetails(restaurant)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="View Details"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteRestaurant(restaurant)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete Restaurant"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="h-16 w-16 mx-auto" />
            </div>
            <p className="text-gray-500 text-lg">No restaurants found matching your criteria</p>
          </div>
        )}
      </div>

      {/* Restaurant Details Modal */}
      {showDetailsModal && selectedRestaurant && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">{selectedRestaurant.name}</h2>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Restaurant Images */}
              {selectedRestaurant.images && selectedRestaurant.images.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedRestaurant.images.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`${selectedRestaurant.name} ${index + 1}`}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  ))}
                </div>
              )}

              {/* Restaurant Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">Restaurant Information</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                        <span>{selectedRestaurant.location?.address || 'Address not provided'}</span>
                      </div>
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 mr-2 text-gray-400" />
                        <span>{selectedRestaurant.contact || 'Contact not provided'}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-gray-400" />
                        <span>{selectedRestaurant.openingHours || 'Hours not specified'}</span>
                      </div>
                      <div className="flex items-center">
                        
                        <span>Capacity: {selectedRestaurant.capacity || 'Not specified'}</span>
                      </div>
                      <p className="text-gray-600"><strong>Cuisine:</strong> {selectedRestaurant.cuisine}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">Description</h3>
                    <p className="text-sm text-gray-600">{selectedRestaurant.description || 'No description available'}</p>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">
                    Menu Items ({selectedRestaurant.menuItems ? selectedRestaurant.menuItems.length : 0})
                  </h3>
                  <div className="max-h-48 overflow-y-auto space-y-2">
                    {selectedRestaurant.menuItems && selectedRestaurant.menuItems.length > 0 ? (
                      selectedRestaurant.menuItems.map((item, index) => (
                        <div key={index} className="p-3 bg-gray-50 rounded-lg">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium text-gray-800">{item.name}</h4>
                              <p className="text-xs text-gray-500">{item.category}</p>
                              {item.description && (
                                <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                              )}
                            </div>
                            <span className="font-semibold text-green-600">${item.price}</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 italic">No menu items available</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Reviews Section */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold text-gray-800">
                    Reviews ({selectedRestaurant.reviews ? selectedRestaurant.reviews.length : 0})
                  </h3>
                  <div className="flex items-center">
                    <Star className="h-5 w-5 text-yellow-400 fill-current" />
                    <span className="ml-1 font-medium">{getRestaurantRating(selectedRestaurant).toFixed(1)}</span>
                  </div>
                </div>
                
                <div className="max-h-96 overflow-y-auto space-y-4">
                  {selectedRestaurant.reviews && selectedRestaurant.reviews.length > 0 ? (
                    selectedRestaurant.reviews.map((review) => (
                      <div key={review._id} className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex items-center">
                            <img
                              src={review.userAvatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100'}
                              alt={review.userName}
                              className="w-10 h-10 rounded-full mr-3 object-cover"
                            />
                            <div>
                              <p className="font-medium text-gray-800">{review.userName || 'Anonymous'}</p>
                              <div className="flex items-center mt-1">
                                <div className="flex text-yellow-400">
                                  {[...Array(5)].map((_, i) => (
                                    <Star key={i} className={`h-3 w-3 ${i < review.rating ? 'fill-current' : ''}`} />
                                  ))}
                                </div>
                                <span className="ml-2 text-xs text-gray-500">
                                  <Calendar className="h-3 w-3 inline mr-1" />
                                  {formatDate(review.date)}
                                </span>
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={() => handleDeleteReview(selectedRestaurant, review)}
                            className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                            title="Delete Review"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                        <p className="text-gray-700 text-sm">{review.comment}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 italic text-center py-8">No reviews yet</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">
              Confirm Delete
            </h4>
            <p className="text-gray-700 mb-6">
              {reviewToDelete ? (
                <>Are you sure you want to delete this review by <strong>{reviewToDelete.userName}</strong>?</>
              ) : (
                <>Are you sure you want to delete <strong>{restaurantToDelete?.name}</strong>? This will also delete all associated reviews and menu items.</>
              )}
              <br />
              <span className="text-red-600 font-medium">This action cannot be undone.</span>
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={isDeleting}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={isDeleting}
                className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center"
              >
                {isDeleting && (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                )}
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Update your AdminDashboard component to include the new view
export default function AdminDashboard() {
  const [view, setView] = useState('requests');

  let Content;
  if (view === 'requests') Content = <ManagerRequests />;
  else if (view === 'users') Content = <Users />;
  else if (view === 'stats') Content = <RestaurantStats />;
  else if (view === 'restaurants') Content = <RestaurantManagement />;

  return (
    
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar setView={setView} currentView={view} />
      <div className="flex-1 p-8">
        {Content}
      </div>
    </div>
  );
}