import MainNav from "@/components/common/main-nav";
import { meta } from "@/config/meta";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { Outlet } from "react-router-dom";
import { Toaster } from "sonner";

export default function RootLayout() {
  return (
    <HelmetProvider>
      <Helmet>
        <title>{meta.convert.title}</title>
        <meta name="description" content={meta.convert.description} />
      </Helmet>
      <div className="flex-col flex">
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
      </div>
      <Toaster richColors />
    </HelmetProvider>
  );
}
