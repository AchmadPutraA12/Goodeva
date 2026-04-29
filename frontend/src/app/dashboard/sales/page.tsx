"use client";

import { useEffect, useState, useCallback, useRef, useTransition } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api, SalesItem } from "@/lib/api";
import { ChevronLeft, ChevronRight, RefreshCw, Search, X, Loader2 } from "lucide-react";

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

export default function SalesPage() {
  const [data, setData] = useState<SalesItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [filter, setFilter] = useState("");
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [initialLoad, setInitialLoad] = useState(true);
  const [isPending, startTransition] = useTransition();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchData = useCallback(async (opts?: { resetPage?: boolean }) => {
    try {
      const res = await api.getSales(
        opts?.resetPage ? 1 : page,
        pageSize,
        filter || undefined,
        search || undefined
      );
      setData(res.data);
      setTotal(res.total);
    } catch {
      // keep existing data on error
    } finally {
      setInitialLoad(false);
    }
  }, [page, pageSize, filter, search]);

  // initial load — show skeleton once
  useEffect(() => {
    setInitialLoad(true);
    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // subsequent changes — keep old data visible, wrap in transition
  useEffect(() => {
    if (initialLoad) return;
    startTransition(() => {
      fetchData();
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pageSize, filter, search]);

  const handleSearchChange = (value: string) => {
    setSearchInput(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setSearch(value);
      setPage(1);
    }, 400);
  };

  const clearSearch = () => {
    setSearchInput("");
    setSearch("");
    setPage(1);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setPage(1);
  };

  const handleFilterChange = (val: string) => {
    setFilter(val);
    setPage(1);
  };

  const totalPages = Math.ceil(total / pageSize);
  const startEntry = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const endEntry = Math.min(page * pageSize, total);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Data Penjualan</h1>
            <p className="text-muted-foreground mt-1">
              Total {total.toLocaleString()} produk dari sales_data.csv
            </p>
          </div>
          <Button
            variant="outline" size="sm"
            onClick={() => startTransition(() => fetchData())}
            disabled={isPending}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isPending ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>

        <Card className="border-none shadow-sm rounded-2xl">
          <CardHeader className="pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                Tabel Produk
                {isPending && (
                  <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                )}
              </CardTitle>

              {/* Search */}
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                <Input
                  placeholder="Cari nama atau ID produk..."
                  value={searchInput}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="pl-9 pr-9 h-9 rounded-lg"
                />
                {searchInput && (
                  <button
                    onClick={clearSearch}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Controls row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>Tampilkan</span>
                <select
                  value={pageSize}
                  onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                  className="border border-border rounded-lg px-2 py-1 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {PAGE_SIZE_OPTIONS.map((n) => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
                <span>entri</span>
              </div>

              <div className="flex gap-2">
                {["", "Laris", "Tidak"].map((val) => (
                  <Button
                    key={val}
                    variant={filter === val ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleFilterChange(val)}
                  >
                    {val === "" ? "Semua" : val}
                  </Button>
                ))}
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-y border-border bg-muted/40">
                    <th className="text-left px-6 py-3 font-semibold text-muted-foreground">ID</th>
                    <th className="text-left px-6 py-3 font-semibold text-muted-foreground">Nama Produk</th>
                    <th className="text-right px-6 py-3 font-semibold text-muted-foreground">Jml Penjualan</th>
                    <th className="text-right px-6 py-3 font-semibold text-muted-foreground">Harga</th>
                    <th className="text-right px-6 py-3 font-semibold text-muted-foreground">Diskon</th>
                    <th className="text-center px-6 py-3 font-semibold text-muted-foreground">Status</th>
                  </tr>
                </thead>
                <tbody className={isPending ? "opacity-50" : ""}>
                  {initialLoad
                    ? Array.from({ length: pageSize }).map((_, i) => (
                        <tr key={i} className="border-b border-border animate-pulse">
                          {Array.from({ length: 6 }).map((_, j) => (
                            <td key={j} className="px-6 py-4">
                              <div className="h-4 bg-muted rounded w-full" />
                            </td>
                          ))}
                        </tr>
                      ))
                    : data.length === 0
                    ? (
                        <tr>
                          <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                            {search ? `Tidak ada hasil untuk "${search}"` : "Tidak ada data"}
                          </td>
                        </tr>
                      )
                    : data.map((item) => (
                        <tr
                          key={item.product_id}
                          className="border-b border-border hover:bg-muted/30 transition-colors"
                        >
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

            {/* Pagination */}
            <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 border-t border-border gap-3">
              <p className="text-sm text-muted-foreground">
                {initialLoad
                  ? "Memuat..."
                  : total === 0
                  ? "Tidak ada data"
                  : `Menampilkan ${startEntry}–${endEntry} dari ${total.toLocaleString()} entri`}
              </p>
              <div className="flex items-center gap-1">
                <Button
                  variant="outline" size="sm"
                  onClick={() => setPage(1)}
                  disabled={page <= 1 || isPending}
                >«</Button>
                <Button
                  variant="outline" size="sm"
                  onClick={() => setPage(p => p - 1)}
                  disabled={page <= 1 || isPending}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <span className="text-sm px-3 tabular-nums">
                  {page} / {totalPages || 1}
                </span>
                <Button
                  variant="outline" size="sm"
                  onClick={() => setPage(p => p + 1)}
                  disabled={page >= totalPages || isPending}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline" size="sm"
                  onClick={() => setPage(totalPages)}
                  disabled={page >= totalPages || isPending}
                >»</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
