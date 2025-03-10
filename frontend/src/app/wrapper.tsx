import { Header } from "@/components/Header";

export const iframeHeight = "800px";

export default function Wrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col  text-white">
      <Header />

      <main className="pt-15 pb-10 flex-grow">{children}</main>

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
