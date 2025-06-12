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

  const handlePrintTickets = async () => {
    setIsLoading(true);

    try {
      // Open the tickets print page in a new window
      const printUrl = `${axiosClient.defaults.baseURL}/tickets/unused-pdf`;
      const printWindow = window.open(printUrl, '_blank', 'width=800,height=600');
      
      if (printWindow) {
        // Wait for the page to load, then trigger print
        printWindow.addEventListener('load', () => {
          setTimeout(() => {
            printWindow.print();
          }, 500);
        });
        
        toast.success(t("Print page opened successfully"));
      } else {
        toast.error(t("Unable to open print window. Please allow popups."));
      }
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
      onClick={handlePrintTickets}
      disabled={isLoading}
    >
      {isLoading ? (
        <Loader className="w-4 h-4 animate-spin" />
      ) : (
        <Printer className="w-4 h-4" />
      )}
      <span>{t("Print Tickets")}</span>
    </Button>
  );
}

export default GeneratePDF;