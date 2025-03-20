import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const SUPPORTED_CHAINS = ["ethereum", "solana", "polygon"];

export function chainMiddleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const chainMatch = pathname.match(
    /\/(collections|profile|launchpad)\/([^/]+)/
  );

  if (!chainMatch) {
    return NextResponse.next();
  }

  const [, route, chain] = chainMatch;

  if (!SUPPORTED_CHAINS.includes(chain.toLowerCase())) {
    return NextResponse.redirect(new URL("/404", request.url));
  }

  const addressMatch = pathname.match(/\/[^/]+\/[^/]+\/([^/]+)/);
  if (addressMatch) {
    const [, address] = addressMatch;
    if (!isValidAddress(chain, address)) {
      return NextResponse.redirect(new URL("/404", request.url));
    }
  }

  return NextResponse.next();
}

function isValidAddress(chain: string, address: string): boolean {
  switch (chain.toLowerCase()) {
    case "ethereum":
    case "polygon":
      return /^0x[a-fA-F0-9]{40}$/.test(address);
    case "solana":
      return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address);
    default:
      return false;
  }
}
