import Spinner from 'components/Spinner'
import MainLayout from 'layouts/MainLayout'
import About from 'pages/About'
import AddStudent from 'pages/AddStudent'
import Dashboard from 'pages/Dashboard'
import NotFound from 'pages/NotFound'
import Students from 'pages/Students'
import Test from 'pages/TestABC'
import TestUseMutation from 'pages/UseMutation'
import TestUseQuery from 'pages/UseQuery'
import { useRoutes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useIsFetching, useIsMutating } from '@tanstack/react-query'
import Project from 'pages/TestABC'

function App() {
  const elements = useRoutes([
    {
      path: '/',
      element: <Dashboard />
    },
    {
      path: '/students',
      element: <Students />
    },
    {
      path: '/students/:id',
      element: <AddStudent />
    },
    {
      path: '/students/add',
      element: <AddStudent />
    },
    {
      path: '/about',
      element: <About />
    },
    {
      path: '/project',
      element: <Project />
    },
    {
      path: '/TestABC',
      element: <Test />
    },
    {
      path: '/TestUseQuery',
      element: <TestUseQuery />
    },
    {
      path: '/TestUseMutation',
      element: <TestUseMutation />
    },
    {
      path: '*',
      element: <NotFound />
    }
  ])
  const isFetching = useIsFetching()
  console.log('🚀 ~ file: App.tsx:41 ~ App ~ isFetching:', isFetching)
  const isMutating = useIsMutating()
  console.log('🚀 ~ file: App.tsx:43 ~ App ~ isMutating:', isMutating)

  return (
    <div className='App'>
      {isFetching + isMutating !== 0 && <Spinner />}
      <ToastContainer />
      <MainLayout>{elements}</MainLayout>
    </div>
  )
}

export default App
