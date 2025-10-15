"use client";
import { useState } from 'react';
import { db, storage } from '@/firebase';
import { collection, getDocs, writeBatch, doc } from 'firebase/firestore';
import { ref, listAll, deleteObject } from 'firebase/storage';

const NukePage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [nuking, setNuking] = useState(false);
  const [progress, setProgress] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === 'admin@gmail.com' && password === 'admin321') {
      setLoggedIn(true);
    } else {
      alert('Invalid credentials');
    }
  };

  const handleNuke = async () => {
    if (!window.confirm('Are you absolutely sure you want to delete all data? This action cannot be undone.')) {
      return;
    }

    setNuking(true);
    setProgress('Starting nuke...');

    try {
      // Nuke Firestore
      setProgress('Nuking Firestore...');
      const collections = ['products', 'stores', 'users', 'reviews', 'orders', 'buyers', 'messages', 'notifications', 'storeNames'];
      for (const col of collections) {
        setProgress(`Deleting collection: ${col}`);
        const querySnapshot = await getDocs(collection(db, col));
        const batch = writeBatch(db);
        querySnapshot.forEach((doc) => {
          batch.delete(doc.ref);
        });
        await batch.commit();
      }

      // Nuke Storage
      setProgress('Nuking Storage...');
      const storageRef = ref(storage);
      const res = await listAll(storageRef);
      
      const deletePromises = res.prefixes.map(folderRef => listAll(folderRef).then(folderRes => {
        return Promise.all(folderRes.items.map(itemRef => deleteObject(itemRef)));
      }));

      await Promise.all(deletePromises);

      // Nuke Authentication
      setProgress('Nuking Authentication...');
      const authResponse = await fetch('/api/nuke-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!authResponse.ok) {
        const errorData = await authResponse.json();
        throw new Error(errorData.message || 'Failed to nuke authentication');
      }

      setProgress('Nuke complete!');
      alert('All data has been deleted.');
    } catch (error) {
      console.error('Error nuking database:', error);
      setProgress(`Error: ${(error as Error).message}`);
      alert('An error occurred during the nuke operation. Check the console for details.');
    } finally {
      setNuking(false);
    }
  };

  if (!loggedIn) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-sm">
          <h1 className="text-2xl font-bold text-white mb-6 text-center">Admin Login</h1>
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block text-gray-300 mb-2" htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-300 mb-2" htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-sm text-center">
        <h1 className="text-2xl font-bold text-white mb-6">Nuke Database</h1>
        <p className="text-gray-300 mb-6">This will delete all data from Firestore and Storage. This action is irreversible.</p>
        <button
          onClick={handleNuke}
          disabled={nuking}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {nuking ? 'Nuking...' : 'NUKE DATABASE'}
        </button>
        {nuking && <p className="text-gray-400 mt-4">{progress}</p>}
      </div>
    </div>
  );
};

export default NukePage;