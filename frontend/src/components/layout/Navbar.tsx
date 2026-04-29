"use client";

import { Search, Bell } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { Sidebar } from "./Sidebar";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function Navbar() {
  const router = useRouter();

  const handleLogout = () => {
    document.cookie = "access_token=; max-age=0; path=/";
    router.push("/login");
  };
  return (
    <header className="h-[70px] bg-background border-b border-border sticky top-0 z-30 flex items-center justify-between px-4 lg:px-8">
      <div className="flex items-center gap-4">
        <div className="lg:hidden block">
          <Sheet>
            <SheetTrigger render={<Button variant="ghost" size="icon" className="md:hidden" />}>
              <Menu className="h-5 w-5" />
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-64">
              <Sidebar />
            </SheetContent>
          </Sheet>
        </div>
        
        <div className="hidden md:flex items-center bg-card rounded-full px-4 py-2 border border-border focus-within:ring-2 focus-within:ring-primary focus-within:border-transparent transition-all w-64 shadow-sm">
          <Search className="w-4 h-4 text-muted-foreground mr-2" />
          <input 
            type="text" 
            placeholder="Search..." 
            className="bg-transparent border-none outline-none text-sm w-full"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="relative rounded-full hover:bg-accent">
          <Bell className="w-5 h-5 text-muted-foreground" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-destructive rounded-full border-2 border-background"></span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger className="outline-none">
            <Avatar className="h-9 w-9 border border-border cursor-pointer hover:ring-2 ring-primary transition-all">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>AD</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuGroup>
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive" onClick={handleLogout}>Log out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
