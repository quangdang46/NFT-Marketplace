import { Space_Grotesk } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import Wrapper from "@/app/wrapper";
import { Toaster } from "@/components/ui/sonner";
import "@rainbow-me/rainbowkit/styles.css";
import "./globals.css";
import { Providers } from "@/components/providers/Providers";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${spaceGrotesk.variable} antialiased`}>
        <Providers>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <Wrapper>
              {children}
              <Toaster />
            </Wrapper>
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
