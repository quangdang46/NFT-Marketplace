import { Header } from "@/components/features/nav-bar/Header";
export default function Wrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col  text-white">
      <div className="fixed top-0 left-0 right-0 z-100">
        <Header />
      </div>
      <main className="container mx-auto pt-10 md:pt-20 pb-4 py-4 mt-5">
        {children}
      </main>
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
