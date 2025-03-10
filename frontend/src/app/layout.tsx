import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import Wrapper from "@/app/wrapper";
import { Toaster } from "@/components/ui/sonner";
import "@rainbow-me/rainbowkit/styles.css";
import "./globals.css";
import { Providers } from "@/components/providers/Providers";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
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
