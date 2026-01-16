// Print Invoice CSS Styles
// This file contains CSS styles for the print invoice HTML generation

export const printInvoiceStyles = `
  @media print {
    @page {
      size: A4;
      margin: 10mm;
    }
    body {
      margin: 0;
      padding: 5px;
      font-size: 10px;
    }
    .invoice-container {
      padding: 5px;
    }
    .invoice-header {
      padding-bottom: 8px;
      margin-bottom: 12px;
    }
    .invoice-title {
      font-size: 16px;
    }
    .three-card-layout {
      gap: 10px;
      margin-bottom: 12px;
    }
    .card-section {
      padding: 10px;
      background: #f9fafb !important;
      border: 1px solid #e5e7eb !important;
      page-break-inside: avoid;
    }
    .section-title {
      font-size: 12px;
      margin-bottom: 6px;
      padding-bottom: 3px;
    }
    .info-item {
      margin-bottom: 6px;
      padding-bottom: 4px;
    }
    .info-item label {
      font-size: 8px;
      margin-bottom: 2px;
    }
    .info-item span {
      font-size: 10px;
      line-height: 1.3;
    }
    .amount-summary {
      margin-top: 4px;
      margin-bottom: 6px;
      padding: 10px;
      page-break-inside: avoid;
    }
    .amount-row {
      padding: 6px 0;
    }
    .amount-label {
      font-size: 9px;
    }
    .amount-value {
      font-size: 10px;
    }
    .amount-row.total .amount-label,
    .amount-row.total .amount-value {
      font-size: 12px;
    }
    .amount-words {
      margin-top: 4px;
      font-size: 9px;
      padding: 6px;
    }
    .footer-note {
      margin-top: 8px;
      font-size: 8px;
      padding-top: 6px;
    }
  }
  body {
    font-family: 'Segoe UI', Arial, sans-serif;
    margin: 0;
    padding: 10px;
    color: #111827;
    background: #ffffff;
    font-size: 11px;
  }
  .invoice-container {
    max-width: 100%;
    margin: 0 auto;
    background: #ffffff;
    padding: 10px;
  }
  .invoice-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    border-bottom: 2px solid #e5e7eb;
    padding-bottom: 10px;
    margin-bottom: 15px;
  }
  .invoice-title {
    font-size: 18px;
    margin: 0 0 4px 0;
    color: #111827;
  }
  .invoice-booking-id {
    margin: 4px 0 0;
    color: #4b5563;
  }
  .invoice-meta {
    text-align: right;
    font-size: 10px;
    color: #6b7280;
    line-height: 1.5;
  }
  .three-card-layout {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
    margin-bottom: 15px;
  }
  .card-section {
    background: #f9fafb;
    border-radius: 6px;
    padding: 12px;
    border: 1px solid #e5e7eb;
  }
  .section-title {
    font-size: 13px;
    font-weight: 600;
    margin-bottom: 8px;
    color: #111827;
    margin-top: 0;
    padding-bottom: 4px;
    border-bottom: 1px solid #e5e7eb;
  }
  .section-title:first-child {
    margin-top: 0;
  }
  .info-item {
    margin-bottom: 8px;
    padding-bottom: 6px;
    border-bottom: 1px solid #e5e7eb;
  }
  .info-item:last-child {
    border-bottom: none;
    margin-bottom: 0;
    padding-bottom: 0;
  }
  .info-item label {
    display: block;
    font-size: 9px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: #6b7280;
    margin-bottom: 3px;
    font-weight: 600;
  }
  .info-item span {
    font-size: 11px;
    font-weight: 600;
    color: #111827;
    word-wrap: break-word;
    overflow-wrap: break-word;
    word-break: break-word;
    display: block;
    line-height: 1.4;
  }
  .info-item.amount-total {
    margin-top: 20px;
    padding-top: 16px;
    border-top: 2px solid #111827;
    border-bottom: 2px solid #111827;
  }
  .info-item.amount-total label,
  .info-item.amount-total span {
    font-size: 16px;
    color: #111827;
  }
  .service-details-section {
    margin-top: 0;
    padding-top: 0;
  }
  .service-details-section .section-title {
    font-size: 13px;
    font-weight: 600;
    margin-bottom: 8px;
    margin-top: 0;
    color: #111827;
    padding-bottom: 4px;
    border-bottom: 1px solid #e5e7eb;
  }
  .amount-summary {
    margin-top: 8px;
    margin-bottom: 8px;
  }
  .amount-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 0;
    border-bottom: 1px solid #e5e7eb;
  }
  .amount-row:last-child {
    border-bottom: none;
  }
  .amount-row.total {
    margin-top: 8px;
    padding-top: 12px;
    border-top: 2px solid #111827;
    border-bottom: 2px solid #111827;
    font-weight: 700;
  }
  .amount-label {
    font-size: 11px;
    color: #6b7280;
    font-weight: 600;
  }
  .amount-value {
    font-size: 12px;
    font-weight: 600;
    color: #111827;
  }
  .amount-value.discount {
    color: #10b981;
  }
  .amount-row.total .amount-value {
    font-size: 14px;
  }
  .amount-words {
    font-style: italic;
    margin-top: 6px;
    color: #374151;
    font-size: 10px;
    padding: 8px;
    background: #f9fafb;
    border-radius: 4px;
  }
  .footer-note {
    margin-top: 12px;
    font-size: 9px;
    color: #6b7280;
    line-height: 1.4;
    padding-top: 8px;
    border-top: 1px solid #e5e7eb;
  }
`;
