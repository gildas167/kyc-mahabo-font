"use client";

import { FileText, FileImage, File, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FilePreviewCardProps {
  file: File | null;
  fileName: string;
  onClick: (e: React.MouseEvent) => void;
  className?: string;
}

export default function FilePreviewCard({ file, fileName, onClick, className }: FilePreviewCardProps) {
  if (!file) return null;
  
  const fileExtension = fileName.split('.').pop()?.toLowerCase();
  const isImage = ['jpg', 'jpeg', 'png'].includes(fileExtension || '');
  const isPdf = fileExtension === 'pdf';
  
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onClick(e);
  };
  
  return (
    <div 
      className={cn(
        "flex items-center justify-between p-3 rounded-md border bg-card transition-colors hover:bg-accent/10 cursor-pointer group",
        className
      )}
      onClick={handleClick}
    >
      <div className="flex items-center gap-3">
        {isImage ? (
          <FileImage className="h-5 w-5 text-blue-500" />
        ) : isPdf ? (
          <FileText className="h-5 w-5 text-red-500" />
        ) : (
          <File className="h-5 w-5 text-gray-500" />
        )}
        <span className="text-sm font-medium">{fileName}</span>
      </div>
      
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={handleClick}
      >
        <Eye className="h-4 w-4 mr-1" />
        <span className="text-xs">Voir</span>
      </Button>
    </div>
  );
}