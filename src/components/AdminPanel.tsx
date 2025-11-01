import React, { useState, useEffect } from 'react';
import { X, Users, CreditCard, Plus, Minus, Search, Calendar, Image as ImageIcon, Download, Eye, User as UserIcon } from 'lucide-react';
import { getAllUsers, updateUserCredits, getAllImageGenerations, User, ImageGeneration } from '../lib/supabase';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  isOpen,
  onClose,
  currentUser,
}) => {
  const [users, setUsers] = useState<User[]>([]);
  const [imageGenerations, setImageGenerations] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'users' | 'images'>('users');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedUserForManagement, setSelectedUserForManagement] = useState<User | null>(null);
  const [creditAmount, setCreditAmount] = useState('');
  const [previewImage, setPreviewImage] = useState<any | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [usersData, imagesData] = await Promise.all([
        getAllUsers(),
        getAllImageGenerations(),
      ]);
      // Ensure history is correctly mapped for each user
      const usersWithMappedHistory = usersData.map(user => ({
        ...user,
        history: user.history ? user.history.map((item: any) => ({
          id: item.id,
          user_id: item.user_id,
          image_type: item.image_type,
          title: item.title,
          content: item.content,
          image_data: item.image_data,
          credits_used: item.credits_used,
          created_at: item.created_at,
          style: item.style,
          colour: item.colour,
        })) : []
      }));
      setUsers(usersWithMappedHistory);
      setImageGenerations(imagesData);
    } catch (error) {
      console.error('Error loading admin data:', error);
    }
    setIsLoading(false);
  };

  const handleUpdateCredits = async (userId: string, newCredits: number) => {
    try {
      await updateUserCredits(userId, newCredits);
      setUsers(prev => prev.map(user => 
        user.id === userId ? { ...user, credits: newCredits } : user
      ));
      setSelectedUserForManagement(null);
      setCreditAmount('');
    } catch (error) {
      console.error('Error updating credits:', error);
    }
  };

  const calculateUserActivity = (history: ImageGeneration[]) => {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30));
    
    const recentGenerations = history.filter(item => new Date(item.created_at) > thirtyDaysAgo).length;
    
    return {
      totalGenerations: history.length,
      recentGenerations,
    };
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredImages = imageGenerations.filter(img =>
    img.users?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    img.users?.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    img.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    img.content?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 text-white relative flex-shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-white/20 mr-4">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Admin Panel</h2>
              <p className="text-purple-100">Manage users and monitor system activity</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-gray-50 border-b border-gray-200 flex-shrink-0">
          <div className="flex">
            <button
              onClick={() => setActiveTab('users')}
              className={`px-6 py-4 font-medium text-sm transition-colors ${
                activeTab === 'users'
                  ? 'text-purple-600 border-b-2 border-purple-600 bg-white'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Users className="w-4 h-4 mr-2 inline" />
              Users ({users.length})
            </button>
            <button
              onClick={() => setActiveTab('images')}
              className={`px-6 py-4 font-medium text-sm transition-colors ${
                activeTab === 'images'
                  ? 'text-purple-600 border-b-2 border-purple-600 bg-white'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <ImageIcon className="w-4 h-4 mr-2 inline" />
              Image Generations ({imageGenerations.length})
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-gray-200 flex-shrink-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder={activeTab === 'users' ? 'Search users...' : 'Search image generations...'}
            />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            </div>
          ) : activeTab === 'users' ? (
            <div className="space-y-4">
              {filteredUsers.map((user) => {
                const activity = calculateUserActivity(user.history || []);
                return (
                  <div key={user.id} className="bg-white rounded-xl p-4 border border-gray-200 hover:shadow-md transition-shadow">
                    <div className="grid grid-cols-12 gap-4 items-center">
                      <div className="col-span-12 md:col-span-5">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                            <UserIcon className="h-5 w-5 text-gray-500" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 flex items-center">
                              {user.name}
                              {user.is_admin && (
                                <span className="ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                                  Admin
                                </span>
                              )}
                            </div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </div>
                        </div>
                      </div>
                      <div className="col-span-6 md:col-span-2 text-sm text-gray-500">
                        Joined: {new Date(user.created_at).toLocaleDateString()}
                      </div>
                      <div className="col-span-6 md:col-span-2 text-center">
                        <span className="text-lg font-bold text-purple-600">{user.credits}</span>
                        <span className="text-sm text-gray-500"> credits</span>
                      </div>
                      <div className="col-span-12 md:col-span-3 text-right">
                        <button
                          onClick={() => setSelectedUserForManagement(user)}
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                        >
                          <Users className="w-4 h-4 mr-2" />
                          Manage User
                        </button>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <div>
                          <span className="font-semibold">Total Generations:</span> {activity.totalGenerations}
                        </div>
                        <div>
                          <span className="font-semibold">Last 30 Days:</span> {activity.recentGenerations}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredImages.map((img) => (
                <div key={img.id} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <div className="flex items-start space-x-4">
                    <img
                      src={img.image_data}
                      alt={img.title || 'Generated image'}
                      className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-semibold text-gray-900">
                          {img.title || `${img.image_type} Image`}
                        </h3>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          img.image_type === 'blog' 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-purple-100 text-purple-800'
                        }`}>
                          {img.image_type}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600 mb-2">
                        <div>User: {img.users?.name || 'N/A'} ({img.users?.email || 'N/A'})</div>
                        <div>Credits Used: {img.credits_used}</div>
                        <div>Created: {new Date(img.created_at).toLocaleString()}</div>
                        {img.style && <div>Style: {img.style}</div>}
                        {img.colour && <div>Colour: {img.colour}</div>}
                      </div>
                      {img.content && (
                        <p className="text-sm text-gray-600 line-clamp-2">{img.content}</p>
                      )}
                    </div>
                    <button
                      onClick={() => {
                        // Download image
                        const link = document.createElement('a');
                        link.href = `data:image/png;base64,${img.image_data}`;
                        link.download = `${img.title || 'image'}-${img.id}.png`;
                        link.click();
                      }}
                      className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Credit Management Modal */}
      {selectedUserForManagement && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-60 flex items-center justify-center p-4">
          <div className="bg-gray-50 rounded-3xl shadow-2xl w-full max-w-5xl max-h-[95vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-5 text-white relative flex-shrink-0">
              <button
                onClick={() => setSelectedUserForManagement(null)}
                className="absolute top-3 right-3 p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="flex items-center">
                <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-white/20 mr-4">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Manage User: {selectedUserForManagement.name}</h2>
                  <p className="text-purple-100 text-sm">View user details, history, and manage credits</p>
                </div>
              </div>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* User Details & Credit Management */}
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-2 space-y-3">
                    <h3 className="text-lg font-semibold text-gray-900">User Information</h3>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p><strong>Email:</strong> {selectedUserForManagement.email}</p>
                      <p><strong>Username:</strong> {selectedUserForManagement.username}</p>
                      {selectedUserForManagement.brand_name && <p><strong>Brand:</strong> {selectedUserForManagement.brand_name}</p>}
                      {selectedUserForManagement.website_url && <p><strong>Website:</strong> {selectedUserForManagement.website_url}</p>}
                      <p><strong>Joined:</strong> {new Date(selectedUserForManagement.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="text-center p-4 bg-gray-50 rounded-lg border">
                      <div className="text-3xl font-bold text-purple-600">{selectedUserForManagement.credits}</div>
                      <div className="text-sm text-gray-500">Current Credits</div>
                    </div>
                    <input
                      type="number"
                      value={creditAmount}
                      onChange={(e) => setCreditAmount(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Set new credit amount"
                    />
                    <button
                      onClick={() => {
                        const amount = parseInt(creditAmount);
                        if (!isNaN(amount) && amount >= 0) {
                          handleUpdateCredits(selectedUserForManagement.id, amount);
                        }
                      }}
                      disabled={!creditAmount || isNaN(parseInt(creditAmount))}
                      className="w-full py-2 px-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors"
                    >
                      Update Credits
                    </button>
                  </div>
                </div>
              </div>

              {/* User's Image Generation History */}
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Image Generation History</h3>
                {selectedUserForManagement.history && selectedUserForManagement.history.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {[...selectedUserForManagement.history].reverse().map((img) => (
                      <div key={img.id} className="bg-gray-50 rounded-lg border group relative overflow-hidden">
                        <img
                          src={img.image_data}
                          alt={img.title || 'Generated image'}
                          className="w-full h-32 object-cover"
                        />
                        <div className="p-3">
                          <p className="text-sm font-medium text-gray-800 truncate">{img.title || 'Untitled'}</p>
                          <p className="text-xs text-gray-500">{new Date(img.created_at).toLocaleDateString()}</p>
                        </div>
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => setPreviewImage(img)}
                            className="py-2 px-4 bg-white text-gray-800 rounded-lg text-sm font-semibold hover:bg-gray-200 transition-colors"
                          >
                            <Eye className="w-4 h-4 mr-2 inline"/>
                            View
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-gray-500 py-10">
                    <ImageIcon className="w-10 h-10 mx-auto mb-3 text-gray-400" />
                    <p>No image generations for this user yet.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Image Preview Modal */}
      {previewImage && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-70 flex items-center justify-center p-4" onClick={() => setPreviewImage(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex" onClick={(e) => e.stopPropagation()}>
            {/* Image */}
            <div className="w-2/3 bg-gray-900 flex items-center justify-center p-8">
              <img
                src={previewImage.image_data}
                alt={previewImage.title || 'Generated image'}
                className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
              />
            </div>

            {/* Details Panel */}
            <div className="w-1/3 bg-gray-50 flex flex-col">
              {/* Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 truncate">{previewImage.title || 'Image Preview'}</h2>
                    <p className="text-sm text-gray-500">Generated on {new Date(previewImage.created_at).toLocaleString()}</p>
                  </div>
                  <button
                    onClick={() => setPreviewImage(null)}
                    className="p-2 text-gray-400 hover:bg-gray-200 rounded-full"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <div>
                  <h3 className="text-md font-semibold text-gray-800 mb-3">Inputs</h3>
                  <div className="space-y-3 text-sm text-gray-600 bg-white rounded-xl p-4 border">
                    <div className="flex">
                      <strong className="w-1/4">Title:</strong>
                      <span>{previewImage.title || 'N/A'}</span>
                    </div>
                    <div className="flex">
                      <strong className="w-1/4">Content:</strong>
                      <span className="flex-1">{previewImage.content || 'N/A'}</span>
                    </div>
                    <div className="flex">
                      <strong className="w-1/4">Type:</strong>
                      <span>{previewImage.image_type}</span>
                    </div>
                    <div className="flex">
                      <strong className="w-1/4">Style:</strong>
                      <span>{previewImage.style || 'N/A'}</span>
                    </div>
                    <div className="flex">
                      <strong className="w-1/4">Colour:</strong>
                      <span>{previewImage.colour || 'N/A'}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Footer */}
              <div className="p-6 border-t border-gray-200">
                <button
                  onClick={() => {
                    const link = document.createElement('a');
                    link.href = previewImage.image_data;
                    link.download = `${previewImage.title || 'image'}-${previewImage.id}.png`;
                    link.click();
                  }}
                  className="w-full py-3 px-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center text-md font-semibold"
                >
                  <Download className="w-5 h-5 mr-2" />
                  Download Image
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};