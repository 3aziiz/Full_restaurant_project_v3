import { useState , useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetAllUsersQuery,
          useDeleteUserMutation,
          useGetAllRequestsQuery,
          useApproveRequestMutation,
          useDeleteRequestMutation,
          useGetRestaurantsQuery,
          useGetAllBookingsQuery,
      } from '../../slices/apiSlice';
import { toast } from 'react-toastify';
import { Button } from "@material-tailwind/react";



function Sidebar({ setView, currentView }) {
  const navigate = useNavigate();
  
  const menuItems = [
    { id: 'requests', label: 'Manager Requests', icon: '📋' },
    { id: 'users', label: 'Users', icon: '👥' },
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



function Users() {
  const [searchTerm, setSearchTerm] = useState('');

  const { data: users = [], isLoading, isError } = useGetAllUsersQuery();
  const [deleteUser] = useDeleteUserMutation();

  const handleDelete = async (id) => {
    try {
      await deleteUser(id).unwrap();
      toast.success('User deleted successfully');
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete user');
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
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
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
                    onClick={() => handleDelete(user._id)}
                    className="text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-md transition-colors duration-200"
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
        <StatCard title="Active Restaurants" value={stats.activeRestaurants} icon="✅" color="indigo" />
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
export default function AdminDashboard() {
  const [view, setView] = useState('requests');

  let Content;
  if (view === 'requests') Content = <ManagerRequests />;
  else if (view === 'users') Content = <Users />;
  else if (view === 'stats') Content = <RestaurantStats />;
 

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar setView={setView} currentView={view} />
      <div className="flex-1 p-8">
        {Content}
      </div>
    </div>
  );
}