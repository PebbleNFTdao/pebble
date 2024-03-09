import MainNav from "@/components/common/main-nav";
import { META } from "@/constants";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { Outlet } from "react-router-dom";
import { Toaster } from "sonner";
import Footer from "./footer";

export default function RootLayout() {
  return (
    <HelmetProvider>
      <Helmet>
        <title>{META.convert.title}</title>
        <meta name="description" content={META.convert.description} />
      </Helmet>
      <div className="flex-col flex min-h-screen">
        <header className="border-b">
          <div className="flex h-16 items-center px-4">
            <MainNav className="md:mx-6" />
          </div>
        </header>
        <main className="flex-1 w-full p-8">
          <div className="flex flex-col items-center justify-center space-y-4">
            <Outlet />
          </div>
        </main>
        <Footer />
      </div>
      <Toaster richColors />
    </HelmetProvider>
  );
}
