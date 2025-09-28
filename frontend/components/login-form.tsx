"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSession } from "@/lib/contexts/session-context";

export function LoginForm() {
  const { login, loading } = useSession();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (email && password) {
      await login(email, password);
    }
  }

  return (
    <div className="grid gap-6">
      <form onSubmit={onSubmit} className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Signing in..." : "Sign In"}
        </Button>
      </form>
      <div className="text-center text-sm text-muted-foreground">
        <p>Demo: Enter any email and password to sign in</p>
      </div>
    </div>
  );
}
