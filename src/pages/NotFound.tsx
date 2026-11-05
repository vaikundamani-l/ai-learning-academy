import { Link } from 'react-router-dom';
export function NotFound() {
  return <div className="max-w-xl mx-auto py-16 space-y-4">
    <p className="text-sm font-mono text-cyber-sky">PAGE NOT FOUND</p>
    <h1 className="text-3xl font-bold text-slate-100">Let’s get you back on track.</h1>
    <p className="text-slate-400">This stage, lesson, or page is not available. Browse the curriculum to find a valid destination.</p>
    <Link to="/curriculum" className="inline-flex rounded-lg px-4 py-3 bg-cyber-sky text-void font-semibold">Browse curriculum</Link>
  </div>;
}
