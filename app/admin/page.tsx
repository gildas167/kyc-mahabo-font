"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Lock, ShieldCheck } from "lucide-react";
import { requestLoginCode, adminLogin } from "@/lib/api";
import Link from "next/link";

export default function AdminLogin() {
  const router = useRouter();
  const { toast } = useToast();
  
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleRequestCode = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Email requis",
        description: "Veuillez entrer votre adresse email.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      await requestLoginCode(email);
      
      toast({
        title: "Code envoyé",
        description: "Un code de connexion a été envoyé à votre adresse email.",
      });
      
      setIsCodeSent(true);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de l'envoi du code.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!code) {
      toast({
        title: "Code requis",
        description: "Veuillez entrer le code reçu par email.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await adminLogin(email, code);
      
      // Store token in localStorage
      localStorage.setItem('adminToken', response.token);
      
      toast({
        title: "Connexion réussie",
        description: "Vous êtes maintenant connecté à l'interface d'administration.",
      });
      
      // Redirect to admin dashboard
      router.push('/admin/dashboard');
    } catch (error) {
      toast({
        title: "Erreur de connexion",
        description: "Code invalide ou expiré. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-200 py-4">
        <div className="container mx-auto px-4">
          <Link href="/" className="flex items-center space-x-2">
            <ShieldCheck className="h-6 w-6 text-blue-700" />
            <span className="font-semibold">Mahabo KYC</span>
          </Link>
        </div>
      </header>
      
      <main className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 bg-blue-100 rounded-full p-3 w-16 h-16 flex items-center justify-center">
              <Lock className="h-8 w-8 text-blue-700" />
            </div>
            <CardTitle>Administration</CardTitle>
            <CardDescription>
              {isCodeSent
                ? "Entrez le code reçu par email pour vous connecter"
                : "Entrez votre email pour recevoir un code de connexion"}
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {!isCodeSent ? (
              <form onSubmit={handleRequestCode}>
                <div className="space-y-4">
                  <div>
                    <Input
                      type="email"
                      placeholder="adresse@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isLoading}
                  >
                    {isLoading ? "Envoi..." : "Recevoir un code de connexion"}
                  </Button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleLogin}>
                <div className="space-y-4">
                  <div className="bg-blue-50 p-3 rounded-md text-sm text-blue-700 mb-4">
                    Un code a été envoyé à {email}
                  </div>
                  
                  <Input
                    type="text"
                    placeholder="Entrez le code à 6 chiffres"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="text-center text-lg font-mono tracking-widest"
                    maxLength={6}
                    required
                  />
                  
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isLoading}
                  >
                    {isLoading ? "Connexion..." : "Se connecter"}
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
          
          <CardFooter className="flex justify-center">
            {isCodeSent && (
              <Button 
                variant="link" 
                onClick={() => setIsCodeSent(false)}
                disabled={isLoading}
              >
                Utiliser une autre adresse email
              </Button>
            )}
          </CardFooter>
        </Card>
      </main>
    </div>
  );
}