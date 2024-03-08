import Loading from "./loading";
import MainNav from "./main-nav";

export default function Fallback() {
  return (
    <div className="flex-col flex">
      <header className="border-b">
        <div className="flex h-16 items-center px-4">
          <MainNav className="md:mx-6" />
        </div>
      </header>
      <main className="flex-1 w-full p-8">
        <div className="flex flex-col items-center justify-center space-y-4">
          <Loading />
        </div>
      </main>
    </div>
  );
}
