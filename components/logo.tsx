import Link from "next/link";

export function Logo() {
  return (
    <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
      <div className="bg-primary text-primary-foreground h-8 w-8 rounded-lg flex items-center justify-center">
        <span className="text-xl">A</span>
      </div>
      <span className="hidden sm:inline-block">Antigravity</span>
    </div>
  );
}
