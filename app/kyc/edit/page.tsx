"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { updateKycRequest } from "@/lib/api";
import KycFormHeader from "@/components/kyc/kyc-form-header";

export default function EditKycRequest() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();
  
  const publicId = searchParams.get("id");
  const [editCode, setEditCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    nom: "",
    prenoms: "",
    sex: "",
    dateNaissance: "",
    nationalite: "",
    address: "",
    telephone: "",
    email: "",
  });

  // Redirect if no publicId is provided
  useEffect(() => {
    if (!publicId) {
      router.push("/kyc/status");
    }
  }, [publicId, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRadioChange = (value: string) => {
    setFormData((prev) => ({ ...prev, sex: value }));
  };

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, nationalite: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editCode) {
      toast({
        title: "Code manquant",
        description: "Veuillez entrer le code de modification reçu par e-mail.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const dataToSubmit = {
        ...formData,
        editCode,
      };
      
      if (!publicId) throw new Error("ID de demande manquant");
      
      await updateKycRequest(publicId, dataToSubmit);
      
      toast({
        title: "Mise à jour réussie",
        description: "Votre demande KYC a été mise à jour avec succès.",
      });
      
      // Redirect to status page
      router.push(`/kyc/status?id=${publicId}`);
      
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de la mise à jour. Le code pourrait être invalide ou expiré.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <KycFormHeader />
      
      <main className="container mx-auto py-10 px-4">
        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle>Modifier votre demande KYC</CardTitle>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mb-6">
                <p className="text-blue-700 text-sm">
                  <strong>ID de la demande:</strong> {publicId}
                </p>
                <p className="text-blue-700 text-sm mt-2">
                  Pour modifier votre demande, saisissez le code de modification reçu par e-mail puis mettez à jour vos informations.
                </p>
              </div>
              
              <div>
                <Label htmlFor="editCode">Code de modification *</Label>
                <Input 
                  id="editCode" 
                  value={editCode} 
                  onChange={(e) => setEditCode(e.target.value)} 
                  placeholder="Entrez le code reçu par e-mail"
                  required 
                  className="font-mono"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="nom">Nom</Label>
                  <Input 
                    id="nom" 
                    name="nom" 
                    value={formData.nom} 
                    onChange={handleChange} 
                  />
                </div>
                <div>
                  <Label htmlFor="prenoms">Prénoms</Label>
                  <Input 
                    id="prenoms" 
                    name="prenoms" 
                    value={formData.prenoms} 
                    onChange={handleChange} 
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="sex" className="block mb-2">Sexe</Label>
                <RadioGroup 
                  value={formData.sex} 
                  onValueChange={handleRadioChange}
                  className="flex space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="M" id="male" />
                    <Label htmlFor="male">Masculin</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="F" id="female" />
                    <Label htmlFor="female">Féminin</Label>
                  </div>
                </RadioGroup>
              </div>
              
              <div>
                <Label htmlFor="dateNaissance">Date de naissance</Label>
                <Input 
                  id="dateNaissance" 
                  name="dateNaissance" 
                  type="date" 
                  value={formData.dateNaissance} 
                  onChange={handleChange} 
                />
              </div>
              
              <div>
                <Label htmlFor="nationalite">Nationalité</Label>
                <Select onValueChange={handleSelectChange} value={formData.nationalite}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez votre nationalité" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="benin">Bénin</SelectItem>
                    <SelectItem value="senegal">Sénégal</SelectItem>
                    <SelectItem value="cote_ivoire">Côte d'Ivoire</SelectItem>
                    <SelectItem value="togo">Togo</SelectItem>
                    <SelectItem value="cameroun">Cameroun</SelectItem>
                    <SelectItem value="burkina_faso">Burkina Faso</SelectItem>
                    <SelectItem value="mali">Mali</SelectItem>
                    <SelectItem value="niger">Niger</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="address">Adresse</Label>
                <Textarea 
                  id="address" 
                  name="address" 
                  value={formData.address} 
                  onChange={handleChange} 
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="telephone">Téléphone</Label>
                  <Input 
                    id="telephone" 
                    name="telephone" 
                    value={formData.telephone} 
                    onChange={handleChange} 
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    name="email" 
                    type="email" 
                    value={formData.email} 
                    onChange={handleChange} 
                  />
                </div>
              </div>
              
              <p className="text-sm text-gray-500 mt-4">
                Note: Laissez vides les champs que vous ne souhaitez pas modifier.
              </p>
            </form>
          </CardContent>
          
          <CardFooter className="flex justify-between">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => router.push(`/kyc/status?id=${publicId}`)}
            >
              Annuler
            </Button>
            <Button 
              type="submit" 
              onClick={handleSubmit}
              disabled={isSubmitting || !editCode}
            >
              {isSubmitting ? "Mise à jour..." : "Mettre à jour"}
            </Button>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
}