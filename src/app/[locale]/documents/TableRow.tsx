'use client';
import { HeaderName, Document } from "./documents.types";
import { TableCell } from "./TableCell";

export const TableRow = ({ document, headers, index}: TableRowProps) => {
  return (
    <tr key={document.id} id={`${document.id}`}>
      {
        headers.map((header) => {
          let value;

          switch(header) {
            case HeaderName.index: {
              value = index + 1;
              break;
            }
            case HeaderName.select: {
              value = ' - '
              break;
            }
            case HeaderName.actions: {
              value = ' - '
              break;
            }
            
            default: {
              value = document[header];
            }
          }

          return (
            <TableCell value={value} key={`${document.id}-${header}`}/>
          )
        })
      }
    </tr>
  )
}

interface TableRowProps {
  document: Document,
  headers:  HeaderName[], 
  index: number
} 
