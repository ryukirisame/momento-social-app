import { Login } from "./pages/login/Login";
import "./style.scss";
import { Register } from "./pages/register/Register";
import {
  createBrowserRouter,
  Navigate,
  Outlet,
  RouterProvider,
} from "react-router-dom";
import { NavBar } from "./components/navbar/NavBar";
import { LeftBar } from "./components/leftbar/LeftBar";

import { Profile } from "./pages/profile/Profile";
import { FindFriends } from "./pages/findFriends/FindFriends";
import { Home } from "./pages/home/Home";
import { useContext } from "react";
import { DarkModeContext } from "./context/darkModeContext";
import { AuthContext } from "./context/authContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MyFollowings } from "./pages/myFollowings/MyFollowings";
import { DiscoverPeople } from "./pages/discoverPeople/DiscoverPeople";
import { MyFollowers } from "./pages/myFollowers/MyFollowers";

function App() {
  const queryClient = new QueryClient();

  const { currentUser } = useContext(AuthContext);

  const { darkMode } = useContext(DarkModeContext);

  const ProtectedRoute = ({ children }) => {
    // no user is loged in
    if (!currentUser) {
      return <Navigate to="/login" />;
    }

    return children;
  };

  const layoutStyle = {
    maxWidth: "1600px",
  };

  // Layout for home page
  const Layout = () => {
    return (
      <QueryClientProvider client={queryClient}>
        <div
          className={`theme-${darkMode ? "dark" : "light"}`}
          style={layoutStyle}
        >
          <NavBar />
          <div style={{ display: "flex" }}>
            <LeftBar />
            <div style={{ flex: 1, backgroundColor: "#E9ECEF" }}>
              <Outlet />
            </div>
          </div>
        </div>
      </QueryClientProvider>
    );
  };

  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      ),

      // paths for outlet
      children: [
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "/profile/:id",
          element: <Profile />,
        },
        {
          path: "/findFriends/:searchString",
          element: <FindFriends />,
        },
        {
          path: "/followings",
          element: <MyFollowings />,
        },
        {
          path: "/followers",
          element: <MyFollowers />,
        },
        {
          path: "/discoverPeople",
          element: <DiscoverPeople />,
        },
      ],
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/register",
      element: <Register />,
    },
  ]);

  return (
    <div className="App">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
