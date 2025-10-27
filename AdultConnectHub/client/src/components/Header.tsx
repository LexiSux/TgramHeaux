import { Search, Menu, User, Plus, Coins, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Link } from "wouter";
import { useAuth } from "@/lib/auth";
import AuthModal from "./AuthModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface HeaderProps {
  onSearch?: (query: string) => void;
}

export default function Header({ onSearch }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isDark, setIsDark] = useState(true);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const { user, logout } = useAuth();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(searchQuery);
    console.log("Search:", searchQuery);
  };

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle("dark");
    console.log("Theme toggled");
  };

  return (
    <>
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 gap-4">
            <div className="flex items-center gap-6">
              <Button variant="ghost" size="icon" className="lg:hidden" data-testid="button-menu">
                <Menu className="w-5 h-5" />
              </Button>
              
              <Link href="/" className="flex items-center gap-2" data-testid="link-logo">
                <div className="w-8 h-8 rounded-md bg-gradient-to-br from-primary to-chart-2 flex items-center justify-center">
                  <span className="text-white font-bold text-lg">L</span>
                </div>
                <span className="font-bold text-xl hidden sm:block">Love Directory</span>
              </Link>

              <nav className="hidden lg:flex items-center gap-1">
                <Link href="/browse">
                  <Button variant="ghost" className="text-sm" data-testid="link-explore">Explore</Button>
                </Link>
                <Link href="/browse">
                  <Button variant="ghost" className="text-sm" data-testid="link-models">Models</Button>
                </Link>
                <Link href="/browse">
                  <Button variant="ghost" className="text-sm" data-testid="link-personals">Personals</Button>
                </Link>
                <Link href="/community">
                  <Button variant="ghost" className="text-sm" data-testid="link-community">Community</Button>
                </Link>
              </nav>
            </div>

            <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search by location, category..."
                  className="pl-10 bg-muted/50"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  data-testid="input-search"
                />
              </div>
            </form>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                data-testid="button-theme-toggle"
              >
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </Button>

              {user ? (
                <>
                  <Button variant="outline" className="gap-2 hidden sm:flex" data-testid="button-coins">
                    <Coins className="w-4 h-4 text-chart-3" />
                    <span className="font-semibold">{user.loveCoins}</span>
                    <span className="text-muted-foreground text-xs">Coins</span>
                  </Button>

                  <Button className="gap-2 hidden sm:flex" data-testid="button-create-listing">
                    <Plus className="w-4 h-4" />
                    Create Listing
                  </Button>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" data-testid="button-user-menu">
                        <User className="w-5 h-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem data-testid="menu-dashboard">Dashboard</DropdownMenuItem>
                      <DropdownMenuItem data-testid="menu-my-listings">My Listings</DropdownMenuItem>
                      <DropdownMenuItem data-testid="menu-favorites">Favorites</DropdownMenuItem>
                      <DropdownMenuItem data-testid="menu-buy-coins">Buy Love Coins</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem data-testid="menu-settings">Settings</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => logout()} data-testid="menu-logout">
                        Logout
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <>
                  <Button variant="outline" onClick={() => setAuthModalOpen(true)} data-testid="button-login">
                    Login
                  </Button>
                  <Button onClick={() => setAuthModalOpen(true)} data-testid="button-signup">
                    Sign Up
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} />
    </>
  );
}
