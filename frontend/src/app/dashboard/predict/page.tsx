"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { api, PredictResponse } from "@/lib/api";
import { TrendingUp, TrendingDown, Cpu } from "lucide-react";

export default function PredictPage() {
  const [form, setForm] = useState({ jumlah_penjualan: "", harga: "", diskon: "" });
  const [result, setResult] = useState<PredictResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setResult(null);
    setLoading(true);
    try {
      const res = await api.predict({
        jumlah_penjualan: Number(form.jumlah_penjualan),
        harga: Number(form.harga),
        diskon: Number(form.diskon),
      });
      setResult(res);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Prediksi gagal");
    } finally {
      setLoading(false);
    }
  };

  const isLaris = result?.status === "Laris";

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-2xl">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Prediksi Produk</h1>
          <p className="text-muted-foreground mt-1">
            Masukkan data produk untuk diprediksi menggunakan model Random Forest
          </p>
        </div>

        <Card className="border-none shadow-sm rounded-2xl">
          <CardHeader>
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Cpu className="w-4 h-4 text-primary" />
              Input Data Produk
            </CardTitle>
            <CardDescription>
              Model menggunakan fitur jumlah penjualan, harga, dan diskon
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="jumlah_penjualan">Jumlah Penjualan (unit)</Label>
                <Input
                  id="jumlah_penjualan"
                  name="jumlah_penjualan"
                  type="number"
                  min={0}
                  placeholder="cth: 250"
                  value={form.jumlah_penjualan}
                  onChange={handleChange}
                  required
                  className="h-11 rounded-lg"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="harga">Harga Satuan (Rp)</Label>
                <Input
                  id="harga"
                  name="harga"
                  type="number"
                  min={1}
                  placeholder="cth: 50000"
                  value={form.harga}
                  onChange={handleChange}
                  required
                  className="h-11 rounded-lg"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="diskon">Diskon (%)</Label>
                <Input
                  id="diskon"
                  name="diskon"
                  type="number"
                  min={0}
                  max={100}
                  placeholder="cth: 10"
                  value={form.diskon}
                  onChange={handleChange}
                  required
                  className="h-11 rounded-lg"
                />
              </div>

              {error && <p className="text-sm text-destructive">{error}</p>}

              <Button type="submit" className="w-full h-11" disabled={loading}>
                {loading ? "Memproses..." : "Prediksi Sekarang"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {result && (
          <Card className={`border-2 rounded-2xl shadow-sm ${isLaris ? "border-emerald-500" : "border-red-400"}`}>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                  isLaris ? "bg-emerald-100 dark:bg-emerald-900/30" : "bg-red-100 dark:bg-red-900/30"
                }`}>
                  {isLaris
                    ? <TrendingUp className="w-7 h-7 text-emerald-600" />
                    : <TrendingDown className="w-7 h-7 text-red-500" />}
                </div>
                <div>
                  <p className="text-sm text-muted-foreground font-medium">Hasil Prediksi</p>
                  <p className={`text-3xl font-extrabold ${isLaris ? "text-emerald-600" : "text-red-500"}`}>
                    {result.status}
                  </p>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="bg-muted/40 rounded-xl p-4">
                  <p className="text-xs font-semibold text-muted-foreground mb-1">Probabilitas Laris</p>
                  <p className="text-2xl font-bold text-emerald-600">
                    {(result.probability_laris * 100).toFixed(1)}%
                  </p>
                  <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                      style={{ width: `${result.probability_laris * 100}%` }}
                    />
                  </div>
                </div>
                <div className="bg-muted/40 rounded-xl p-4">
                  <p className="text-xs font-semibold text-muted-foreground mb-1">Probabilitas Tidak</p>
                  <p className="text-2xl font-bold text-red-500">
                    {(result.probability_tidak * 100).toFixed(1)}%
                  </p>
                  <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-red-400 rounded-full transition-all duration-500"
                      style={{ width: `${result.probability_tidak * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
