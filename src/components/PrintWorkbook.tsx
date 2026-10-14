"use client";
import { Printer } from 'lucide-react';
export function PrintWorkbook() { return <button type="button" className="workbook-print" onClick={() => window.print()}><Printer size={18} aria-hidden />Imprimir o guardar como PDF</button>; }
