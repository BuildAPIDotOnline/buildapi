import { ShieldEllipsis } from 'lucide-react';

export default function SecurityTip() {
  return (
    <div className="bg-slate-900 rounded-xl p-8 text-white relative overflow-hidden">
      <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-blue-500/10 blur-3xl" />
      <h4 className="font-bold mb-4 flex items-center gap-2 italic">
        <ShieldEllipsis size={20} className="text-blue-400" /> Security Tip
      </h4>
      <p className="text-xs text-slate-400 leading-relaxed">
        Enable hardware security keys for maximum protection of your Banking and CRM endpoints.
      </p>
    </div>
  );
}

