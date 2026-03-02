interface ProfileHeaderProps {
  is2faEnabled: boolean;
}

export default function ProfileHeader({ is2faEnabled }: ProfileHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6">
      <div>
        <h1 className="text-2xl md:text-4xl font-bold tracking-tight text-slate-900">Security & Profile</h1>
        <p className="text-sm md:text-base text-slate-500 font-medium">Manage your identity and banking-grade security protocols.</p>
      </div>
      <div className="bg-emerald-50 border border-emerald-100 px-4 py-2 sm:px-6 sm:py-3 rounded-xl flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-center sm:text-left">
        <div className="flex -space-x-1">
           <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
           <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
           <div className={`w-2.5 h-2.5 rounded-full ${is2faEnabled ? 'bg-emerald-500' : 'bg-slate-300'}`} />
        </div>
        <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest">
          Security Status: {is2faEnabled ? 'Optimal' : 'Needs Attention'}
        </span>
      </div>
    </div>
  );
}

