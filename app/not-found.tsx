import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6">
      <h1 className="text-2xl" style={{ fontFamily: 'var(--font-geist)', fontWeight: 600 }}><span>Page not found</span></h1>
      <p className="text-sm text-neutral-600 mt-1"><span>The page you are looking for doesn&apos;t exist.</span></p>
      <Link href="/" className="mt-4 inline-block px-3 py-2 text-sm rounded-md border border-neutral-200/70"><span>Go home</span></Link>
    </div>
  );
}
