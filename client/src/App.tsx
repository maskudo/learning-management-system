import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Courses from './pages/Courses';
import Course from './pages/Course';
import { GET_USER_BY_EMAIL } from './graphql/query';
import { useQuery } from '@apollo/client';
import Assignment from './pages/Assignment';

function App() {
  const email = localStorage.getItem('email');
  useQuery(GET_USER_BY_EMAIL, {
    variables: {
      email: email,
    },
  });
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />}>
          <Route path="dashboard"></Route>
          <Route path="courses" element={<Courses />} />
          <Route path="courses/:id" element={<Course />}></Route>
          <Route
            path="courses/:id/assignment/:assignment"
            element={<Assignment />}
          />
          <Route path="schedule"></Route>
          <Route path="profile"></Route>
        </Route>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
