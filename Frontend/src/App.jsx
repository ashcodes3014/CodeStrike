import './App.css'
import {Navigate, Route,Routes} from "react-router";
import Home from "./Pages/Homepage";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup"
import AdminPanel from './Pages/Admin';
import Problem from './Pages/problem';
import Profile from './Pages/profile';
import CreateProblem from './component/problemCreator';
import DeleteProblem from './component/deleteProblem';
import UpdateProblem from './component/updateProblem';
import UpdateProblemId from './component/updateProblemForm';
import UserAnalytics from './component/userAnalytics';
import ManageUser from './component/manageuser';
import { checkAuth } from './authSlice';
import { useDispatch,useSelector} from 'react-redux';
import { useEffect } from 'react';

function App() {
  
  const dispatch = useDispatch();
  const { isAuthenticated, loading,user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);


  if (loading) {
    return <div className='bg-gray-950'></div>;
  }

  return (
    <Routes>
      <Route path='/' element={isAuthenticated ? <Home /> : <Navigate to='/signin' />} />

      <Route path='/signup' element={isAuthenticated ? <Navigate to='/' /> : <Signup />} />
      <Route path='/signin' element={isAuthenticated ? <Navigate to='/' /> : <Login />} />

      <Route
        path='/admin'
        element={
          isAuthenticated && user?.role === "admin"
            ? <AdminPanel />
            : <Navigate to='/' />
        }
      > 
      </Route>

      <Route
        path='/admin/create-problem'
        element={
          isAuthenticated && user?.role === "admin"
            ? <CreateProblem />
            : <Navigate to='/' />
        }
      > 
      </Route>
       <Route
        path='/admin/delete-problem'
        element={
          isAuthenticated && user?.role === "admin"
            ? <DeleteProblem />
            : <Navigate to='/' />
        }
      > 
      </Route>
      <Route
        path='/admin/update-problem'
        element={
          isAuthenticated && user?.role === "admin"
            ? <UpdateProblem />
            : <Navigate to='/' />
        }
      > 
      </Route>
      <Route
        path='/admin/update-problem/:problemId'
        element={
          isAuthenticated && user?.role === "admin"
            ? <UpdateProblemId/>
            : <Navigate to='/' />
        }
      > 
      </Route>
       <Route
        path='/admin/analytics'
        element={
          isAuthenticated && user?.role === "admin"
            ? <UserAnalytics/>
            : <Navigate to='/' />
        }
      > 
      </Route>
      <Route
        path='/admin/users'
        element={
          isAuthenticated && user?.role === "admin"
            ? <ManageUser/>
            : <Navigate to='/' />
        }
      > 
      </Route>
       <Route path="/problem/:problemId" element={<Problem/>} />
       <Route path="/profile" element={<Profile/>}/>
  </Routes>
  )
}

export default App
 