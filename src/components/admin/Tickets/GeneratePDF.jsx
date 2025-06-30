import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import axiosClient from "@/axios";
import { toast } from 'react-hot-toast';
import { Loader, Printer } from "lucide-react";
import { handleError } from "@/utils/helpers";
import { useTranslation } from "react-i18next";

function GeneratePDF() {
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();

  const handleDownloadTickets = async () => {
    setIsLoading(true);

    try {
      // Create a download link for the PDF
      const downloadUrl = `${axiosClient.defaults.baseURL}tickets/unused-pdf`;
      
      // Create a temporary link element to trigger download
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = 'unused_tickets.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success(t("PDF download started"));
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button 
      variant="secondary" 
      className="gap-2"
      onClick={handleDownloadTickets}
      disabled={isLoading}
    >
      {isLoading ? (
        <Loader className="w-4 h-4 animate-spin" />
      ) : (
        <Printer className="w-4 h-4" />
      )}
      <span>{t("Download PDF")}</span>
    </Button>
  );
}

export default GeneratePDF;