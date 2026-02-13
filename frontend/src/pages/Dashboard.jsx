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
    <div style={{ maxWidth: '600px', margin: '20px auto', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Welcome, {user?.name} ({user?.role})</h2>
        <button onClick={logout} style={{ padding: '5px 10px', cursor: 'pointer' }}>Logout</button>
      </div>

      {message.text && (
        <div style={{ padding: '10px', marginBottom: '15px', backgroundColor: message.type === 'error' ? '#ffcccc' : '#ccffcc', color: message.type === 'error' ? 'red' : 'green' }}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleCreateTask} style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <input 
          type="text" placeholder="Task Title" required
          value={newTask.title} onChange={(e) => setNewTask({ ...newTask, title: e.target.value })} 
        />
        <input 
          type="text" placeholder="Description (Optional)" 
          value={newTask.description} onChange={(e) => setNewTask({ ...newTask, description: e.target.value })} 
        />
        <button type="submit" style={{ padding: '5px 10px', cursor: 'pointer' }}>Add Task</button>
      </form>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {tasks.length === 0 ? <p>No tasks found. Create one above!</p> : tasks.map(task => (
          <div key={task._id} style={{ border: '1px solid #ccc', padding: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            
            {/* If this task is being edited, show an edit form */}
            {editingTask?._id === task._id ? (
              <form onSubmit={handleUpdateTask} style={{ display: 'flex', gap: '10px', width: '100%' }}>
                <input 
                  type="text" value={editingTask.title} required
                  onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })} 
                />
                <select 
                  value={editingTask.status} 
                  onChange={(e) => setEditingTask({ ...editingTask, status: e.target.value })}
                >
                  <option value="pending">Pending</option>
                  <option value="in-progress">In-Progress</option>
                  <option value="completed">Completed</option>
                </select>
                <button type="submit" style={{ cursor: 'pointer', color: 'green' }}>Save</button>
                <button type="button" onClick={() => setEditingTask(null)} style={{ cursor: 'pointer' }}>Cancel</button>
              </form>
            ) : (
              <>
                {/* Standard Task Display */}
                <div>
                  <h4 style={{ margin: '0 0 5px 0' }}>{task.title}</h4>
                  <p style={{ margin: 0, fontSize: '14px', color: '#555' }}>{task.description}</p>
                  <small>Status: <strong>{task.status}</strong></small>
                </div>
                <div>
                  <button onClick={() => setEditingTask(task)} style={{ cursor: 'pointer', marginRight: '10px' }}>Edit</button>
                  <button onClick={() => handleDeleteTask(task._id)} style={{ color: 'red', cursor: 'pointer' }}>Delete</button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;