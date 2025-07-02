'use cliente';

import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

export function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="p-4 bh-gray-100 flex gap-4">
      {user && <span>Oi, {user.name}!</span>}
      <Link href='/dashboard'>Dashboard</Link>
      {user?.role === 'ADMIN' && <Link href='/admin'>Admin</Link>}
      <button onClick={logout}>Sair</button>
    </nav>
  )
}
