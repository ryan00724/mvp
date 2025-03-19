import Link from "next/link";

export default function Home() {
  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      {/* Navbar */}
      <nav className="w-full py-4 bg-white shadow-md flex justify-between px-6">
        <h1 className="text-2xl font-bold">Club Management</h1>
        <div>
          <Link href="/login" className="mr-4 text-gray-600 hover:text-gray-900">Log In</Link>
          <Link href="/signup">
            <button className="bg-blue-500 text-white px-4 py-2 rounded-lg">Sign Up</button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="flex-1 flex flex-col items-center justify-center text-center">
        <h1 className="text-5xl font-bold text-gray-900">Manage Your Club with Ease</h1>
        <p className="text-gray-600 mt-4">Track players, schedule matches, and handle payments—all in one place.</p>

        <div className="mt-6 space-x-4">
          <Link href="/signup">
            <button className="bg-blue-500 text-white px-6 py-2 rounded-lg shadow">Get Started</button>
          </Link>
        </div>
      </div>
    </div>
  );
}
