"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Clock, HomeIcon, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getKycStatus, requestEditCode } from "@/lib/api";
import KycFormHeader from "@/components/kyc/kyc-form-header";
import Link from "next/link";

export default function KycStatus() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();
  
  const [publicId, setPublicId] = useState(searchParams.get("id") || "");
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [checked, setChecked] = useState(false);

  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!publicId) {
      toast({
        title: "Numéro manquant",
        description: "Veuillez entrer le numéro de votre demande KYC.",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await getKycStatus(publicId);
      setStatus(response.status);
      setChecked(true);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Numéro de demande invalide ou demande non trouvée.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRequestEditCode = async () => {
    if (!publicId) return;
    
    setLoading(true);
    
    try {
      await requestEditCode(publicId);
      toast({
        title: "Code envoyé",
        description: "Un code de modification a été envoyé à votre adresse e-mail.",
      });
      
      // Redirect to the edit page
      router.push(`/kyc/edit?id=${publicId}`);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de l'envoi du code.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const renderStatusIndicator = () => {
    if (!status) return null;
    
    switch (status) {
      case "pending":
        return (
          <div className="flex flex-col items-center p-6 bg-yellow-50 rounded-lg">
            <Clock className="h-12 w-12 text-yellow-500 mb-3" />
            <h3 className="text-lg font-medium text-yellow-700">En attente</h3>
            <p className="text-sm text-yellow-600 text-center mt-2">
              Votre demande est en cours d'examen. Nous vous notifierons dès qu'une décision sera prise.
            </p>
          </div>
        );
      case "approved":
        return (
          <div className="flex flex-col items-center p-6 bg-green-50 rounded-lg">
            <CheckCircle2 className="h-12 w-12 text-green-500 mb-3" />
            <h3 className="text-lg font-medium text-green-700">Approuvée</h3>
            <p className="text-sm text-green-600 text-center mt-2">
              Félicitations! Votre demande KYC a été approuvée. Vous pouvez maintenant accéder à tous nos services.
            </p>
          </div>
        );
      case "rejected":
        return (
          <div className="flex flex-col items-center p-6 bg-red-50 rounded-lg">
            <XCircle className="h-12 w-12 text-red-500 mb-3" />
            <h3 className="text-lg font-medium text-red-700">Rejetée</h3>
            <p className="text-sm text-red-600 text-center mt-2">
              Votre demande a été rejetée. Veuillez vérifier les informations fournies et soumettre une nouvelle demande.
            </p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <KycFormHeader />
      
      <main className="container mx-auto py-10 px-4">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Vérifier l'état de votre demande KYC</CardTitle>
            <CardDescription>
              Entrez le numéro de référence de votre demande pour vérifier son statut
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleCheck} className="space-y-4">
              <div>
                <Input 
                  placeholder="Ex: KYC-MAHABO-20250523-ABC123" 
                  value={publicId} 
                  onChange={(e) => setPublicId(e.target.value)}
                />
              </div>
              
              <Button 
                type="submit"
                disabled={loading || !publicId}
                className="w-full"
              >
                {loading ? "Chargement..." : "Vérifier l'état"}
              </Button>
            </form>
            
            {checked && (
              <div className="mt-8 space-y-4">
                {renderStatusIndicator()}
                
                {status === "pending" && (
                  <div className="mt-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
                    <h4 className="font-medium mb-2">Besoin de modifier votre demande?</h4>
                    <p className="text-sm text-gray-600 mb-4">
                      Vous pouvez demander un code de modification qui sera envoyé à votre adresse e-mail.
                    </p>
                    <Button 
                      onClick={handleRequestEditCode}
                      disabled={loading}
                      variant="outline"
                    >
                      Demander un code de modification
                    </Button>
                  </div>
                )}
              </div>
            )}
          </CardContent>
          
          <CardFooter>
            <Link href="/" className="w-full">
              <Button variant="outline" className="w-full">
                <HomeIcon className="mr-2 h-4 w-4" /> Retour à l'accueil
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
}