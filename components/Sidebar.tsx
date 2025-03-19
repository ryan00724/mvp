import Link from "next/link";

export default function Sidebar() {
  return (
    <div className="w-64 h-screen bg-gray-800 text-white p-5">
      <h2 className="text-2xl font-bold">Club Admin</h2>
      <ul className="mt-5 space-y-3">
        <li><Link href="/dashboard"><span className="cursor-pointer">🏠 Dashboard</span></Link></li>
        <li><Link href="/players"><span className="cursor-pointer">👥 Players</span></Link></li>
        <li><Link href="/schedule"><span className="cursor-pointer">📅 Schedule</span></Link></li>
        <li><Link href="/payments"><span className="cursor-pointer">💰 Payments</span></Link></li>
      </ul>
    </div>
  );
}
