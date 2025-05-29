"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  LayoutDashboard,
  FileText,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  LayoutTemplate,
  SatelliteDishIcon,
} from "lucide-react"

export function MainNav({ navOpen, setNavOpen }: { navOpen: boolean, setNavOpen: (value: boolean) => void }) {
  const pathname = usePathname()
  const { logout } = useAuth()

  const routes = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      name: "Forms",
      path: "/forms",
      icon: <FileText className="h-5 w-5" />,
    },
    {
      name: "Templates",
      path: "/templates",
      icon: <LayoutTemplate className="h-5 w-5" />,
    }
  ]

  const NavLinks = () => (
    <>
      {routes.map((route) => (
        <Link
          key={route.path}
          href={route.path}
          className={cn(
            "flex items-center gap-2 px-4 py-3 rounded-xl transition-all",
            pathname === route.path ? "bg-primary text-primary-foreground" : "hover:bg-muted",
          )}
          onClick={() => setNavOpen(false)}
        >
          {route.icon}
          <span>{route.name}</span>
        </Link>
      ))}
      <Button
        variant="ghost"
        className="flex items-center gap-2 px-4 py-3 justify-start rounded-xl hover:bg-destructive/10 hover:text-destructive"
        onClick={() => {
          setNavOpen(false)
          logout()
        }}
      >
        <LogOut className="h-5 w-5" />
        <span>Logout</span>
      </Button>
    </>
  )

  return (
    <>
      {/* Mobile Navigation */}
      <div className="lg:hidden flex items-center">
        <Sheet open={navOpen} onOpenChange={setNavOpen}>
          
          <SheetContent side="left" className="p-0">
            <div className="p-6">
              <div className="flex items-center justify-between mb-8">
                <Link href="/dashboard" className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-brand-purple to-brand-pink flex items-center justify-center text-white font-bold">
                    F
                  </div>
                  <span className="text-xl font-bold">Formably</span>
                </Link>
                <Button variant="ghost" size="icon" onClick={() => setNavOpen(false)}>
                  <X className="h-5 w-5" />
                  <span className="sr-only">Close</span>
                </Button>
              </div>
              <nav className="flex flex-col gap-1">
                <NavLinks />
              </nav>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden lg:flex h-screen flex-col border-r bg-card">
        <div className="p-6">
          <Link href="/dashboard" className="flex items-center gap-2 mb-8">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-r from-brand-purple to-brand-pink flex items-center justify-center text-white font-bold text-xl">
              F
            </div>
            <span className="text-2xl font-bold">Formably</span>
          </Link>
          <nav className="flex flex-col gap-1">
            <NavLinks />
          </nav>
        </div>
      </div>
    </>
  )
}
