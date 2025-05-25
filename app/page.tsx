import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Lock, Search, ShieldCheck, Users } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b border-gray-200 py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="h-8 w-8 text-blue-700" />
            <span className="text-xl font-bold">Mahabo KYC</span>
          </div>
          <div className="space-x-2">
            {/* <Link href="/admin">
              <Button variant="outline" size="sm">Admin Portal</Button>
            </Link> */}
            <Link href="/kyc/new">
              <Button size="sm">Démarrer la vérification</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="bg-gradient-to-b from-blue-50 to-white py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Vérification KYC simple et sécurisée
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10">
              Vérification d'identité rapide et fiable pour vous aider à démarrer rapidement et en toute sécurité.            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/kyc/new">
                <Button size="lg" className="gap-2">
                  Démarrer la vérification <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/kyc/status">
                <Button size="lg" variant="outline" className="gap-2">
                  Vérifier le statut <Search className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Comment ça marche</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-blue-50 rounded-lg p-6 text-center">
                <div className="bg-blue-100 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-blue-700" />
                </div>
                <h3 className="text-xl font-semibold mb-3">1. Soumettre des informations</h3>
                <p className="text-gray-600">
                  Remplissez le formulaire KYC avec vos informations personnelles et téléchargez les documents requis.                </p>
              </div>

              <div className="bg-blue-50 rounded-lg p-6 text-center">
                <div className="bg-blue-100 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Lock className="h-8 w-8 text-blue-700" />
                </div>
                <h3 className="text-xl font-semibold mb-3">2. Processus de vérification</h3>
                <p className="text-gray-600">
                  Notre équipe vérifie la conformité de vos informations et documents.                </p>
              </div>

              <div className="bg-blue-50 rounded-lg p-6 text-center">
                <div className="bg-blue-100 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShieldCheck className="h-8 w-8 text-blue-700" />
                </div>
                <h3 className="text-xl font-semibold mb-3">3. Obtenez l'approbation</h3>
                <p className="text-gray-600">
                  Recevez une confirmation une fois votre identité vérifiée et approuvée.                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-50 border-t border-gray-200 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <ShieldCheck className="h-6 w-6 text-blue-700" />
              <span className="font-semibold">Mahabo KYC</span>
            </div>
            <div className="text-gray-500 text-sm">
              © {new Date().getFullYear()} Mahabo. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}