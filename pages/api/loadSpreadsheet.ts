// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

const {GoogleSpreadsheet} = require('google-spreadsheet');

const SHEET_ID = '1nshvlFRZR2f8pAaov6pXFP4gSgiwgPXsP4BB4YxOhEo';

type Data = {
  name: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {

  // Google API service key
  const creds = require('../../.json');
  // const apiCreds = 'AIzaSyBs2pnxn9vjvGNLzco9C2LFNsOvV2ayrBo'; // Required a public spreadsheet.
  const doc = new GoogleSpreadsheet(SHEET_ID);
  await doc.useServiceAccountAuth(creds);
  // await doc.useApiKey(apiCreds);

  await doc.loadInfo();
  // console.log('doc.title: ', doc.title);
  const sheet = doc.sheetsByIndex[0];
  // console.log("sheet title: ", sheet.title);
  // console.log('row count: ', sheet.rowCount);

  // const newRow = await sheet.addRow({ 'Meeting Date': '12th November 9999', Speaker: 'Larry Page', Description: 'infinity to talk to', 'Contact info': 'larry@google.com' });

  const rows = await sheet.getRows({});
  // console.log('rows: ', rows, rows[0]._rawData);
  const out = rows.slice(1).map((r: any) => {
    // console.log('r._rawData', r._rawData);
    return r._rawData;
  })

  // await sheet.loadCells('A:D');
  // console.log(sheet.cellStats);
  // console.log(sheet.getCell(1, 2).formattedValue);
  // console.log(sheet.getCell(1, 2).value);
  
  res.status(200).json(out);
}
