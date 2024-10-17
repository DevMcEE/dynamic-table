'use client';

import "./documents.css";

import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { useData } from "./useData";
import { PageProps } from "../types";
import { HeaderName } from "./documents.types";
import { TableHeader } from "./TableHeader";
import { TableBody } from "./TableBody";
import { useEffect, useRef } from "react";
import { documentEventEmitter } from "./documentEventEmitter";

const headers = [
  HeaderName.index,
  HeaderName.id,
  HeaderName.state,
  HeaderName.stateTime,
  HeaderName.documentName,
  HeaderName.documentNumber,
  HeaderName.documentDate,
  HeaderName.documentTotalAmount,
] as HeaderName[];

export default function Page({ params }: PageProps) {
  const t = useTranslations('DocumentsPage');
  const { documentsAmount, coordinates: coordintates } = useData();
  
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (pageRef.current) {
      console.log( pageRef.current)
      pageRef.current.addEventListener(('scroll'), (event) => {
        // @ts-ignore
        // console.log({scrollTop: event.target.scrollTop, scrollHeight: event.target.scrollHeight - window.innerHeight })
        // @ts-ignore
        documentEventEmitter.emit('scroll', event.target.scrollTop/(event.target.scrollHeight - window.innerHeight)*100)
        // @ts-ignore
      })
    }
  }, [pageRef.current])
  
  return (
    <div ref={pageRef} className="page">
      <div className="header-container">
        <div className="page-header" >
          <Link style={{ paddingRight: 10, textDecoration: params.locale === "en" ? "underline" : "none" }} href={'/documents'} locale="en" >EN</Link>
          <Link style={{ paddingRight: 10, textDecoration: params.locale === "ru" ? "underline" : "none" }} href={'/documents'} locale="ru">RU</Link>
        </div>
        <div className="info-block">
          <span className="info-block-item">{t("rendered", { amount: coordintates.end - coordintates.start})}</span>
          <span className="info-block-item">{t("allDocuments", { amount: documentsAmount})}</span>
          <span className="info-block-item">{t("start", { start: coordintates.start })}</span>
          <span className="info-block-item">{t("end", { end: coordintates.end })}</span>
        </div>
      </div>

      <div className="table-container">

        <table className="table">
          <thead>
            <TableHeader headers={headers} />
          </thead>
          <TableBody  headers={headers} />
        </table>
      </div>
    </div>
  )
}


