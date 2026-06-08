import { useState, useEffect } from "react";
import dashboardService from "../../services/dashboardService";

// ─── Helpers ───────────────────────────────────────────────────────────────────

const formatCurrency = (amount) =>
  `₹${Number(amount).toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;

const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
  });

const STATUS_STYLES = {
  delivered: "bg-emerald-100 text-emerald-700",
  shipped: "bg-blue-100 text-blue-700",
  placed: "bg-indigo-100 text-indigo-700",
  pending: "bg-amber-100 text-amber-700",
  cancelled: "bg-red-100 text-red-700",
};

// ─── Stat Card ─────────────────────────────────────────────────────────────────

const StatCard = ({ label, value, icon, color }) => (
  <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center gap-4">
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
      {icon}
    </div>
    <div>
      <p className="text-sm text-gray-500 font-medium">{label}</p>
      <p className="text-2xl font-bold text-[#355872] mt-0.5">{value}</p>
    </div>
  </div>
);

// ─── Section Wrapper ───────────────────────────────────────────────────────────

const Section = ({ title, children }) => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
    <div className="px-6 py-4 border-b border-gray-100">
      <h2 className="text-base font-semibold text-[#355872]">{title}</h2>
    </div>
    {children}
  </div>
);

// ─── Skeletons ─────────────────────────────────────────────────────────────────

const SkeletonCard = () => (
  <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center gap-4 animate-pulse">
    <div className="w-12 h-12 rounded-xl bg-gray-100 flex-shrink-0" />
    <div className="flex-1">
      <div className="h-3 bg-gray-100 rounded w-24 mb-2" />
      <div className="h-6 bg-gray-100 rounded w-16" />
    </div>
  </div>
);

const SkeletonRow = ({ cols }) => (
  <tr className="border-b border-gray-50 animate-pulse">
    {Array.from({ length: cols }).map((_, i) => (
      <td key={i} className="px-5 py-3.5">
        <div className="h-4 bg-gray-100 rounded w-full" />
      </td>
    ))}
  </tr>
);

// ─── Recent Orders Table ───────────────────────────────────────────────────────

const RecentOrdersTable = ({ orders, loading }) => (
  <Section title="Recent Orders">
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="bg-[#f4f7fa]">
            {["Order ID", "Product", "Amount", "Status", "Date"].map((h) => (
              <th key={h} className="text-left text-xs font-semibold text-[#355872] px-5 py-3">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} cols={5} />)
          ) : orders.length === 0 ? (
            <tr><td colSpan={5} className="text-center py-10 text-gray-400 text-sm">No orders yet</td></tr>
          ) : (
            orders.map((order) => {
              const firstItem = order.items?.[0];
              return (
                <tr key={order.id} className="border-b border-gray-50 hover:bg-[#f8fafc] transition-colors">
                  <td className="px-5 py-3.5 text-sm font-medium text-gray-700">#{order.id}</td>
                  <td className="px-5 py-3.5">
                    {firstItem ? (
                      <div className="flex items-center gap-2.5">
                        <img
                          src={firstItem.product?.image}
                          alt={firstItem.product?.name}
                          className="w-9 h-9 rounded-lg object-contain bg-gray-50 border border-gray-100 flex-shrink-0"
                          onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/36x36?text=?"; }}
                        />
                        <span className="text-sm text-gray-700 line-clamp-1 max-w-[180px]">
                          {firstItem.product?.name}
                          {order.items.length > 1 && (
                            <span className="text-xs text-gray-400 ml-1">+{order.items.length - 1} more</span>
                          )}
                        </span>
                      </div>
                    ) : "—"}
                  </td>
                  <td className="px-5 py-3.5 text-sm font-semibold text-gray-800">
                    {formatCurrency(order.total_amount)}
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${STATUS_STYLES[order.status] ?? "bg-gray-100 text-gray-600"}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-gray-500">{formatDate(order.createdAt)}</td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  </Section>
);

// ─── Recent Products Table ─────────────────────────────────────────────────────

const RecentProductsTable = ({ products, loading }) => (
  <Section title="Recently Added Products">
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="bg-[#f4f7fa]">
            {["Product", "Price", "Added On"].map((h) => (
              <th key={h} className="text-left text-xs font-semibold text-[#355872] px-5 py-3">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} cols={3} />)
          ) : products.length === 0 ? (
            <tr><td colSpan={3} className="text-center py-10 text-gray-400 text-sm">No products yet</td></tr>
          ) : (
            products.map((product) => (
              <tr key={product.ID} className="border-b border-gray-50 hover:bg-[#f8fafc] transition-colors">
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-9 h-9 rounded-lg object-contain bg-gray-50 border border-gray-100 flex-shrink-0"
                      onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/36x36?text=?"; }}
                    />
                    <span className="text-sm text-gray-700 line-clamp-1 max-w-[220px]">{product.name}</span>
                  </div>
                </td>
                <td className="px-5 py-3.5 text-sm font-semibold text-gray-800">
                  {formatCurrency(product.discount_price)}
                </td>
                <td className="px-5 py-3.5 text-sm text-gray-500">{formatDate(product.createdAt)}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  </Section>
);

// ─── Recent Users Table ────────────────────────────────────────────────────────

const RecentUsersTable = ({ users, loading }) => (
  <Section title="New Users">
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="bg-[#f4f7fa]">
            {["User", "Role", "Joined"].map((h) => (
              <th key={h} className="text-left text-xs font-semibold text-[#355872] px-5 py-3">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} cols={3} />)
          ) : users.length === 0 ? (
            <tr>
              <td colSpan={3} className="text-center py-10 text-gray-400 text-sm">
                No users yet
              </td>
            </tr>
          ) : (
            users.map((user) => (
              <tr key={user.id} className="border-b border-gray-50 hover:bg-[#f8fafc] transition-colors">
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#355872]/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold text-[#355872]">
                        {user.name?.charAt(0).toUpperCase() ?? "?"}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">{user.name}</p>
                      <p className="text-xs text-gray-400">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3.5">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${user.role === "admin"
                    ? "bg-[#355872]/10 text-[#355872]"
                    : "bg-gray-100 text-gray-600"
                    }`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-sm text-gray-500">{formatDate(user.createdAt)}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  </Section>
);

