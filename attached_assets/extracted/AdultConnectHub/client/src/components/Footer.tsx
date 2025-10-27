import { Heart } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="font-semibold mb-4">About</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-foreground transition" data-testid="link-about">About Us</a></li>
              <li><a href="#" className="hover:text-foreground transition" data-testid="link-how-it-works">How It Works</a></li>
              <li><a href="#" className="hover:text-foreground transition" data-testid="link-safety">Safety & Trust</a></li>
              <li><a href="#" className="hover:text-foreground transition" data-testid="link-verification">Verification</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">For Entertainers</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-foreground transition" data-testid="link-pricing">Pricing & Tiers</a></li>
              <li><a href="#" className="hover:text-foreground transition" data-testid="link-upgrades">Upgrades</a></li>
              <li><a href="#" className="hover:text-foreground transition" data-testid="link-success">Success Stories</a></li>
              <li><a href="#" className="hover:text-foreground transition" data-testid="link-resources">Resources</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-foreground transition" data-testid="link-help">Help Center</a></li>
              <li><a href="#" className="hover:text-foreground transition" data-testid="link-contact">Contact Us</a></li>
              <li><a href="#" className="hover:text-foreground transition" data-testid="link-report">Report Issue</a></li>
              <li><a href="#" className="hover:text-foreground transition" data-testid="link-feedback">Feedback</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-foreground transition" data-testid="link-terms">Terms of Service</a></li>
              <li><a href="#" className="hover:text-foreground transition" data-testid="link-privacy">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-foreground transition" data-testid="link-gdpr">GDPR</a></li>
              <li><a href="#" className="hover:text-foreground transition" data-testid="link-dmca">DMCA</a></li>
            </ul>
          </div>
        </div>

        <Separator className="mb-8" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-primary to-chart-2 flex items-center justify-center">
              <span className="text-white font-bold text-sm">L</span>
            </div>
            <span>© {currentYear} Love Directory. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-1">
            <span>Made with</span>
            <Heart className="w-4 h-4 text-rose-500 fill-current" />
            <span>for safety and discretion</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
