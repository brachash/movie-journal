import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Search from './pages/Search';
import MovieDetail from './pages/MovieDetail';
import MySpace from './pages/MySpace';
import Favorites from './pages/Favorites';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="search" element={<Search />} />
          <Route path="my-space" element={<MySpace />} />
          <Route path="favorites" element={<Favorites />} />
          <Route path="movie/:id" element={<MovieDetail />} />
        </Route>
        <Route path="/" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;