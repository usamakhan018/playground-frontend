import React, { useRef, useEffect } from 'react';
import JsBarcode from 'jsbarcode';
import { Button } from '@/components/ui/button';
import { Printer, Download } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const BarcodeGenerator = ({ 
  value, 
  width = 2, 
  height = 100, 
  format = 'CODE128', 
  displayValue = true,
  fontSize = 20,
  textAlign = 'center',
  textPosition = 'bottom',
  background = '#ffffff',
  lineColor = '#000000',
  margin = 10,
  showPrintButton = true,
  showDownloadButton = true,
  label = null
}) => {
  const canvasRef = useRef(null);
  const { t } = useTranslation();

  useEffect(() => {
    if (canvasRef.current && value) {
      try {
        JsBarcode(canvasRef.current, value, {
          format: format,
          width: width,
          height: height,
          displayValue: displayValue,
          fontSize: fontSize,
          textAlign: textAlign,
          textPosition: textPosition,
          background: background,
          lineColor: lineColor,
          margin: margin,
        });
      } catch (error) {
        console.error('Error generating barcode:', error);
      }
    }
  }, [value, width, height, format, displayValue, fontSize, textAlign, textPosition, background, lineColor, margin]);

  const handlePrint = () => {
    if (!canvasRef.current) return;

    const printWindow = window.open('', '_blank');
    const canvas = canvasRef.current;
    const dataURL = canvas.toDataURL('image/png');
    
    printWindow.document.write(`
      <html>
        <head>
          <title>Barcode - ${value}</title>
          <style>
            body { 
              margin: 0; 
              padding: 20px; 
              text-align: center; 
              font-family: Arial, sans-serif; 
            }
            .barcode-container {
              page-break-inside: avoid;
              margin-bottom: 20px;
            }
            .barcode-label {
              font-size: 16px;
              font-weight: bold;
              margin-bottom: 10px;
            }
            .barcode-image {
              border: 1px solid #ddd;
              padding: 10px;
              background: white;
            }
            @media print {
              body { margin: 0; padding: 10px; }
            }
          </style>
        </head>
        <body>
          <div class="barcode-container">
            ${label ? `<div class="barcode-label">${label}</div>` : ''}
            <img src="${dataURL}" alt="Barcode: ${value}" class="barcode-image" />
          </div>
        </body>
      </html>
    `);
    
    printWindow.document.close();
    printWindow.focus();
    
    // Small delay to ensure content is loaded before printing
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };

  const handleDownload = () => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const link = document.createElement('a');
    link.download = `barcode-${value}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  if (!value) {
    return (
      <div className="text-center text-muted-foreground p-4">
        {t("No barcode value provided")}
      </div>
    );
  }

  return (
    <div className="barcode-generator">
      {label && (
        <div className="text-center font-medium mb-2">
          {label}
        </div>
      )}
      
      <div className="flex justify-center mb-4">
        <canvas ref={canvasRef} className="border border-gray-200 bg-white p-2" />
      </div>
      
      {(showPrintButton || showDownloadButton) && (
        <div className="flex justify-center gap-2">
          {showPrintButton && (
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrint}
              className="flex items-center gap-2"
            >
              <Printer className="h-4 w-4" />
              {t("Print")}
            </Button>
          )}
          
          {showDownloadButton && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownload}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              {t("Download")}
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default BarcodeGenerator; 