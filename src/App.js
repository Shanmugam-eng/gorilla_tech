import React, { useEffect, useState } from 'react';

const fetchTasks = async () => {
  const response = await fetch(
    'https://nextjs-boilerplate-five-plum-29.vercel.app/api/tasks'
  );
  return response.json();
};

const fetchUserDetails = async (userId) => {
  const response = await fetch(
    `https://nextjs-boilerplate-five-plum-29.vercel.app/api/users/${userId}`
  );
  return response.json();
};

const App = () => {
  const [users, setUsers] = useState([]);
  const [sortBy, setSortBy] = useState('name');

  useEffect(() => {
    const getUsersWithCompletedTasks = async () => {
      try {
        const tasks = await fetchTasks();
        const userTasks = tasks.reduce((acc, task) => {
          console.log('acc', acc);
          if (!acc[task.userId]) acc[task.userId] = [];
          acc[task.userId].push(task);
          return acc;
        }, {});

        console.log('useTasks', userTasks);

        const completedUsers = Object.entries(userTasks)
          .filter(([_, userTasks]) => userTasks.every((task) => task.completed))
          .map(([userId]) => userId);

        const userDetails = await Promise.all(
          completedUsers.map(fetchUserDetails)
        );

        setUsers(userDetails);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    getUsersWithCompletedTasks();
  }, []);

  const sortedUsers = [...users].sort((a, b) => {
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    if (sortBy === 'id') return a.id - b.id;
    if (sortBy === 'email') return a.email.localeCompare(b.email);
    return 0;
  });

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Users with Completed Tasks</h1>

      <label className="mr-2 font-semibold">Sort By:</label>
      <select
        className="border p-1 rounded"
        onChange={(e) => setSortBy(e.target.value)}
        value={sortBy}
      >
        <option value="name">Name</option>
        <option value="id">ID</option>
        <option value="email">Email</option>
      </select>

      <table className="w-full mt-4 border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">ID</th>
            <th className="border p-2">Name</th>
            <th className="border p-2">Email</th>
          </tr>
        </thead>
        <tbody>
          {sortedUsers.length > 0 ? (
            sortedUsers.map((user) => (
              <tr key={user.id} className="text-center">
                <td className="border p-2">{user.id}</td>
                <td className="border p-2">{user.name}</td>
                <td className="border p-2">{user.email}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="border p-2 text-center">
                No users found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default App;
