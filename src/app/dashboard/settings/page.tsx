'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Settings() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [image, setImage] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        setImage(data.url);
      } else {
        setError(data.error || 'Failed to upload image');
      }
    } catch (err) {
      setError('An error occurred while uploading');
    }
    setUploading(false);
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, image, currentPassword, newPassword }),
      });
      const data = await res.json();
      
      if (!res.ok) {
        setError(data.error || 'Failed to update profile');
      } else {
        setMessage('Profile updated successfully!');
        router.refresh();
      }
    } catch (err: any) {
      setError('An error occurred');
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/');
      router.refresh();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      <h1 className="text-3xl font-bold mb-8">Profile Settings</h1>

      <div className="bg-gray-950/50 border border-gray-800 rounded-2xl p-8 mb-8">
        <h2 className="text-xl font-semibold mb-6">Update Profile</h2>
        
        {message && <div className="mb-6 p-4 bg-green-500/10 border border-green-500/50 rounded-lg text-green-400">{message}</div>}
        {error && <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400">{error}</div>}

        <form onSubmit={handleUpdateProfile} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Profile Picture</label>
            <div className="flex items-center gap-4">
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleImageUpload} 
                disabled={uploading}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-500/10 file:text-indigo-400 hover:file:bg-indigo-500/20"
              />
              {uploading && <span className="text-sm text-gray-400">Uploading...</span>}
            </div>
            {image && (
              <img src={image} alt="Avatar Preview" className="mt-4 w-20 h-20 object-cover rounded-full border border-gray-800" />
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Display Name</label>
            <input 
              type="text" 
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Leave blank to keep unchanged"
              className="w-full px-4 py-2 rounded-lg bg-gray-900 border border-gray-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-colors text-white"
            />
          </div>

          <div className="pt-4 border-t border-gray-800">
            <h3 className="text-lg font-medium mb-4">Change Password</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Current Password</label>
                <input 
                  type="password" 
                  value={currentPassword}
                  onChange={e => setCurrentPassword(e.target.value)}
                  placeholder="Required if setting a new password"
                  className="w-full px-4 py-2 rounded-lg bg-gray-900 border border-gray-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-colors text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">New Password</label>
                <input 
                  type="password" 
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  placeholder="Leave blank to keep current password"
                  className="w-full px-4 py-2 rounded-lg bg-gray-900 border border-gray-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-colors text-white"
                />
              </div>
            </div>
          </div>
          
          <button 
            type="submit" 
            disabled={loading || (!name && !image && !newPassword)}
            className="bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>

      <div className="bg-red-950/20 border border-red-900/50 rounded-2xl p-8">
        <h2 className="text-xl font-semibold mb-2 text-red-400">Account Actions</h2>
        <p className="text-sm text-gray-500 mb-6">Log out of your account on this device.</p>
        
        <button 
          onClick={handleLogout}
          className="bg-red-500/10 hover:bg-red-500/20 text-red-400 px-6 py-2 rounded-lg font-medium transition-colors border border-red-500/20"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}
