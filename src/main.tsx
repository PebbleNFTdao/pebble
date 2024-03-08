import Fallback from "@/components/common/fallback";
import RootLayout from "@/components/common/layout";
import Providers from "@/components/common/providers";
import "@/lib/firebase.ts";
import ConvertPage from "@/pages/convert";
import NotFound from "@/pages/not-found";
import "@/styles/global.css";
import "@rainbow-me/rainbowkit/styles.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <ConvertPage />,
      },
      {
        path: "collection",
        lazy: () => import("./pages/collection"),
      },
      {
        path: "airdrop",
        lazy: () => import("./pages/airdrop"),
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

const container = document.getElementById("root");
const root = createRoot(container!);

root.render(
  <StrictMode>
    <Providers>
      <RouterProvider router={router} fallbackElement={<Fallback />} />
    </Providers>
  </StrictMode>
);
