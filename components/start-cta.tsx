import Link from "next/link";
import { Button } from "@/components/ui/button";
import { WhatsAppIcon } from "@/components/whatsapp-icon";
import { DASHBOARD_URL, WHATSAPP_URL } from "@/lib/site";

/*
  The one "start" call to action (Nov 2026), used by the hero, the use-case
  cards, the mobile menu and the closing band.

    phones (under 640px)  "Start on your WhatsApp"  → the Rizely WhatsApp chat,
                          where the free scans run; no new app to install.
    640px and up          "Start free"              → the app (app.rizely.net).

  Both are in the HTML and CSS shows one, so there is no device sniffing and
  nothing renders differently on the server.
*/
export const MOBILE_START = "Start on your WhatsApp";
export const DESKTOP_START = "Start free";

export function StartCta({
  size = "default",
  className = "",
  onClick,
}: {
  size?: "default" | "sm" | "lg";
  className?: string;
  onClick?: () => void;
}) {
  return (
    <>
      <Button asChild size={size} className={`cta-sunrise sm:hidden ${className}`}>
        <Link href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" onClick={onClick}>
          <WhatsAppIcon className="size-5" />
          {MOBILE_START}
        </Link>
      </Button>
      <Button asChild size={size} className={`cta-sunrise hidden sm:inline-flex ${className}`}>
        <Link href={DASHBOARD_URL} target="_blank" rel="noopener noreferrer" onClick={onClick}>
          {DESKTOP_START}
        </Link>
      </Button>
    </>
  );
}
