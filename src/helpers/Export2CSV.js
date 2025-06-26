import React from 'react';
import { mkConfig, generateCsv, download } from 'export-to-csv';

const Export2CSV = ({ rowData, title }) => {
  const csvConfig = mkConfig({
    fieldSeparator: ',',
    decimalSeparator: '.',
    useKeysAsHeaders: true,
    showColumnHeaders: false,
    filename: `${title}`,
  });

  const csv = generateCsv(csvConfig)(rowData);

  download(csvConfig)(csv);
};

export default Export2CSV;
