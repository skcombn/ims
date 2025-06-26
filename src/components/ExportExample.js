import React from 'react';
import Papa from 'papaparse';
import XLSX from 'xlsx';
import JsPDF from 'jspdf';
import 'jspdf-autotable';

const ExportExample = () => {
  function getExportFileBlob({ columns, data, fileType, fileName }) {
    if (fileType === 'csv') {
      // CSV example
      const headerNames = columns.map(col => col.exportValue);
      const csvString = Papa.unparse({ fields: headerNames, data });
      return new Blob([csvString], { type: 'text/csv' });
    } else if (fileType === 'xlsx') {
      // XLSX example

      const header = columns.map(c => c.exportValue);
      const compatibleData = data.map(row => {
        const obj = {};
        header.forEach((col, index) => {
          obj[col] = row[index];
        });
        return obj;
      });

      let wb = XLSX.utils.book_new();
      let ws1 = XLSX.utils.json_to_sheet(compatibleData, {
        header,
      });
      XLSX.utils.book_append_sheet(wb, ws1, 'React Table Data');
      XLSX.writeFile(wb, `${fileName}.xlsx`);

      // Returning false as downloading of file is already taken care of
      return false;
    }
    //PDF example
    if (fileType === 'pdf') {
      const headerNames = columns.map(column => column.exportValue);
      const doc = new JsPDF();
      doc.autoTable({
        head: [headerNames],
        body: data,
        margin: { top: 20 },
        styles: {
          minCellHeight: 9,
          halign: 'left',
          valign: 'center',
          fontSize: 11,
        },
      });
      doc.save(`${fileName}.pdf`);

      return false;
    }

    // Other formats goes here
    return false;
  }
  return <div>ExportExample</div>;
};

export default ExportExample;
