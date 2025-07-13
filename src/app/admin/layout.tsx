import Link from "next/link";
import { Home, RefreshCw, Plus, List, MapPin } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const navItems = [
    { href: "/", label: "홈으로", icon: Home },
    { href: "/admin", label: "대시보드", icon: Home },
    { href: "/admin/updates", label: "업데이트 추가", icon: Plus },
    { href: "/admin/updates/list", label: "업데이트 목록", icon: List },
    { href: "/admin/gyms", label: "암장 관리", icon: MapPin },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center h-16">
            <h1 className="text-xl font-bold mr-8">Climb Hub Admin</h1>
            <div className="flex gap-6">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </nav>
      <main>{children}</main>
    </div>
  );
}
