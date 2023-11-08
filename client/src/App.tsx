import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Courses from './pages/Courses';
import Course from './pages/Course';
import Assignment from './pages/Assignment';
import Dashboard from './pages/Dashboard';
import Schedule from './pages/Schedule';
import Profile from './pages/Profile';
import PrivateRoute from './utils/PrivateRoute';
import Error404 from './pages/404';
import Submission from './pages/Submission';
import Class from './pages/Class';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PrivateRoute />}>
          <Route path="/" element={<Home />}>
            <Route index element={<Dashboard />}></Route>
            <Route path="courses" element={<Courses />} />
            <Route path="courses/:id" element={<Course />}></Route>
            <Route path="courses/:id/class/:classId" element={<Class />} />
            <Route
              path="courses/:id/assignment/:assignment"
              element={<Assignment />}
            ></Route>
            <Route
              path="courses/:id/submissions/:submission"
              element={<Submission />}
            />
            <Route path="schedule" element={<Schedule />}></Route>
            <Route path="profile" element={<Profile />}></Route>
          </Route>
        </Route>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Error404 />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
