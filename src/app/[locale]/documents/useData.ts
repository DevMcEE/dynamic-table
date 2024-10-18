import data from "@/assets/data/document-list.mocked-data.json";
import { Document, DocumentFieldName } from "@/app/[locale]/documents/documents.types"
import { useCallback, useEffect, useRef, useState } from "react";
import { sortByKey } from "@/app/utils/sortByKey";
import { documentEventEmitter } from "./documentEventEmitter";
import { Coordinates, shiftCoordinates } from "@/app/utils/shiftCoordinates";

const DOCUMENTS_RENDER_LIMIT = 100;

const INIT_COORDINATES: Coordinates = {
  start: 0,
  end: 3* DOCUMENTS_RENDER_LIMIT,
};

export const useData = () => {
  const [documents, setDocuments] = useState( (data as Document[]).slice(INIT_COORDINATES.start, INIT_COORDINATES.end));
  const [sorter, setSorter] = useState<{ key: keyof Document, isAscending: boolean}>( { key: 'id', isAscending: true });
  const isRendering = useRef(false);

  const [coordinates, setCoordinates] = useState<Coordinates>(INIT_COORDINATES);

  const sortDocuments = useCallback((key: DocumentFieldName, isAscending: boolean) => {
    setDocuments((prev) => sortByKey<Document>({ 
      data: prev, 
      key,
      isAscending
    })
  )
  }, []);

  useEffect(() => {
    if (documents.length) {
      documentEventEmitter.emit('documentsUpdated', {documents, indexStart: coordinates.start});
    }
  }, [documents]);

  useEffect(() => {
      const sorted = sortByKey<Document>({ 
        data:  (data as Document[]), 
        ...sorter
      }).slice(coordinates.start, coordinates.end);

      setDocuments(() => sorted);
  }, [sorter.isAscending, sorter.key])

  useEffect(() => {
    //@ts-ignore
    documentEventEmitter.on('sortDocuments', ({key, isAscending: isAscending}) => {
      isRendering.current = true
      setSorter({ key, isAscending })
    });

    documentEventEmitter.on('bottomRefTriggered', () => {
      if (!isRendering.current) {
        setCoordinates((prev) => shiftCoordinates({  maxEnd:  (data as Document[]).length, coordinates: prev, shift:  DOCUMENTS_RENDER_LIMIT  }));

        isRendering.current = true;
      }
    });

    documentEventEmitter.on('topRefTriggered', () => {
      if (!isRendering.current) {
        setCoordinates((prev) => shiftCoordinates({  maxEnd:  (data as Document[]).length, coordinates: prev, shift:  -1 * DOCUMENTS_RENDER_LIMIT  }));

        isRendering.current = true;
      }
    });

    documentEventEmitter.on('documentsRerendered', () => {
      isRendering.current = false;
    })

  }, []);

  useEffect(() => {
    setDocuments(() =>  (data as Document[]).slice(coordinates.start, coordinates.end))
  }, [coordinates.end, coordinates.start]);

  return {documents, documentsAmount:  (data as Document[]).length, sortDocuments, coordinates: coordinates}
}
