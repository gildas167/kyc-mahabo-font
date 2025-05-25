"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, FileText, Image as ImageIcon, AlertCircle } from "lucide-react";

interface FilePreviewProps {
  file: File | null;
  isOpen: boolean;
  onClose: () => void;
}

export function FilePreview({ file, isOpen, onClose }: FilePreviewProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fileType, setFileType] = useState<"image" | "pdf" | "unknown">("unknown");

  useEffect(() => {
    if (!file) return;

    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    
    if (fileExtension === 'pdf') {
      setFileType("pdf");
    } else if (['jpg', 'jpeg', 'png'].includes(fileExtension || '')) {
      setFileType("image");
    } else {
      setFileType("unknown");
    }

    // Create object URL for preview
    try {
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
      setError(null);
      
      // Free memory when component is unmounted
      return () => URL.revokeObjectURL(objectUrl);
    } catch (err) {
      setError("Impossible de charger l'aperçu du fichier");
      console.error(err);
    }
  }, [file]);

  if (!file) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="flex items-center gap-2">
            {fileType === "image" && <ImageIcon className="h-5 w-5" />}
            {fileType === "pdf" && <FileText className="h-5 w-5" />}
            {fileType === "unknown" && <AlertCircle className="h-5 w-5" />}
            {file.name}
          </DialogTitle>
          <DialogClose asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
              <X className="h-4 w-4" />
              <span className="sr-only">Fermer</span>
            </Button>
          </DialogClose>
        </DialogHeader>

        <div className="mt-4 flex justify-center overflow-auto max-h-[70vh]">
          {error ? (
            <div className="flex flex-col items-center justify-center text-red-500 p-10">
              <AlertCircle className="h-10 w-10 mb-2" />
              <p>{error}</p>
            </div>
          ) : fileType === "image" && preview ? (
            <img 
              src={preview} 
              alt={file.name} 
              className="max-w-full object-contain rounded-md" 
            />
          ) : fileType === "pdf" && preview ? (
            <iframe 
              src={`${preview}#view=FitH`} 
              className="w-full h-[70vh]" 
              title={file.name}
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-muted-foreground p-10">
              <FileText className="h-10 w-10 mb-2" />
              <p>Aperçu non disponible</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => {
                  if (preview) {
                    window.open(preview, '_blank');
                  }
                }}
              >
                Télécharger le fichier
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}