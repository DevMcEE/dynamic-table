'use client';

import { useEffect, useRef, useState } from "react";
import { HeaderName, Document } from "./documents.types";
import { TableRow } from "./TableRow";
import { documentEventEmitter } from "./documentEventEmitter";

interface TableBodyProps {
  headers: HeaderName[],
}

export const TableBody = ({ headers }: TableBodyProps) => {
  const [documents, setDocuments] = useState< Document[]>([]);
  const tBodyRef = useRef<HTMLTableSectionElement>(null);
  const indexStart = useRef(0)
  
  useEffect(() => {
    documentEventEmitter.on('documentsUpdated', (args) => {
      //@ts-ignore
      const {documents: _documents, indexStart: _indexStart} = args;
      console.log({ _documents, _indexStart})
      indexStart.current = _indexStart;
      setDocuments(() => [..._documents as Document[]]);
    });

    return () => {
      documentEventEmitter.unsubscribe('documentsUpdated')
    }
  }, []);

  useEffect(() => {
    console.log('indexStart', indexStart.current)
    documentEventEmitter.emit('documentsRerendered', true)
  });
  
  return (
    <tbody ref={tBodyRef} >
      {!documents.length && <tr><td style={{ textAlign: 'center'}} colSpan={headers.length}> Loading ... </td></tr>}
      {
        documents.map((document, i) => {
          return <TableRow key={document.id} document={document} headers={headers} index={indexStart.current + i} />
        })
      }
    </tbody>
  )
};