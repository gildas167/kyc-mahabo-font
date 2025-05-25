"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, ArrowRight, Upload, CheckCircle, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { submitKycRequest } from "@/lib/api";
import KycFormHeader from "@/components/kyc/kyc-form-header";
import { FilePreview } from "@/components/ui/file-preview";
import FilePreviewCard from "@/components/kyc/file-preview-card";

export default function NewKycRequest() {
  const router = useRouter();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
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
    documentId: "",
    documentType: "",
    justificatifId: "",
    justificatifType: "",
  });
  
  const [files, setFiles] = useState({
    document: null as File | null,
    justificatif: null as File | null,
  });

  const [previewState, setPreviewState] = useState({
    isOpen: false,
    currentFile: null as File | null
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRadioChange = (value: string) => {
    setFormData((prev) => ({ ...prev, sex: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files: fileList } = e.target;
    if (fileList && fileList[0]) {
      setFiles((prev) => ({ ...prev, [name]: fileList[0] }));
    }
  };

  const openFilePreview = (e: React.MouseEvent, file: File | null) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!file) return;
    
    setPreviewState({
      isOpen: true,
      currentFile: file
    });
  };

  const closeFilePreview = () => {
    setPreviewState({
      isOpen: false,
      currentFile: null
    });
  };

  const nextStep = () => {
    // Simple validation
    if (step === 1) {
      if (!formData.nom || !formData.prenoms || !formData.sex || !formData.dateNaissance) {
        toast({
          title: "Information manquante",
          description: "Veuillez remplir tous les champs obligatoires.",
          variant: "destructive",
        });
        return;
      }
    } else if (step === 2) {
      if (!formData.nationalite || !formData.address || !formData.telephone || !formData.email) {
        toast({
          title: "Information manquante",
          description: "Veuillez remplir tous les champs obligatoires.",
          variant: "destructive",
        });
        return;
      }
    } else if (step === 3) {
      if (!formData.documentId || !formData.documentType || !formData.justificatifId || !formData.justificatifType || !files.document || !files.justificatif) {
        toast({
          title: "Documents manquants",
          description: "Veuillez télécharger tous les documents requis et sélectionner leurs types.",
          variant: "destructive",
        });
        return;
      }
    }
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsSubmitting(true);
    
    try {
      const formDataToSubmit = new FormData();
      
      // Add text fields
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSubmit.append(key, value);
      });
      
      // Add files
      if (files.document) formDataToSubmit.append('document', files.document);
      if (files.justificatif) formDataToSubmit.append('justificatif', files.justificatif);
      
      const response = await submitKycRequest(formDataToSubmit);
      
      toast({
        title: "Demande soumise avec succès",
        description: `Votre numéro de demande est: ${response.publicId}`,
      });
      
      // Navigate to success page with the publicId
      router.push(`/kyc/success?id=${response.publicId}`);
      
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de la soumission de votre demande.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderRecap = () => {
    return (
      <div className="space-y-6">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <div className="flex items-center text-green-700 mb-2">
            <CheckCircle className="h-5 w-5 mr-2" />
            <h3 className="font-medium">Vérification finale</h3>
          </div>
          <p className="text-green-600 text-sm">
            Veuillez vérifier les informations ci-dessous avant de soumettre votre demande.
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="font-medium mb-3">Informations personnelles</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm bg-muted/30 rounded-lg p-4">
              <div>
                <span className="text-muted-foreground block">Nom:</span>
                <p className="font-medium">{formData.nom}</p>
              </div>
              <div>
                <span className="text-muted-foreground block">Prénoms:</span>
                <p className="font-medium">{formData.prenoms}</p>
              </div>
              <div>
                <span className="text-muted-foreground block">Sexe:</span>
                <p className="font-medium">{formData.sex === 'M' ? 'Masculin' : 'Féminin'}</p>
              </div>
              <div>
                <span className="text-muted-foreground block">Date de naissance:</span>
                <p className="font-medium">{formData.dateNaissance}</p>
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="font-medium mb-3">Coordonnées</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm bg-muted/30 rounded-lg p-4">
              <div>
                <span className="text-muted-foreground block">Nationalité:</span>
                <p className="font-medium">{formData.nationalite}</p>
              </div>
              <div>
                <span className="text-muted-foreground block">Téléphone:</span>
                <p className="font-medium">{formData.telephone}</p>
              </div>
              <div>
                <span className="text-muted-foreground block">Email:</span>
                <p className="font-medium">{formData.email}</p>
              </div>
              <div>
                <span className="text-muted-foreground block">Adresse:</span>
                <p className="font-medium">{formData.address}</p>
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="font-medium mb-3">Documents</h3>
            <div className="grid grid-cols-1 gap-4 text-sm bg-muted/30 rounded-lg p-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <span className="text-muted-foreground block">N° Document d'identité:</span>
                  <p className="font-medium">{formData.documentId}</p>
                  <p className="text-sm text-muted-foreground mt-1">{formData.documentType}</p>
                </div>
                <div>
                  <span className="text-muted-foreground block">N° Justificatif de domicile:</span>
                  <p className="font-medium">{formData.justificatifId}</p>
                  <p className="text-sm text-muted-foreground mt-1">{formData.justificatifType}</p>
                </div>
              </div>
              
              <div className="mt-2 space-y-3">
                <span className="text-muted-foreground block">Documents fournis:</span>
                
                {files.document && (
                  <FilePreviewCard 
                    file={files.document}
                    fileName={files.document.name}
                    onClick={(e) => openFilePreview(e, files.document)}
                  />
                )}
                
                {files.justificatif && (
                  <FilePreviewCard 
                    file={files.justificatif}
                    fileName={files.justificatif.name}
                    onClick={(e) => openFilePreview(e, files.justificatif)}
                    className="mt-2"
                  />
                )}
                
                <p className="text-xs text-muted-foreground mt-2">
                  <Eye className="inline-block h-3 w-3 mr-1" />
                  Cliquez sur un document pour le visualiser
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* File preview modal - Always visible for both step 3 and 4 */}
        <FilePreview 
          file={previewState.currentFile}
          isOpen={previewState.isOpen}
          onClose={closeFilePreview}
        />
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <KycFormHeader />
      
      <main className="container mx-auto py-10 px-4">
        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle>Demande de vérification KYC</CardTitle>
            <CardDescription>
              Étape {step} sur 4: {
                step === 1 ? "Informations personnelles" : 
                step === 2 ? "Coordonnées" : 
                step === 3 ? "Documents" :
                "Récapitulatif"
              }
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit}>
              {step === 1 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="nom">Nom *</Label>
                      <Input 
                        id="nom" 
                        name="nom" 
                        value={formData.nom} 
                        onChange={handleChange} 
                        required 
                      />
                    </div>
                    <div>
                      <Label htmlFor="prenoms">Prénoms *</Label>
                      <Input 
                        id="prenoms" 
                        name="prenoms" 
                        value={formData.prenoms} 
                        onChange={handleChange} 
                        required 
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="sex" className="block mb-2">Sexe *</Label>
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
                    <Label htmlFor="dateNaissance">Date de naissance *</Label>
                    <Input 
                      id="dateNaissance" 
                      name="dateNaissance" 
                      type="date" 
                      value={formData.dateNaissance} 
                      onChange={handleChange} 
                      required 
                    />
                  </div>
                </div>
              )}
              
              {step === 2 && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="nationalite">Nationalité *</Label>
                    <Select onValueChange={(value) => handleSelectChange('nationalite', value)} value={formData.nationalite}>
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
                    <Label htmlFor="address">Adresse *</Label>
                    <Textarea 
                      id="address" 
                      name="address" 
                      value={formData.address} 
                      onChange={handleChange} 
                      required 
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="telephone">Téléphone *</Label>
                      <Input 
                        id="telephone" 
                        name="telephone" 
                        value={formData.telephone} 
                        onChange={handleChange} 
                        required 
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input 
                        id="email" 
                        name="email" 
                        type="email" 
                        value={formData.email} 
                        onChange={handleChange} 
                        required 
                      />
                    </div>
                  </div>
                </div>
              )}
              
              {step === 3 && (
                <div className="space-y-6">
                  <div className="space-y-4">
                   
                    <div>
                      <Label htmlFor="documentType">Type de document d'identité *</Label>
                      <Select onValueChange={(value) => handleSelectChange('documentType', value)} value={formData.documentType}>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez le type de document" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="CNI">Carte d'identité</SelectItem>
                          <SelectItem value="passeport">Passeport</SelectItem>
                          <SelectItem value="CIP">Certificat d'identification personnel</SelectItem>
                          <SelectItem value="permis_conduire">Permis de conduire</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                     <div>
                      <Label htmlFor="documentId">Numéro de document d'identité *</Label>
                      <Input 
                        id="documentId" 
                        name="documentId" 
                        value={formData.documentId} 
                        onChange={handleChange} 
                        required 
                      />
                    </div>
                    
                    
                    <div>
                      <Label className="block mb-2">Document d'identité *</Label>
                      <div className="border-2 border-dashed rounded-lg p-6 text-center hover:bg-gray-50 transition-colors">
                        <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                        <p className="text-sm text-gray-500 mb-2">
                          PNG, JPG ou PDF (max. 5MB)
                        </p>
                        <Input
                          id="document"
                          name="document"
                          type="file"
                          accept=".png,.jpg,.jpeg,.pdf"
                          onChange={handleFileChange}
                          className="sr-only"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => document.getElementById("document")?.click()}
                        >
                          Sélectionner un fichier
                        </Button>
                        {files.document && (
                          <div className="mt-2 flex items-center justify-center gap-2">
                            <p className="text-sm text-blue-600">{files.document.name}</p>
                            <Button 
                              type="button" 
                              variant="ghost" 
                              size="sm"
                              className="h-7 px-2"
                              onClick={(e) => openFilePreview(e, files.document)}
                            >
                              <Eye className="h-3.5 w-3.5 mr-1" />
                              <span className="text-xs">Aperçu</span>
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="justificatifType">Type de justificatif de domicile *</Label>
                      <Select onValueChange={(value) => handleSelectChange('justificatifType', value)} value={formData.justificatifType}>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez le type de justificatif" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Certificat_de_résidence">Certificat de résidence</SelectItem>
                          <SelectItem value="Facture_SBEE">Facture SBEE</SelectItem>
                          <SelectItem value="Facture_SONEB">Facture SONEB</SelectItem>
                          <SelectItem value="Releve_bancaire">Relevé bancaire</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="justificatifId">Numéro de justificatif de domicile *</Label>
                      <Input 
                        id="justificatifId" 
                        name="justificatifId" 
                        value={formData.justificatifId} 
                        onChange={handleChange} 
                        required 
                      />
                    </div>
                    
                    
                    
                    <div>
                      <Label className="block mb-2">Justificatif de domicile *</Label>
                      <div className="border-2 border-dashed rounded-lg p-6 text-center hover:bg-gray-50 transition-colors">
                        <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                        <p className="text-sm text-gray-500 mb-2">
                          PNG, JPG ou PDF (max. 5MB)
                        </p>
                        <Input
                          id="justificatif"
                          name="justificatif"
                          type="file"
                          accept=".png,.jpg,.jpeg,.pdf"
                          onChange={handleFileChange}
                          className="sr-only"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => document.getElementById("justificatif")?.click()}
                        >
                          Sélectionner un fichier
                        </Button>
                        {files.justificatif && (
                          <div className="mt-2 flex items-center justify-center gap-2">
                            <p className="text-sm text-blue-600">{files.justificatif.name}</p>
                            <Button 
                              type="button" 
                              variant="ghost" 
                              size="sm"
                              className="h-7 px-2"
                              onClick={(e) => openFilePreview(e, files.justificatif)}
                            >
                              <Eye className="h-3.5 w-3.5 mr-1" />
                              <span className="text-xs">Aperçu</span>
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {step === 4 && renderRecap()}

              {/* File preview modal - Always visible for both step 3 and 4 */}
              <FilePreview 
                file={previewState.currentFile}
                isOpen={previewState.isOpen}
                onClose={closeFilePreview}
              />
            </form>
          </CardContent>
          
          <CardFooter className="flex justify-between">
            {step > 1 ? (
              <Button type="button" variant="outline" onClick={prevStep}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Précédent
              </Button>
            ) : (
              <Button type="button" variant="outline" onClick={() => router.push('/')}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Accueil
              </Button>
            )}
            
            {step < 4 ? (
              <Button type="button" onClick={nextStep}>
                Suivant <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button 
                type="submit" 
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="bg-green-600 hover:bg-green-700"
              >
                {isSubmitting ? "Soumission..." : "Soumettre la demande"}
              </Button>
            )}
          </CardFooter>
        </Card>
      </main>
    </div>
  );
}