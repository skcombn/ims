import React from 'react';
import { read, utils, writeFile } from 'xlsx';

const Export2Excel = ({ heading, rowData, colWidths, title }) => {
  const wb = utils.book_new();
  const ws = utils.json_to_sheet([]);
  ws['!cols'] = colWidths;
  utils.sheet_add_aoa(ws, heading);
  utils.sheet_add_json(ws, rowData, { origin: 'A2', skipHeader: true });

  utils.book_append_sheet(wb, ws, `${title}`);
  writeFile(wb, `${title}.xlsx`);

  // Returning false as downloading of file is already taken care of
  return false;
};

export default Export2Excel;