// ─── Dashboard Page ────────────────────────────────────────────────────────────

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    dashboardService.getDashboardStats()
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const stats = data?.stats;

  const STAT_CARDS = [
    {
      label: "Total Users",
      value: loading ? "—" : (stats?.totalUsers?.toLocaleString() ?? "N/A"),
      color: "bg-blue-50",
      icon: (
        <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
    {
      label: "Total Orders",
      value: loading ? "—" : (stats?.totalOrders?.toLocaleString() ?? "0"),
      color: "bg-purple-50",
      icon: (
        <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      ),
    },
    {
      label: "Total Sales",
      value: loading ? "—" : formatCurrency(stats?.totalSales ?? 0),
      color: "bg-emerald-50",
      icon: (
        <svg className="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      label: "Total Products",
      value: loading ? "—" : (stats?.totalProducts?.toLocaleString() ?? "0"),
      color: "bg-amber-50",
      icon: (
        <svg className="w-6 h-6 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
    },
  ];

  return (
    <div className="space-y-6">

      {/* Page Title */}
      <div>
        <h1 className="text-xl font-bold text-[#355872]">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-0.5">Welcome back, here's what's happening today.</p>
      </div>

      {/* Error */}
      {error && (
        <div className="px-5 py-4 bg-red-50 border border-red-100 rounded-2xl text-sm text-red-700">
          Failed to load dashboard data: {error}
        </div>
      )}

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
          : STAT_CARDS.map((card) => <StatCard key={card.label} {...card} />)
        }
      </div>

      {/* Recent Orders */}
      <RecentOrdersTable orders={data?.recentOrders ?? []} loading={loading} />

      {/* Bottom two — Products + Users side by side on large screens */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <RecentProductsTable products={data?.recentProducts ?? []} loading={loading} />
        <RecentUsersTable users={data?.recentUsers ?? []} loading={loading} />
      </div>

    </div>
  );
}