import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../api/axios';

const Dashboard = () => {
  const [editingTask, setEditingTask] = useState(null);
  const { user, logout } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: '', description: '' });
  const [message, setMessage] = useState({ type: '', text: '' }); 

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const { data } = await api.get('/tasks');
      setTasks(data.data); 
    } catch (err) {
      showMessage('error', 'Failed to fetch tasks');
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/tasks', newTask);
      setTasks([data, ...tasks]); 
      setNewTask({ title: '', description: '' });
      showMessage('success', 'Task created successfully!');
    } catch (err) {
      showMessage('error', err.response?.data?.message || 'Failed to create task');
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await api.delete(`/tasks/${id}`);
      setTasks(tasks.filter(task => task._id !== id));
      showMessage('success', 'Task deleted successfully!');
    } catch (err) {
      showMessage('error', 'Failed to delete task');
    }
  };

  const handleUpdateTask = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.put(`/tasks/${editingTask._id}`, editingTask);
      setTasks(tasks.map(t => t._id === editingTask._id ? data : t));
      setEditingTask(null);
      showMessage('success', 'Task updated successfully!');
    } catch (err) {
      showMessage('error', 'Failed to update task');
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 3000); 
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Top Navbar */}
      <nav className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">T</div>
            <span className="text-xl font-bold text-gray-800 tracking-tight">TaskFlow</span>
        </div>
        <div className="flex items-center gap-6">
            <span className="text-sm text-gray-500 hidden md:block">
                Welcome, <span className="text-gray-900 font-medium">{user?.name}</span>
                <span className="text-xs bg-gray-100 px-2 py-1 rounded ml-2 font-mono">{user?.role}</span>
            </span>
            <button onClick={logout} className="text-sm font-medium text-red-500 hover:text-red-600 transition">Logout</button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-10">
        
        {/* Header & Alerts */}
        <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Your Workspace</h1>
            <p className="text-gray-500 mt-1">Manage, track, and organize your daily objectives.</p>
        </div>

        {message.text && (
            <div className={`p-4 rounded-lg mb-6 text-sm flex items-center gap-2 border ${message.type === 'error' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-green-50 text-green-600 border-green-100'}`}>
                {message.type === 'error' ? '⚠️' : '✅'} {message.text}
            </div>
        )}

        {/* Create Task Form */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-10">
            <form onSubmit={handleCreateTask} className="flex flex-col md:flex-row gap-4">
                <input 
                    type="text" placeholder="What needs to be done?" required
                    className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition"
                    value={newTask.title} onChange={(e) => setNewTask({ ...newTask, title: e.target.value })} 
                />
                <input 
                    type="text" placeholder="Description (Optional)" 
                    className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition"
                    value={newTask.description} onChange={(e) => setNewTask({ ...newTask, description: e.target.value })} 
                />
                <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition-all shadow-md hover:shadow-blue-500/30 whitespace-nowrap">
                    Add Task
                </button>
            </form>
        </div>

        {/* Tasks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tasks.length === 0 ? (
                <div className="col-span-full text-center py-20 text-gray-500 bg-white rounded-2xl border border-gray-100 border-dashed">
                    No tasks found. Get started by creating one above!
                </div>
            ) : tasks.map(task => (
                <div key={task._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col justify-between hover:shadow-md transition">
                    
                    {/* EDIT MODE */}
                    {editingTask?._id === task._id ? (
                        <form onSubmit={handleUpdateTask} className="flex flex-col gap-3 h-full">
                            <input 
                                type="text" value={editingTask.title} required
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none text-sm"
                                onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })} 
                            />
                            <textarea 
                                value={editingTask.description || ''} 
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none text-sm resize-none"
                                onChange={(e) => setEditingTask({ ...editingTask, description: e.target.value })} 
                            />
                            <select 
                                value={editingTask.status} 
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none text-sm bg-white"
                                onChange={(e) => setEditingTask({ ...editingTask, status: e.target.value })}
                            >
                                <option value="pending">Pending</option>
                                <option value="in-progress">In-Progress</option>
                                <option value="completed">Completed</option>
                            </select>
                            <div className="flex gap-2 mt-auto pt-4">
                                <button type="submit" className="flex-1 bg-green-500 text-white py-2 rounded-lg text-sm font-medium hover:bg-green-600 transition">Save</button>
                                <button type="button" onClick={() => setEditingTask(null)} className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition">Cancel</button>
                            </div>
                        </form>
                    ) : (
                        /* VIEW MODE */
                        <>
                            <div>
                                <div className="flex justify-between items-start mb-2">
                                    <h4 className="font-bold text-gray-900 text-lg leading-tight pr-2">{task.title}</h4>
                                    <span className={`px-2 py-1 rounded-md text-xs font-bold tracking-wide border ${
                                        task.status === 'completed' ? 'bg-green-50 text-green-700 border-green-200' :
                                        task.status === 'in-progress' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                                        'bg-gray-50 text-gray-600 border-gray-200'
                                    }`}>
                                        {task.status.toUpperCase()}
                                    </span>
                                </div>
                                <p className="text-gray-500 text-sm mb-6 line-clamp-3">{task.description || 'No description provided.'}</p>
                            </div>
                            <div className="flex gap-3 mt-auto pt-4 border-t border-gray-50">
                                <button onClick={() => setEditingTask(task)} className="flex-1 bg-gray-50 text-blue-600 py-2 rounded-lg text-sm font-medium hover:bg-blue-100 transition border border-gray-100">
                                    Edit
                                </button>
                                <button onClick={() => handleDeleteTask(task._id)} className="flex-1 bg-gray-50 text-red-600 py-2 rounded-lg text-sm font-medium hover:bg-red-50 transition border border-gray-100">
                                    Delete
                                </button>
                            </div>
                        </>
                    )}
                </div>
            ))}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;