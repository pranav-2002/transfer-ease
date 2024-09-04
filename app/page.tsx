import Home from "@/components/home/Home";
import Sidebar from "@/components/sidebar/Sidebar";

export default function Page({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar>
        <Home />
      </Sidebar>
    </div>
  );
}
