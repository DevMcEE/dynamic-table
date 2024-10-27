import { Document, DocumentFieldName } from "@/app/[locale]/documents/documents.types"
import { useCallback, useEffect, useRef, useState } from "react";
import { sortByKey } from "@/app/utils/sortByKey";
import { documentEventEmitter } from "./documentEventEmitter";
import { Coordinates, shiftCoordinates } from "@/app/utils/shiftCoordinates";

// const DOCUMENTS_TEMP_LIMIT = 1000;
const DOCUMENTS_RENDER_LIMIT = 100;

// const ALL_DATA = (data as Document[]).slice(0, DOCUMENTS_TEMP_LIMIT);

const INIT_COORDINATES: Coordinates = {
  start: 0,
  end: 500,
};

export const useData = () => {
  const allDocuments = useRef<Document[]>([])
  const [documents, setDocuments] = useState< Document[]>([]);
  const [sorter, setSorter] = useState<{ key: keyof Document, isAscending: boolean}>( { key: 'id', isAscending: true });
  const prevScrollPosition = useRef(0);
  const isRendering = useRef(false);

  const [coordinates, setCoordinates] = useState<Coordinates>(INIT_COORDINATES);

  const handleDocumentsUpdate = (data: Document[]) => {
    allDocuments.current = data;

    const initChunk = data.slice(INIT_COORDINATES.start, INIT_COORDINATES.end);
    setDocuments(() =>initChunk );
  }

  useEffect(() => {
    if (documents.length) {
      documentEventEmitter.emit('documentsUpdated', {documents, indexStart: coordinates.start});
    }
  }, [documents]);

  useEffect(() => {
    console.log('Sorting')
      // documentEventEmitter.emit('documentsUpdated', {sorted, indexStart: coordinates.start});
      const sorted = sortByKey<Document>({ 
        data:  (allDocuments.current as Document[]), 
        ...sorter
      }).slice(coordinates.start, coordinates.end);
    console.log('Sorting sorted')

      setDocuments(() => sorted);

  }, [sorter.isAscending, sorter.key, allDocuments.current])

  useEffect(() => {
    //@ts-ignore
    documentEventEmitter.on('documentsFetched', ({ data }) => {
      handleDocumentsUpdate(data)
    });
    //@ts-ignore
    documentEventEmitter.on('sortDocuments', ({key, isAscending: isAscending}) => {
      isRendering.current = true
      console.log('documentEventEmitter.on(sortDocuments)')
      setSorter({ key, isAscending })
    });

    documentEventEmitter.on('scroll', (position) => {
      const directionFactor = (position as number) - prevScrollPosition.current > 0 ? 1 : -1;

      console.log('scroll position', (position as number))
      prevScrollPosition.current = (position as number);

      if (!isRendering.current && (directionFactor > 0 ? ((position as number) > 80): (position as number) < 30)) {
        setCoordinates((prev) => shiftCoordinates({  maxEnd:  (allDocuments.current as Document[]).length, coordinates: prev, shift:  DOCUMENTS_RENDER_LIMIT * directionFactor }));

        isRendering.current = true
      }
    })

    documentEventEmitter.on('documentsRerendered', () => {
      console.log('documentsRerendered')
      isRendering.current = false;
    })

  }, []);

  useEffect(() => {
    setDocuments(() =>  allDocuments.current.slice(coordinates.start, coordinates.end))
    // setDocuments(() => ALL_DATA.slice(coordinates.start, coordinates.end))
  }, [coordinates.end, coordinates.start]);

  return {documents, documentsAmount:  allDocuments.current.length, coordinates: coordinates}
}
