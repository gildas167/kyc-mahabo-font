import Link from 'next/link';
import { ShieldCheck } from 'lucide-react';

export default function KycFormHeader() {
  return (
    <header className="bg-white border-b border-gray-200 py-4">
      <div className="container mx-auto px-4">
        <Link href="/" className="flex items-center space-x-2">
          <ShieldCheck className="h-6 w-6 text-blue-700" />
          <span className="font-semibold">Mahabo KYC</span>
        </Link>
      </div>
    </header>
  );
}