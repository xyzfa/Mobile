// src/router.tsx
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

export const routers = [
  {
    path: "/",
    name: "home",
    element: <Index />,
  },
  {
    path: "*",
    name: "404",
    element: <NotFound />,
  },
];