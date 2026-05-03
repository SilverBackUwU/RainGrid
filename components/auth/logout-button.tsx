import { LogOut } from "lucide-react";
import { logout } from "@/lib/auth/actions";

export function LogoutButton() {
  return (
    <form action={logout}>
      <button
        type="submit"
        className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-zinc-200 bg-white px-3 text-sm font-medium text-zinc-700 transition hover:border-zinc-300 hover:bg-zinc-50"
      >
        <LogOut className="h-4 w-4" aria-hidden="true" />
        Logout
      </button>
    </form>
  );
}
