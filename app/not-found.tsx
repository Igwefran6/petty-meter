import Link from "next/link";
import { Ghost, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-bg-light text-center">
      <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center text-primary mb-6 animate-bounce">
        <Ghost size={48} />
      </div>

      <h1 className="text-4xl md:text-5xl font-black text-dark mb-4">
        404: This Page is Ghosting You
      </h1>

      <p className="text-lg md:text-xl text-muted mb-8 max-w-md">
        Unlike your ex, we'll tell you straight up: this page doesn't exist.
        It's giving... invisible.
      </p>

      <Link
        href="/"
        className="bg-primary text-white font-bold py-3 px-8 rounded-xl shadow-lg hover:bg-orange-600 transition-all flex items-center gap-2 transform hover:scale-105 active:scale-95"
      >
        <ArrowLeft size={20} />
        Go Back to the Drama
      </Link>
    </div>
  );
}
