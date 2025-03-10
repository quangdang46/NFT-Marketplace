import { Header } from "@/components/Header";
import TabChains from "@/features/home/components/TabChains/TabChains";

export const iframeHeight = "800px";

export default function Wrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col  text-white">
      <div className="fixed top-0 left-0 right-0 z-50">
        <Header />
        <TabChains />
      </div>
      <main className="pt-20 sm:pt-25 pb-10 flex-grow">{children}</main>
      <footer className="border-t border-white/5 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between text-white/40 text-sm">
          <div>© 2023 Magic Eden Marketplace</div>
          <div className="flex gap-4 mt-4 md:mt-0">
            <a href="#" className="hover:text-white/60 transition-colors">
              Terms
            </a>
            <a href="#" className="hover:text-white/60 transition-colors">
              Privacy
            </a>
            <a href="#" className="hover:text-white/60 transition-colors">
              Help
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
