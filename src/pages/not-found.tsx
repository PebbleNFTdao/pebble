import MainNav from "@/components/common/main-nav";
import { Button } from "@/components/ui/button";
import { META } from "@/constants";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <>
      <Helmet>
        <title>{META.notFound.title}</title>
      </Helmet>
      <div className="flex-col md:flex">
        <div className="border-b">
          <div className="flex h-16 items-center px-4">
            <MainNav className="md:mx-6" />
          </div>
        </div>
        <div className="flex-1 w-full p-8">
          <div className="flex flex-col items-center justify-center space-y-4">
            <h1 className="text-xl mt-2 mb-6">404 Not Found</h1>
            <Link to="/">
              <Button>Go Home</Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
