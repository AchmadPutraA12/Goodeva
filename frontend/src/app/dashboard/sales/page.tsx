"use client";

import { useEffect, useState, useCallback } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { api, SalesItem } from "@/lib/api";
import { ChevronLeft, ChevronRight, RefreshCw } from "lucide-react";

const PAGE_SIZE = 20;

export default function SalesPage() {
  const [data, setData] = useState<SalesItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.getSales(page, PAGE_SIZE, filter || undefined);
      setData(res.data);
      setTotal(res.total);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Gagal memuat data");
    } finally {
      setLoading(false);
    }
  }, [page, filter]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Data Penjualan</h1>
            <p className="text-muted-foreground mt-1">Total {total.toLocaleString()} produk dari sales_data.csv</p>
          </div>
          <Button variant="outline" size="sm" onClick={fetchData} disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>

        {/* Filter */}
        <div className="flex gap-2">
          {["", "Laris", "Tidak"].map((val) => (
            <Button
              key={val}
              variant={filter === val ? "default" : "outline"}
              size="sm"
              onClick={() => { setFilter(val); setPage(1); }}
            >
              {val === "" ? "Semua" : val}
            </Button>
          ))}
        </div>

        <Card className="border-none shadow-sm rounded-2xl">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Tabel Produk</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {error ? (
              <p className="text-destructive text-sm p-6">{error}</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/40">
                      <th className="text-left px-6 py-3 font-semibold text-muted-foreground">ID</th>
                      <th className="text-left px-6 py-3 font-semibold text-muted-foreground">Nama Produk</th>
                      <th className="text-right px-6 py-3 font-semibold text-muted-foreground">Jml Penjualan</th>
                      <th className="text-right px-6 py-3 font-semibold text-muted-foreground">Harga</th>
                      <th className="text-right px-6 py-3 font-semibold text-muted-foreground">Diskon</th>
                      <th className="text-center px-6 py-3 font-semibold text-muted-foreground">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading
                      ? Array.from({ length: 5 }).map((_, i) => (
                          <tr key={i} className="border-b border-border animate-pulse">
                            {Array.from({ length: 6 }).map((_, j) => (
                              <td key={j} className="px-6 py-4">
                                <div className="h-4 bg-muted rounded w-full" />
                              </td>
                            ))}
                          </tr>
                        ))
                      : data.map((item) => (
                          <tr key={item.product_id} className="border-b border-border hover:bg-muted/30 transition-colors">
                            <td className="px-6 py-3 text-muted-foreground font-mono text-xs">{item.product_id}</td>
                            <td className="px-6 py-3 font-medium">{item.product_name}</td>
                            <td className="px-6 py-3 text-right">{item.jumlah_penjualan.toLocaleString()}</td>
                            <td className="px-6 py-3 text-right">Rp {item.harga.toLocaleString("id-ID")}</td>
                            <td className="px-6 py-3 text-right">{item.diskon}%</td>
                            <td className="px-6 py-3 text-center">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                                item.status === "Laris"
                                  ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                                  : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                              }`}>
                                {item.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination */}
            {!error && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-border">
                <p className="text-sm text-muted-foreground">
                  Halaman {page} dari {totalPages} ({total} total)
                </p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => setPage(p => p - 1)} disabled={page <= 1}>
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setPage(p => p + 1)} disabled={page >= totalPages}>
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
