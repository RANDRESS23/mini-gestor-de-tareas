import React from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import Login from '../pages/Login';
import Register from '../pages/Register';
import TasksList from '../pages/TasksList';
import TaskCreate from '../pages/TaskCreate';
import TaskEdit from '../pages/TaskEdit';

const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '/',
    element: <Navigate to="/tasks" replace />,
  },
  {
    path: '/tasks',
    element: (
      <ProtectedRoute>
        <TasksList />
      </ProtectedRoute>
    ),
  },
  {
    path: '/tasks/create',
    element: (
      <ProtectedRoute>
        <TaskCreate />
      </ProtectedRoute>
    ),
  },
  {
    path: '/tasks/:id/edit',
    element: (
      <ProtectedRoute>
        <TaskEdit />
      </ProtectedRoute>
    ),
  },
]);

const AppRouter: React.FC = () => {
  return <RouterProvider router={router} />;
};

export default AppRouter;
