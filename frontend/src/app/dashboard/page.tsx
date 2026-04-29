import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Users, DollarSign, ArrowUpRight, ArrowDownRight, CreditCard } from "lucide-react";

export default function Home() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Here is what's happening with your projects today.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-none shadow-sm bg-card rounded-2xl overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold text-muted-foreground">
                Total Revenue
              </CardTitle>
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$45,231.89</div>
              <p className="text-xs font-medium text-emerald-500 flex items-center mt-1">
                <ArrowUpRight className="h-4 w-4 mr-1" />
                +20.1% from last month
              </p>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm bg-card rounded-2xl overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold text-muted-foreground">
                Active Users
              </CardTitle>
              <div className="w-10 h-10 rounded-xl bg-chart-2/10 flex items-center justify-center">
                <Users className="h-5 w-5 text-chart-2" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+2350</div>
              <p className="text-xs font-medium text-emerald-500 flex items-center mt-1">
                <ArrowUpRight className="h-4 w-4 mr-1" />
                +180.1% from last month
              </p>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm bg-card rounded-2xl overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold text-muted-foreground">Sales</CardTitle>
              <div className="w-10 h-10 rounded-xl bg-chart-4/10 flex items-center justify-center">
                <CreditCard className="h-5 w-5 text-chart-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+12,234</div>
              <p className="text-xs font-medium text-emerald-500 flex items-center mt-1">
                <ArrowUpRight className="h-4 w-4 mr-1" />
                +19% from last month
              </p>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm bg-card rounded-2xl overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold text-muted-foreground">
                Active Now
              </CardTitle>
              <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center">
                <Activity className="h-5 w-5 text-destructive" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+573</div>
              <p className="text-xs font-medium text-destructive flex items-center mt-1">
                <ArrowDownRight className="h-4 w-4 mr-1" />
                -201 since last hour
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 mt-4">
          <Card className="col-span-4 border-none shadow-sm rounded-2xl">
            <CardHeader>
              <CardTitle className="font-semibold">Overview</CardTitle>
            </CardHeader>
            <CardContent className="pl-2 h-[300px] flex items-center justify-center border-t border-border mt-2 bg-muted/20">
               <span className="text-muted-foreground font-medium text-sm">Chart Placeholder</span>
            </CardContent>
          </Card>
          <Card className="col-span-3 border-none shadow-sm rounded-2xl">
            <CardHeader>
              <CardTitle className="font-semibold">Recent Sales</CardTitle>
            </CardHeader>
            <CardContent className="border-t border-border mt-2 pt-6 bg-muted/20 h-[300px]">
              <div className="space-y-6">
                {[1,2,3,4].map((i) => (
                  <div key={i} className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                      {`U${i}`}
                    </div>
                    <div className="ml-4 space-y-1">
                      <p className="text-sm font-medium leading-none">User Name {i}</p>
                      <p className="text-sm text-muted-foreground">user{i}@example.com</p>
                    </div>
                    <div className="ml-auto font-medium">+$1,{i}99.00</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
