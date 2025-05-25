"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  CheckCircle, Clock, EyeIcon, LogOut, MoreHorizontal, Search, ShieldCheck, Trash2, XCircle 
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, DialogContent, DialogDescription, DialogFooter, 
  DialogHeader, DialogTitle, DialogTrigger 
} from "@/components/ui/dialog";
import { getAllKycRequests, getKycRequestById, updateKycStatus, deleteKycRequest } from "@/lib/api";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface KycRequest {
  id: string;
  publicId: string;
  nom: string;
  prenoms: string;
  email: string;
  telephone: string;
  status: string;
  createdAt: string;
}

interface KycRequestDetail extends KycRequest {
  sex: string;
  dateNaissance: string;
  nationalite: string;
  address: string;
  documentId: string;
  justificatifId: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const { toast } = useToast();
  
  const [requests, setRequests] = useState<KycRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<KycRequest[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<KycRequestDetail | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState("all");

  useEffect(() => {
    // Check if token exists in localStorage
    const storedToken = localStorage.getItem('adminToken');
    if (!storedToken) {
      router.push('/admin');
      return;
    }
    
    setToken(storedToken);
    fetchRequests(storedToken);
  }, [router]);

  useEffect(() => {
    if (requests.length > 0) {
      filterRequests();
    }
  }, [searchQuery, requests, currentTab]);

  const fetchRequests = async (authToken: string) => {
    try {
      const data = await getAllKycRequests(authToken);
      setRequests(data);
      setFilteredRequests(data);
      setLoading(false);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de récupérer les demandes KYC. Veuillez vous reconnecter.",
        variant: "destructive",
      });
      
      // If token is invalid or expired, redirect to login
      localStorage.removeItem('adminToken');
      router.push('/admin');
    }
  };

  const filterRequests = () => {
    let filtered = [...requests];
    
    // Filter by tab
    if (currentTab !== "all") {
      filtered = filtered.filter(req => req.status === currentTab);
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(req => 
        req.publicId.toLowerCase().includes(query) ||
        req.nom.toLowerCase().includes(query) ||
        req.prenoms.toLowerCase().includes(query) ||
        req.email.toLowerCase().includes(query)
      );
    }
    
    setFilteredRequests(filtered);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    router.push('/admin');
  };

  const handleViewDetails = async (id: string) => {
    if (!token) return;
    
    try {
      const data = await getKycRequestById(id, token);
      setSelectedRequest(data);
      setDetailsOpen(true);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de récupérer les détails de la demande.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    if (!token) return;
    
    try {
      await updateKycStatus(id, status, token);
      
      toast({
        title: "Statut mis à jour",
        description: `La demande a été marquée comme ${status === 'approved' ? 'approuvée' : 'rejetée'}.`,
      });
      
      // Update local state
      setRequests(prev => 
        prev.map(req => req.id === id ? { ...req, status } : req)
      );
      
      // Close details dialog
      setDetailsOpen(false);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le statut de la demande.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteRequest = async (id: string) => {
    if (!token) return;
    
    try {
      await deleteKycRequest(id, token);
      
      toast({
        title: "Demande supprimée",
        description: "La demande KYC a été supprimée avec succès.",
      });
      
      // Update local state
      setRequests(prev => prev.filter(req => req.id !== id));
      
      // Close details dialog
      setDetailsOpen(false);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la demande.",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 hover:bg-yellow-50">En attente</Badge>;
      case "approved":
        return <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50">Approuvée</Badge>;
      case "rejected":
        return <Badge variant="outline" className="bg-red-50 text-red-700 hover:bg-red-50">Rejetée</Badge>;
      default:
        return <Badge variant="outline">Inconnu</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-200 py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="h-6 w-6 text-blue-700" />
            <span className="font-semibold">Mahabo KYC - Administration</span>
          </div>
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" /> Déconnexion
          </Button>
        </div>
      </header>
      
      <main className="flex-1 container mx-auto py-8 px-4">
        <div className="mb-8 flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold mb-2">Tableau de bord</h1>
            <p className="text-gray-500">Gérez et traitez les demandes de vérification KYC</p>
          </div>
          
          <div className="flex items-center">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input 
                placeholder="Rechercher..." 
                className="pl-8" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Total des demandes</CardTitle>
              <CardDescription>Toutes les demandes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{requests.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">En attente</CardTitle>
              <CardDescription>Demandes à traiter</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-600">
                {requests.filter(req => req.status === "pending").length}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Approuvées</CardTitle>
              <CardDescription>Demandes validées</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">
                {requests.filter(req => req.status === "approved").length}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Tabs 
          defaultValue="all" 
          className="w-full"
          onValueChange={(value) => setCurrentTab(value)}
        >
          <TabsList className="mb-6">
            <TabsTrigger value="all">Toutes</TabsTrigger>
            <TabsTrigger value="pending">En attente</TabsTrigger>
            <TabsTrigger value="approved">Approuvées</TabsTrigger>
            <TabsTrigger value="rejected">Rejetées</TabsTrigger>
          </TabsList>
          
          <TabsContent value={currentTab}>
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID Public</TableHead>
                      <TableHead>Nom & Prénom</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRequests.length > 0 ? (
                      filteredRequests.map((request) => (
                        <TableRow key={request.id}>
                          <TableCell className="font-mono text-xs">
                            {request.publicId}
                          </TableCell>
                          <TableCell>
                            {request.nom} {request.prenoms}
                          </TableCell>
                          <TableCell>{request.email}</TableCell>
                          <TableCell>{formatDate(request.createdAt)}</TableCell>
                          <TableCell>{getStatusBadge(request.status)}</TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleViewDetails(request.id)}>
                                  <EyeIcon className="h-4 w-4 mr-2" /> Voir les détails
                                </DropdownMenuItem>
                                {request.status === "pending" && (
                                  <>
                                    <DropdownMenuItem onClick={() => handleUpdateStatus(request.id, "approved")}>
                                      <CheckCircle className="h-4 w-4 mr-2" /> Approuver
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleUpdateStatus(request.id, "rejected")}>
                                      <XCircle className="h-4 w-4 mr-2" /> Rejeter
                                    </DropdownMenuItem>
                                  </>
                                )}
                                <DropdownMenuItem onClick={() => handleDeleteRequest(request.id)}>
                                  <Trash2 className="h-4 w-4 mr-2" /> Supprimer
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-6">
                          Aucune demande trouvée
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      
      {/* Request Details Dialog */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Détails de la demande</DialogTitle>
            <DialogDescription>
              ID: {selectedRequest?.publicId}
            </DialogDescription>
          </DialogHeader>
          
          {selectedRequest && (
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg flex items-center space-x-4">
                {selectedRequest.status === "pending" && (
                  <Clock className="h-8 w-8 text-yellow-500" />
                )}
                {selectedRequest.status === "approved" && (
                  <CheckCircle className="h-8 w-8 text-green-500" />
                )}
                {selectedRequest.status === "rejected" && (
                  <XCircle className="h-8 w-8 text-red-500" />
                )}
                
                <div>
                  <div className="text-sm text-gray-500">Statut actuel</div>
                  <div className="font-medium">
                    {selectedRequest.status === "pending" && "En attente"}
                    {selectedRequest.status === "approved" && "Approuvée"}
                    {selectedRequest.status === "rejected" && "Rejetée"}
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Informations personnelles</h3>
                  <dl className="mt-2 space-y-2">
                    <div>
                      <dt className="text-sm text-gray-500">Nom complet</dt>
                      <dd className="font-medium">{selectedRequest.nom} {selectedRequest.prenoms}</dd>
                    </div>
                    <div>
                      <dt className="text-sm text-gray-500">Sexe</dt>
                      <dd>{selectedRequest.sex === "M" ? "Masculin" : "Féminin"}</dd>
                    </div>
                    <div>
                      <dt className="text-sm text-gray-500">Date de naissance</dt>
                      <dd>{formatDate(selectedRequest.dateNaissance)}</dd>
                    </div>
                    <div>
                      <dt className="text-sm text-gray-500">Nationalité</dt>
                      <dd>{selectedRequest.nationalite}</dd>
                    </div>
                  </dl>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Coordonnées</h3>
                  <dl className="mt-2 space-y-2">
                    <div>
                      <dt className="text-sm text-gray-500">Adresse</dt>
                      <dd>{selectedRequest.address}</dd>
                    </div>
                    <div>
                      <dt className="text-sm text-gray-500">Téléphone</dt>
                      <dd>{selectedRequest.telephone}</dd>
                    </div>
                    <div>
                      <dt className="text-sm text-gray-500">Email</dt>
                      <dd>{selectedRequest.email}</dd>
                    </div>
                  </dl>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Documents</h3>
                <dl className="mt-2 space-y-2">
                  <div>
                    <dt className="text-sm text-gray-500">Numéro de pièce d'identité</dt>
                    <dd>{selectedRequest.documentId}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-500">Numéro de justificatif de domicile</dt>
                    <dd>{selectedRequest.justificatifId}</dd>
                  </div>
                </dl>
              </div>
              
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Dates</h3>
                <div className="bg-gray-50 p-3 rounded text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Soumise le:</span>
                    <span>{formatDate(selectedRequest.createdAt)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter className="flex justify-between flex-row">
            {selectedRequest?.status === "pending" && (
              <div className="flex gap-2">
                <Button
                  variant="destructive"
                  onClick={() => handleUpdateStatus(selectedRequest.id, "rejected")}
                >
                  Rejeter
                </Button>
                <Button
                  variant="default"
                  onClick={() => handleUpdateStatus(selectedRequest.id, "approved")}
                >
                  Approuver
                </Button>
              </div>
            )}
            
            <Button
              variant="outline"
              onClick={() => setDetailsOpen(false)}
            >
              Fermer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}