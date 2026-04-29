"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FileQuestion, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-muted/30 flex flex-col justify-center items-center p-4">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="relative flex justify-center">
          <div className="absolute inset-0 bg-primary/10 blur-3xl rounded-full" />
          <div className="relative bg-card w-32 h-32 rounded-3xl shadow-xl flex items-center justify-center border border-border">
            <FileQuestion className="w-16 h-16 text-primary" />
          </div>
        </div>
        
        <div className="space-y-3">
          <h1 className="text-7xl font-extrabold text-primary tracking-tight">404</h1>
          <h2 className="text-2xl font-bold text-foreground">Page Not Found</h2>
          <p className="text-muted-foreground">
            The page you are looking for doesn't exist or has been moved.
          </p>
        </div>

        <div className="pt-4">
          <Link href="/">
            <Button className="h-11 px-8 rounded-lg text-md font-semibold bg-primary hover:bg-primary/90 text-white shadow-md shadow-primary/20 gap-2">
              <Home className="w-4 h-4" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
