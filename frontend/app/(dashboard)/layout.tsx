"use client"
import type React from "react"
import { MainNav } from "@/components/main-nav"
import { UserNav } from "@/components/user-nav"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [navOpen, setNavOpen] = useState(false)
  return (
    <div className="flex min-h-screen">
      <div className="md:w-64 border-r bg-background md:block">
      <div className="flex h-full flex-col">
        <div className="flex-1 overflow-y-auto fixed">
          <MainNav navOpen={navOpen} setNavOpen={setNavOpen} />
        </div>
      </div>
    </div>

      <div className="flex-1">
        <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-6">
          <div className="flex flex-1 items-center justify-between">
            <Button
              variant="ghost"
              className="lg:hidden"
              onClick={() => setNavOpen(!navOpen)}
            >
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle menu</span>
            </Button>
            <UserNav/>
          </div>
        </header>
        <main className="flex-1 p-6 md:p-8 pt-6">{children}</main>
      </div>
    </div>
  )
}
