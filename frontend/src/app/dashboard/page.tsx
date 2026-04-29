"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { api, StatsResponse } from "@/lib/api";
import {
  PackageSearch, TrendingUp, TrendingDown, ShoppingCart,
  Tag, Percent, Trophy
} from "lucide-react";
import Link from "next/link";

function StatCard({
  title, value, sub, icon: Icon, iconClass, subClass,
}: {
  title: string; value: string; sub: string;
  icon: React.ElementType; iconClass: string; subClass?: string;
}) {
  return (
    <Card className="border-none shadow-sm bg-card rounded-2xl overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-semibold text-muted-foreground">{title}</CardTitle>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconClass}`}>
          <Icon className="h-5 w-5" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className={`text-xs font-medium mt-1 ${subClass ?? "text-muted-foreground"}`}>{sub}</p>
      </CardContent>
    </Card>
  );
}

function SkeletonCard() {
  return (
    <Card className="border-none shadow-sm rounded-2xl overflow-hidden animate-pulse">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="h-4 bg-muted rounded w-24" />
        <div className="w-10 h-10 rounded-xl bg-muted" />
      </CardHeader>
      <CardContent>
        <div className="h-7 bg-muted rounded w-32 mb-2" />
        <div className="h-3 bg-muted rounded w-20" />
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getStats()
      .then(setStats)
      .finally(() => setLoading(false));
  }, []);

  const larisBarWidth = stats ? `${stats.pct_laris}%` : "0%";
  const tidakBarWidth = stats ? `${(100 - stats.pct_laris).toFixed(1)}%` : "0%";

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Ringkasan data penjualan dari sales_data.csv</p>
        </div>

        {/* Stat Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
          ) : stats ? (
            <>
              <StatCard
                title="Total Produk"
                value={stats.total_produk.toLocaleString("id-ID")}
                sub="keseluruhan data"
                icon={PackageSearch}
                iconClass="bg-primary/10 text-primary"
              />
              <StatCard
                title="Produk Laris"
                value={stats.total_laris.toLocaleString("id-ID")}
                sub={`${stats.pct_laris}% dari total produk`}
                icon={TrendingUp}
                iconClass="bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30"
                subClass="text-emerald-600"
              />
              <StatCard
                title="Produk Tidak Laris"
                value={stats.total_tidak.toLocaleString("id-ID")}
                sub={`${(100 - stats.pct_laris).toFixed(1)}% dari total produk`}
                icon={TrendingDown}
                iconClass="bg-red-100 text-red-500 dark:bg-red-900/30"
                subClass="text-red-500"
              />
              <StatCard
                title="Total Unit Terjual"
                value={stats.total_penjualan.toLocaleString("id-ID")}
                sub={`rata-rata Rp ${stats.avg_harga.toLocaleString("id-ID")} / produk`}
                icon={ShoppingCart}
                iconClass="bg-blue-100 text-blue-600 dark:bg-blue-900/30"
              />
            </>
          ) : null}
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          {/* Distribusi Status */}
          <Card className="col-span-4 border-none shadow-sm rounded-2xl">
            <CardHeader>
              <CardTitle className="font-semibold text-base">Distribusi Status Produk</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              {loading ? (
                <div className="space-y-4 animate-pulse">
                  {[1, 2].map(i => (
                    <div key={i}>
                      <div className="h-4 bg-muted rounded w-32 mb-2" />
                      <div className="h-6 bg-muted rounded-full w-full" />
                    </div>
                  ))}
                </div>
              ) : stats ? (
                <>
                  {/* Laris bar */}
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-semibold text-emerald-600">Laris</span>
                      <span className="text-muted-foreground">
                        {stats.total_laris.toLocaleString()} produk ({stats.pct_laris}%)
                      </span>
                    </div>
                    <div className="h-7 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full flex items-center pl-3 transition-all duration-700"
                        style={{ width: larisBarWidth }}
                      >
                        <span className="text-xs text-white font-bold">{stats.pct_laris}%</span>
                      </div>
                    </div>
                  </div>
                  {/* Tidak bar */}
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-semibold text-red-500">Tidak Laris</span>
                      <span className="text-muted-foreground">
                        {stats.total_tidak.toLocaleString()} produk ({(100 - stats.pct_laris).toFixed(1)}%)
                      </span>
                    </div>
                    <div className="h-7 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-red-400 rounded-full flex items-center pl-3 transition-all duration-700"
                        style={{ width: tidakBarWidth }}
                      >
                        <span className="text-xs text-white font-bold">{(100 - stats.pct_laris).toFixed(1)}%</span>
                      </div>
                    </div>
                  </div>

                  {/* Diskon distribution */}
                  <div className="pt-2">
                    <p className="text-sm font-semibold mb-3 flex items-center gap-2">
                      <Percent className="w-4 h-4 text-muted-foreground" />
                      Distribusi Diskon
                    </p>
                    <div className="grid grid-cols-7 gap-1">
                      {stats.diskon_distribution.map((b) => {
                        const total = b.laris + b.tidak;
                        const pct = total > 0 ? Math.round((b.laris / total) * 100) : 0;
                        return (
                          <div key={b.label} className="flex flex-col items-center gap-1">
                            <div className="w-full h-20 bg-muted rounded-lg overflow-hidden flex flex-col-reverse">
                              <div
                                className="bg-emerald-400 transition-all duration-500"
                                style={{ height: `${pct}%` }}
                              />
                            </div>
                            <span className="text-xs text-muted-foreground">{b.label}</span>
                            <span className="text-xs font-semibold">{pct}%</span>
                          </div>
                        );
                      })}
                    </div>
                    <p className="text-xs text-muted-foreground mt-2 text-center">
                      % Laris per bucket diskon
                    </p>
                  </div>
                </>
              ) : null}
            </CardContent>
          </Card>

          {/* Top 5 Produk */}
          <Card className="col-span-3 border-none shadow-sm rounded-2xl">
            <CardHeader>
              <CardTitle className="font-semibold text-base flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-500" />
                Top 5 Penjualan Tertinggi
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4 animate-pulse">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-muted" />
                      <div className="flex-1 space-y-1">
                        <div className="h-3 bg-muted rounded w-24" />
                        <div className="h-3 bg-muted rounded w-16" />
                      </div>
                      <div className="h-3 bg-muted rounded w-10" />
                    </div>
                  ))}
                </div>
              ) : stats ? (
                <div className="space-y-4">
                  {stats.top_products.map((p, i) => (
                    <div key={p.product_id} className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
                        i === 0 ? "bg-amber-100 text-amber-600" :
                        i === 1 ? "bg-slate-100 text-slate-600" :
                        i === 2 ? "bg-orange-100 text-orange-600" :
                        "bg-muted text-muted-foreground"
                      }`}>
                        {i + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{p.product_name}</p>
                        <p className="text-xs text-muted-foreground font-mono">{p.product_id}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-sm font-bold">{p.jumlah_penjualan.toLocaleString()}</p>
                        <span className={`text-xs font-semibold px-1.5 py-0.5 rounded-full ${
                          p.status === "Laris"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-red-100 text-red-600"
                        }`}>
                          {p.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : null}

              {/* Summary info */}
              {!loading && stats && (
                <div className="mt-6 pt-4 border-t border-border grid grid-cols-2 gap-3">
                  <div className="bg-muted/40 rounded-xl p-3 text-center">
                    <Tag className="w-4 h-4 text-muted-foreground mx-auto mb-1" />
                    <p className="text-xs text-muted-foreground">Rata-rata Harga</p>
                    <p className="text-sm font-bold">
                      Rp {stats.avg_harga.toLocaleString("id-ID")}
                    </p>
                  </div>
                  <div className="bg-muted/40 rounded-xl p-3 text-center">
                    <Percent className="w-4 h-4 text-muted-foreground mx-auto mb-1" />
                    <p className="text-xs text-muted-foreground">Rata-rata Diskon</p>
                    <p className="text-sm font-bold">{stats.avg_diskon}%</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick links */}
        <div className="grid gap-4 md:grid-cols-2">
          <Link href="/dashboard/sales">
            <Card className="border-none shadow-sm rounded-2xl hover:shadow-md transition-shadow cursor-pointer group">
              <CardContent className="flex items-center gap-4 py-5">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <ShoppingCart className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="font-semibold">Lihat Data Penjualan</p>
                  <p className="text-sm text-muted-foreground">Tabel lengkap {stats?.total_produk?.toLocaleString() ?? "..."} produk</p>
                </div>
              </CardContent>
            </Card>
          </Link>
          <Link href="/dashboard/predict">
            <Card className="border-none shadow-sm rounded-2xl hover:shadow-md transition-shadow cursor-pointer group">
              <CardContent className="flex items-center gap-4 py-5">
                <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors dark:bg-blue-900/30">
                  <TrendingUp className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold">Prediksi Produk</p>
                  <p className="text-sm text-muted-foreground">Gunakan model Random Forest</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </DashboardLayout>
  );
}
