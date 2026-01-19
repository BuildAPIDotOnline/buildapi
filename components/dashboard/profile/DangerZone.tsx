import { AlertTriangle, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function DangerZone() {
  return (
    <div className="mt-12 bg-red-50 border border-red-100 rounded-xl p-10 flex flex-col md:flex-row items-center justify-between gap-8">
      <div className="max-w-md">
         <h4 className="text-xl font-bold text-red-900 mb-2 flex items-center gap-2 italic">
           <AlertTriangle size={20} /> Danger Zone
         </h4>
         <p className="text-red-700/70 text-sm leading-relaxed">
           Deleting your account will permanently remove all API keys, Banking logs, and CRM data. This action is irreversible.
         </p>
      </div>
      <Button className="bg-red-500 text-white px-8 py-4 rounded-2xl font-bold hover:bg-red-700 ">
        <Trash2 size={18} /> Deactivate Account
      </Button>
    </div>
  );
}

