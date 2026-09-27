import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Register from "./Pages/Register/Register";
import Layout from "./Layout/Layout";
const routes = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [{ path: "register", element: <Register /> }],
  },
]);

function App() {
  return <RouterProvider router={routes} />;
}

export default App;
