import React from 'react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

const Export2PDF = ({ tableHeaders, tableData, title, layout }) => {
  const pdf = new jsPDF({
    orientation: layout === 'p' ? 'p' : 'l',
    unit: 'mm',
    format: 'a4',
  });
  //console.log(pdf.getFontList());
  pdf.setFont('times', 'normal');
  pdf.setFontSize(24);
  pdf.text('Sales History Table', 20, 20, null, null, 'left');
  pdf.setFontSize(10);

  autoTable(pdf, {
    head: [tableHeaders],
    body: tableData,
    styles: {
      minCellHeight: 9,
      halign: 'left',
      valign: 'center',
      fontSize: 10,
    },
  });

  pdf.save(`${title}.pdf`);
};

export default Export2PDF;
