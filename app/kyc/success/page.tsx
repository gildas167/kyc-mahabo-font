"use client";

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Copy, Home } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import KycFormHeader from '@/components/kyc/kyc-form-header';

export default function KycSuccess() {
  const searchParams = useSearchParams();
  const publicId = searchParams.get('id');
  const { toast } = useToast();

  const copyToClipboard = () => {
    if (!publicId) return;
    
    navigator.clipboard.writeText(publicId);
    toast({
      title: "Copié!",
      description: "Numéro de demande copié dans le presse-papiers.",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <KycFormHeader />
      
      <main className="container mx-auto py-10 px-4">
        <Card className="max-w-2xl mx-auto">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 bg-green-100 rounded-full p-3 w-16 h-16 flex items-center justify-center">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl">Demande soumise avec succès!</CardTitle>
          </CardHeader>
          
          <CardContent className="text-center">
            <p className="mb-6 text-gray-600">
              Votre demande de vérification KYC a été reçue et est en cours de traitement. Veuillez conserver précieusement votre numéro de référence:
            </p>
            
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6 flex items-center justify-between">
              <span className="font-mono text-lg">{publicId}</span>
              <Button variant="ghost" size="sm" onClick={copyToClipboard}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="bg-amber-50 border border-amber-100 rounded-lg p-4 text-left">
              <h3 className="font-medium text-amber-800 mb-1">Important:</h3>
              <ul className="text-sm text-amber-700 space-y-1">
                <li>• Un e-mail de confirmation a été envoyé à l'adresse fournie.</li>
                <li>• Le délai de traitement est généralement de 2-3 jours ouvrables.</li>
                <li>• Vous pouvez vérifier l'état de votre demande à tout moment.</li>
              </ul>
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-between">
            <Link href="/">
              <Button variant="outline">
                <Home className="mr-2 h-4 w-4" /> Retour à l'accueil
              </Button>
            </Link>
            <Link href={`/kyc/status?id=${publicId}`}>
              <Button>
                Vérifier l'état
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
}