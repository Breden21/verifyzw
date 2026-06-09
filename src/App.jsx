import { useState, useEffect } from "react";
import { supabase } from "./supabase";

// ─── ZIMBABWE VOTERS' ROLL (100 realistic records) ───────────────────────────
const VOTERS_ROLL = [
  { id: "63-1234567-A-75", surname: "Moyo", firstName: "Tatenda", dob: "1985-03-12", gender: "M", ward: "Harare South" },
  { id: "63-2345678-B-75", surname: "Chikwanda", firstName: "Rudo", dob: "1990-07-24", gender: "F", ward: "Harare South" },
  { id: "63-3456789-C-75", surname: "Mutasa", firstName: "Farai", dob: "1978-11-05", gender: "M", ward: "Harare South" },
  { id: "63-4567890-D-75", surname: "Ncube", firstName: "Sithembile", dob: "1995-01-30", gender: "F", ward: "Harare South" },
  { id: "63-5678901-E-75", surname: "Chimutengwende", firstName: "Tonderai", dob: "1982-09-17", gender: "M", ward: "Harare South" },
  { id: "63-6789012-F-75", surname: "Dube", firstName: "Nompumelelo", dob: "1993-05-08", gender: "F", ward: "Harare North" },
  { id: "63-7890123-G-75", surname: "Madzivire", firstName: "Blessed", dob: "1975-12-22", gender: "M", ward: "Harare North" },
  { id: "63-8901234-H-75", surname: "Zindoga", firstName: "Chiedza", dob: "1988-04-14", gender: "F", ward: "Harare North" },
  { id: "63-9012345-J-75", surname: "Mapuranga", firstName: "Kudakwashe", dob: "1997-08-03", gender: "M", ward: "Harare North" },
  { id: "63-0123456-K-75", surname: "Sibanda", firstName: "Nkosazana", dob: "1983-02-19", gender: "F", ward: "Harare North" },
  { id: "07-1234567-A-22", surname: "Ndlovu", firstName: "Mthokozisi", dob: "1980-06-11", gender: "M", ward: "Bulawayo Central" },
  { id: "07-2345678-B-22", surname: "Moyo", firstName: "Sindisiwe", dob: "1992-10-28", gender: "F", ward: "Bulawayo Central" },
  { id: "07-3456789-C-22", surname: "Khumalo", firstName: "Bongani", dob: "1976-03-07", gender: "M", ward: "Bulawayo Central" },
  { id: "07-4567890-D-22", surname: "Mhlanga", firstName: "Lindiwe", dob: "1989-07-16", gender: "F", ward: "Bulawayo Central" },
  { id: "07-5678901-E-22", surname: "Nkosi", firstName: "Lungelo", dob: "1994-12-01", gender: "M", ward: "Bulawayo Central" },
  { id: "07-6789012-F-22", surname: "Dlamini", firstName: "Thandeka", dob: "1981-05-25", gender: "F", ward: "Bulawayo West" },
  { id: "07-7890123-G-22", surname: "Moyo", firstName: "Njabulo", dob: "1973-09-13", gender: "M", ward: "Bulawayo West" },
  { id: "07-8901234-H-22", surname: "Ngwenya", firstName: "Zanele", dob: "1996-01-07", gender: "F", ward: "Bulawayo West" },
  { id: "07-9012345-J-22", surname: "Sibanda", firstName: "Dumisani", dob: "1985-04-20", gender: "M", ward: "Bulawayo West" },
  { id: "07-0123456-K-22", surname: "Mpofu", firstName: "Nomvula", dob: "1990-08-09", gender: "F", ward: "Bulawayo West" },
  { id: "30-1234567-A-44", surname: "Chirinda", firstName: "Tinashe", dob: "1987-02-14", gender: "M", ward: "Gweru Urban" },
  { id: "30-2345678-B-44", surname: "Mwenye", firstName: "Vimbai", dob: "1993-06-30", gender: "F", ward: "Gweru Urban" },
  { id: "30-3456789-C-44", surname: "Gumbo", firstName: "Tapiwa", dob: "1979-11-18", gender: "M", ward: "Gweru Urban" },
  { id: "30-4567890-D-44", surname: "Makunike", firstName: "Nyasha", dob: "1991-03-05", gender: "F", ward: "Gweru Urban" },
  { id: "30-5678901-E-44", surname: "Hungwe", firstName: "Simbarashe", dob: "1984-07-23", gender: "M", ward: "Gweru Urban" },
  { id: "63-1357924-L-75", surname: "Chigumba", firstName: "Makomborero", dob: "1986-01-10", gender: "M", ward: "Harare South" },
  { id: "63-2468013-M-75", surname: "Nhavoto", firstName: "Tariro", dob: "1998-05-17", gender: "F", ward: "Harare South" },
  { id: "63-3579124-N-75", surname: "Muzenda", firstName: "Tichaona", dob: "1971-09-04", gender: "M", ward: "Harare South" },
  { id: "63-4680235-P-75", surname: "Makoni", firstName: "Rumbidzai", dob: "1994-12-28", gender: "F", ward: "Harare North" },
  { id: "63-5791346-Q-75", surname: "Chiwenga", firstName: "Kudzai", dob: "1988-04-11", gender: "M", ward: "Harare North" },
  { id: "07-1357924-L-22", surname: "Tshuma", firstName: "Nhlanhla", dob: "1983-08-22", gender: "M", ward: "Bulawayo Central" },
  { id: "07-2468013-M-22", surname: "Moyo", firstName: "Busisiwe", dob: "1995-02-15", gender: "F", ward: "Bulawayo Central" },
  { id: "07-3579124-N-22", surname: "Dlodlo", firstName: "Siyabonga", dob: "1977-06-03", gender: "M", ward: "Bulawayo West" },
  { id: "07-4680235-P-22", surname: "Ndebele", firstName: "Thandi", dob: "1992-10-19", gender: "F", ward: "Bulawayo West" },
  { id: "07-5791346-Q-22", surname: "Mabhena", firstName: "Mqondisi", dob: "1986-03-08", gender: "M", ward: "Bulawayo West" },
  { id: "30-6789012-F-44", surname: "Musiiwa", firstName: "Chioneso", dob: "1980-07-14", gender: "F", ward: "Gweru Urban" },
  { id: "30-7890123-G-44", surname: "Zimondi", firstName: "Ngonidzashe", dob: "1975-11-27", gender: "M", ward: "Gweru Urban" },
  { id: "30-8901234-H-44", surname: "Mutunhu", firstName: "Fadzai", dob: "1997-04-06", gender: "F", ward: "Gweru Urban" },
  { id: "63-6802357-R-75", surname: "Mudzingwa", firstName: "Takudzwa", dob: "1989-08-31", gender: "M", ward: "Harare South" },
  { id: "63-7913468-S-75", surname: "Tsvangirai", firstName: "Tsitsi", dob: "1982-12-16", gender: "F", ward: "Harare South" },
  { id: "63-8024579-T-75", surname: "Chamisa", firstName: "Munashe", dob: "1996-05-09", gender: "M", ward: "Harare North" },
  { id: "63-9135680-U-75", surname: "Madhuku", firstName: "Chipo", dob: "1974-09-23", gender: "F", ward: "Harare North" },
  { id: "07-6802357-R-22", surname: "Sibindi", firstName: "Thulisile", dob: "1991-01-12", gender: "F", ward: "Bulawayo Central" },
  { id: "07-7913468-S-22", surname: "Gumede", firstName: "Mduduzi", dob: "1978-05-29", gender: "M", ward: "Bulawayo Central" },
  { id: "07-8024579-T-22", surname: "Ncube", firstName: "Nomathemba", dob: "1993-09-07", gender: "F", ward: "Bulawayo West" },
  { id: "07-9135680-U-22", surname: "Moyo", firstName: "Sibusiso", dob: "1984-02-24", gender: "M", ward: "Bulawayo West" },
  { id: "30-9012345-J-44", surname: "Matema", firstName: "Blessing", dob: "1990-06-18", gender: "M", ward: "Gweru Urban" },
  { id: "30-0123456-K-44", surname: "Pfugari", firstName: "Miriam", dob: "1987-10-05", gender: "F", ward: "Gweru Urban" },
  { id: "63-0246813-V-75", surname: "Mutsvangwa", firstName: "Tafadzwa", dob: "1995-03-22", gender: "M", ward: "Harare South" },
  { id: "63-1357924-W-75", surname: "Chombo", firstName: "Sekai", dob: "1981-07-10", gender: "F", ward: "Harare South" },
  { id: "63-2468035-X-75", surname: "Kasukuwere", firstName: "Tinotenda", dob: "1976-11-28", gender: "M", ward: "Harare North" },
  { id: "63-3579146-Y-75", surname: "Chiyangwa", firstName: "Plaxedes", dob: "1998-04-15", gender: "F", ward: "Harare North" },
  { id: "07-0246813-V-22", surname: "Moyo", firstName: "Zwelakhe", dob: "1979-08-02", gender: "M", ward: "Bulawayo Central" },
  { id: "07-1357924-W-22", surname: "Sithole", firstName: "Nozipho", dob: "1994-12-19", gender: "F", ward: "Bulawayo Central" },
  { id: "07-2468035-X-22", surname: "Dube", firstName: "Khulekani", dob: "1982-05-06", gender: "M", ward: "Bulawayo West" },
  { id: "07-3579146-Y-22", surname: "Mthethwa", firstName: "Ntombifuthi", dob: "1991-09-24", gender: "F", ward: "Bulawayo West" },
  { id: "30-1357924-L-44", surname: "Munyaradzi", firstName: "Edmore", dob: "1977-02-11", gender: "M", ward: "Gweru Urban" },
  { id: "30-2468035-M-44", surname: "Chikwiri", firstName: "Patience", dob: "1993-06-28", gender: "F", ward: "Gweru Urban" },
  { id: "63-4680357-Z-75", surname: "Muganhu", firstName: "Itai", dob: "1985-10-17", gender: "M", ward: "Harare South" },
  { id: "63-5791468-A-75", surname: "Nhema", firstName: "Rutendo", dob: "1999-03-04", gender: "F", ward: "Harare South" },
  { id: "63-6802579-B-75", surname: "Biti", firstName: "Shingirai", dob: "1973-07-21", gender: "M", ward: "Harare North" },
  { id: "63-7913680-C-75", surname: "Coltart", firstName: "Thandayi", dob: "1996-11-08", gender: "F", ward: "Harare North" },
  { id: "07-4680357-Z-22", surname: "Hlongwane", firstName: "Phiwayinkosi", dob: "1988-04-25", gender: "M", ward: "Bulawayo Central" },
  { id: "07-5791468-A-22", surname: "Moyo", firstName: "Sakhile", dob: "1980-08-12", gender: "F", ward: "Bulawayo Central" },
  { id: "07-6802579-B-22", surname: "Ndlovu", firstName: "Lungisani", dob: "1995-01-29", gender: "M", ward: "Bulawayo West" },
  { id: "07-7913680-C-22", surname: "Zulu", firstName: "Nokukhanya", dob: "1983-05-16", gender: "F", ward: "Bulawayo West" },
  { id: "30-3579146-N-44", surname: "Charumbira", firstName: "Kudakwashe", dob: "1989-09-03", gender: "M", ward: "Gweru Urban" },
  { id: "30-4680257-P-44", surname: "Chimhanda", firstName: "Yeukai", dob: "1992-12-20", gender: "F", ward: "Gweru Urban" },
  { id: "63-8024791-D-75", surname: "Murerwa", firstName: "Cleopas", dob: "1971-04-07", gender: "M", ward: "Harare South" },
  { id: "63-9135802-E-75", surname: "Gono", firstName: "Chiedza", dob: "1997-08-24", gender: "F", ward: "Harare South" },
  { id: "63-0246913-F-75", surname: "Chinamasa", firstName: "Tatenda", dob: "1984-01-11", gender: "M", ward: "Harare North" },
  { id: "63-1357024-G-75", surname: "Mudenge", firstName: "Ruvimbo", dob: "1976-05-28", gender: "F", ward: "Harare North" },
  { id: "07-8024791-D-22", surname: "Mpofu", firstName: "Thandolwethu", dob: "1986-09-15", gender: "M", ward: "Bulawayo Central" },
  { id: "07-9135802-E-22", surname: "Ncube", firstName: "Ayanda", dob: "1993-02-02", gender: "F", ward: "Bulawayo Central" },
  { id: "07-0246913-F-22", surname: "Mafu", firstName: "Mlungisi", dob: "1978-06-19", gender: "M", ward: "Bulawayo West" },
  { id: "07-1357024-G-22", surname: "Ndlovu", firstName: "Simangele", dob: "1991-10-07", gender: "F", ward: "Bulawayo West" },
  { id: "30-5791368-Q-44", surname: "Mutasa", firstName: "Panashe", dob: "1987-03-24", gender: "M", ward: "Gweru Urban" },
  { id: "30-6802479-R-44", surname: "Chikwava", firstName: "Tarisai", dob: "1994-07-11", gender: "F", ward: "Gweru Urban" },
  { id: "63-2468124-H-75", surname: "Mzembi", firstName: "Tinotenda", dob: "1980-11-28", gender: "M", ward: "Harare South" },
  { id: "63-3579235-J-75", surname: "Chigwedere", firstName: "Nyaradzo", dob: "1998-04-15", gender: "F", ward: "Harare South" },
  { id: "63-4680346-K-75", surname: "Mavhaire", firstName: "Kudakwashe", dob: "1975-08-02", gender: "M", ward: "Harare North" },
  { id: "63-5791457-L-75", surname: "Mutsekwa", firstName: "Simbisai", dob: "1990-12-19", gender: "F", ward: "Harare North" },
  { id: "07-2468124-H-22", surname: "Mathe", firstName: "Lwazi", dob: "1982-05-06", gender: "M", ward: "Bulawayo Central" },
  { id: "07-3579235-J-22", surname: "Moyo", firstName: "Nozinhle", dob: "1997-09-23", gender: "F", ward: "Bulawayo Central" },
  { id: "07-4680346-K-22", surname: "Sibanda", firstName: "Mthulisi", dob: "1985-02-10", gender: "M", ward: "Bulawayo West" },
  { id: "07-5791457-L-22", surname: "Dube", firstName: "Nolwazi", dob: "1992-06-28", gender: "F", ward: "Bulawayo West" },
  { id: "30-7913580-S-44", surname: "Marange", firstName: "Tawanda", dob: "1978-10-15", gender: "M", ward: "Gweru Urban" },
  { id: "30-8024691-T-44", surname: "Manyau", firstName: "Chipo", dob: "1995-03-02", gender: "F", ward: "Gweru Urban" },
  { id: "63-6802568-M-75", surname: "Mahofa", firstName: "Tonderai", dob: "1983-07-19", gender: "M", ward: "Harare South" },
  { id: "63-7913679-N-75", surname: "Zhuwao", firstName: "Tendai", dob: "1999-11-05", gender: "F", ward: "Harare South" },
  { id: "07-6802568-M-22", surname: "Hadebe", firstName: "Nkosinathi", dob: "1977-04-22", gender: "M", ward: "Bulawayo Central" },
  { id: "07-7913679-N-22", surname: "Moyo", firstName: "Ntombizodwa", dob: "1989-08-09", gender: "F", ward: "Bulawayo West" },
  { id: "30-9135802-U-44", surname: "Makore", firstName: "Tatenda", dob: "1986-01-26", gender: "M", ward: "Gweru Urban" },
  { id: "30-0246913-V-44", surname: "Chihuri", firstName: "Ruvimbo", dob: "1993-05-13", gender: "F", ward: "Gweru Urban" },
  { id: "63-8024780-P-75", surname: "Chidhakwa", firstName: "Farai", dob: "1974-09-30", gender: "M", ward: "Harare North" },
  { id: "63-9135891-Q-75", surname: "Mavima", firstName: "Nyasha", dob: "1996-02-17", gender: "F", ward: "Harare North" },
];

// ─── ID HELPERS ───────────────────────────────────────────────────────────────
function normaliseID(raw) {
  return raw.replace(/[\s\-]/g, "").toUpperCase();
}

function formatID(norm) {
  if (norm.length === 12) {
    return norm.slice(0,2) + "-" + norm.slice(2,9) + "-" + norm.slice(9,10) + "-" + norm.slice(10,12);
  }
  return norm;
}

function lookupID(rawInput) {
  const norm = normaliseID(rawInput);
  return VOTERS_ROLL.find(v => normaliseID(v.id) === norm) || null;
}

// ─── SUPABASE DATA FUNCTIONS ──────────────────────────────────────────────────
let regCounter = 1;

async function checkDuplicate(rawInput) {
  const norm = normaliseID(rawInput);
  const formatted = formatID(norm);
  const { data } = await supabase
    .from("registrations")
    .select("id")
    .eq("id_number", formatted)
    .limit(1);
  return data && data.length > 0;
}

async function saveRegistration(record) {
  const regId = `REG-${String(Date.now()).slice(-6)}`;
  const { data, error } = await supabase
    .from("registrations")
    .insert([{
      reg_id: regId,
      id_number: record.idNumber,
      full_name: record.fullName,
      ward: record.ward,
      status: record.status,
      phone: record.phone,
      enumerator: record.enumerator,
      dob: record.dob,
      gender: record.gender,
    }])
    .select()
    .single();
  if (error) throw error;
  return { ...record, regId, timestamp: data.timestamp };
}

async function fetchRegistrations() {
  const { data, error } = await supabase
    .from("registrations")
    .select("*")
    .order("timestamp", { ascending: false });
  if (error) throw error;
  // Normalise DB column names to match app field names
  return (data || []).map(r => ({
    regId: r.reg_id,
    idNumber: r.id_number,
    fullName: r.full_name,
    ward: r.ward,
    status: r.status,
    phone: r.phone,
    enumerator: r.enumerator,
    dob: r.dob,
    gender: r.gender,
    timestamp: r.timestamp,
  }));
}

// ─── ICONS ────────────────────────────────────────────────────────────────────
const Icon = {
  Shield: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  Check: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  X: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  User: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  LogOut: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  Search: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  BarChart: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/></svg>,
  List: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>,
  MapPin: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>,
  AlertTriangle: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  Eye: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
  EyeOff: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>,
  Clipboard: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/></svg>,
  Wifi: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/></svg>,
};

// ─── STYLES ───────────────────────────────────────────────────────────────────
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --bg: #0a0f1e; --surface: #0f1629; --surface2: #141d35; --surface3: #1a2440;
    --border: rgba(99,132,255,0.12); --border-bright: rgba(99,132,255,0.3);
    --gold: #f5c842; --gold-dim: rgba(245,200,66,0.15); --gold-glow: rgba(245,200,66,0.3);
    --green: #22c55e; --green-dim: rgba(34,197,94,0.12);
    --red: #ef4444; --red-dim: rgba(239,68,68,0.12);
    --blue: #6384ff; --blue-dim: rgba(99,132,255,0.1);
    --text: #e8edf8; --text-dim: #8892b0; --text-faint: #4a5568;
    --radius: 12px; --radius-sm: 8px;
  }
  body { font-family: 'Sora', sans-serif; background: var(--bg); color: var(--text); min-height: 100vh; overflow-x: hidden; }

  .login-wrap { min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 24px; background: radial-gradient(ellipse 80% 60% at 50% -20%, rgba(99,132,255,0.15) 0%, transparent 70%), radial-gradient(ellipse 60% 40% at 80% 120%, rgba(245,200,66,0.08) 0%, transparent 60%), var(--bg); }
  .login-card { width: 100%; max-width: 420px; background: var(--surface); border: 1px solid var(--border); border-radius: 20px; padding: 48px 40px; box-shadow: 0 32px 80px rgba(0,0,0,0.6); animation: fadeUp 0.5s ease; }
  .login-logo { display: flex; align-items: center; gap: 12px; margin-bottom: 36px; }
  .login-logo-icon { width: 44px; height: 44px; background: linear-gradient(135deg, var(--gold), #e8a020); border-radius: 12px; display: flex; align-items: center; justify-content: center; color: #0a0f1e; box-shadow: 0 8px 24px var(--gold-glow); }
  .login-logo-icon svg { width: 22px; height: 22px; }
  .login-logo-name { font-size: 18px; font-weight: 700; }
  .login-logo-sub { font-size: 11px; color: var(--text-dim); text-transform: uppercase; letter-spacing: 1.5px; font-weight: 500; }
  .login-title { font-size: 26px; font-weight: 700; letter-spacing: -0.5px; margin-bottom: 6px; }
  .login-sub { font-size: 14px; color: var(--text-dim); margin-bottom: 32px; }
  .role-tabs { display: flex; background: var(--surface2); border-radius: var(--radius-sm); padding: 4px; margin-bottom: 28px; gap: 4px; }
  .role-tab { flex: 1; padding: 9px; border: none; background: none; border-radius: 6px; font-family: inherit; font-size: 13px; font-weight: 500; color: var(--text-dim); cursor: pointer; transition: all 0.2s; }
  .role-tab.active { background: var(--surface3); color: var(--text); box-shadow: 0 2px 8px rgba(0,0,0,0.3); }
  .form-group { margin-bottom: 20px; }
  .form-label { display: block; font-size: 12px; font-weight: 600; color: var(--text-dim); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px; }
  .input-wrap { position: relative; }
  .form-input { width: 100%; background: var(--surface2); border: 1px solid var(--border); border-radius: var(--radius-sm); padding: 13px 16px; font-family: 'Sora', sans-serif; font-size: 14px; color: var(--text); outline: none; transition: border-color 0.2s, box-shadow 0.2s; }
  .form-input:focus { border-color: var(--blue); box-shadow: 0 0 0 3px rgba(99,132,255,0.1); }
  .pw-toggle { position: absolute; right: 14px; top: 50%; transform: translateY(-50%); background: none; border: none; color: var(--text-dim); cursor: pointer; padding: 4px; display: flex; }
  .pw-toggle svg { width: 16px; height: 16px; }
  .login-error { background: var(--red-dim); border: 1px solid rgba(239,68,68,0.25); border-radius: var(--radius-sm); padding: 12px 14px; font-size: 13px; color: var(--red); margin-bottom: 20px; }
  .btn { display: inline-flex; align-items: center; justify-content: center; gap: 8px; padding: 14px 24px; border: none; border-radius: var(--radius-sm); font-family: 'Sora', sans-serif; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.2s; width: 100%; }
  .btn-gold { background: linear-gradient(135deg, var(--gold), #e8a020); color: #0a0f1e; box-shadow: 0 4px 16px var(--gold-glow); }
  .btn-gold:hover { transform: translateY(-1px); box-shadow: 0 8px 24px var(--gold-glow); }
  .btn-outline { background: transparent; border: 1px solid var(--border-bright); color: var(--text); }
  .btn-outline:hover { background: var(--blue-dim); border-color: var(--blue); }
  .btn-ghost { background: var(--surface2); color: var(--text-dim); }
  .btn-ghost:hover { color: var(--text); background: var(--surface3); }
  .btn-green { background: var(--green); color: #fff; box-shadow: 0 4px 16px rgba(34,197,94,0.3); }
  .btn-green:hover { transform: translateY(-1px); }
  .btn-sm { padding: 8px 16px; font-size: 12px; width: auto; }
  .demo-hint { margin-top: 24px; padding: 14px; background: var(--gold-dim); border: 1px solid rgba(245,200,66,0.2); border-radius: var(--radius-sm); font-size: 12px; color: var(--gold); }
  .demo-hint strong { display: block; margin-bottom: 4px; }

  .app { display: flex; height: 100vh; overflow: hidden; }
  .sidebar { width: 240px; min-width: 240px; background: var(--surface); border-right: 1px solid var(--border); display: flex; flex-direction: column; padding: 24px 16px; }
  .sidebar-logo { display: flex; align-items: center; gap: 10px; padding: 0 8px; margin-bottom: 36px; }
  .sidebar-logo-icon { width: 36px; height: 36px; background: linear-gradient(135deg, var(--gold), #e8a020); border-radius: 9px; display: flex; align-items: center; justify-content: center; color: #0a0f1e; flex-shrink: 0; }
  .sidebar-logo-icon svg { width: 18px; height: 18px; }
  .sidebar-logo-name { font-size: 15px; font-weight: 700; letter-spacing: -0.3px; }
  .sidebar-logo-sub { font-size: 10px; color: var(--text-dim); text-transform: uppercase; letter-spacing: 1.2px; }
  .sidebar-section { font-size: 10px; font-weight: 600; color: var(--text-faint); text-transform: uppercase; letter-spacing: 1.5px; padding: 0 8px; margin-bottom: 8px; margin-top: 24px; }
  .nav-item { display: flex; align-items: center; gap: 10px; padding: 10px 12px; border-radius: var(--radius-sm); font-size: 13px; font-weight: 500; color: var(--text-dim); cursor: pointer; transition: all 0.15s; border: none; background: none; width: 100%; text-align: left; }
  .nav-item svg { width: 16px; height: 16px; flex-shrink: 0; }
  .nav-item:hover { background: var(--surface2); color: var(--text); }
  .nav-item.active { background: var(--gold-dim); color: var(--gold); }
  .sidebar-spacer { flex: 1; }
  .sidebar-user { border-top: 1px solid var(--border); padding-top: 16px; display: flex; align-items: center; gap: 10px; }
  .user-avatar { width: 32px; height: 32px; border-radius: 50%; background: var(--surface3); display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; color: var(--gold); flex-shrink: 0; }
  .user-info { flex: 1; min-width: 0; }
  .user-name { font-size: 13px; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .user-role { font-size: 11px; color: var(--text-dim); }

  .main { flex: 1; overflow-y: auto; padding: 32px; background: radial-gradient(ellipse 60% 40% at 100% 0%, rgba(99,132,255,0.06) 0%, transparent 60%), var(--bg); }
  .page-header { margin-bottom: 28px; }
  .page-title { font-size: 26px; font-weight: 700; letter-spacing: -0.5px; margin-bottom: 4px; }
  .page-sub { font-size: 14px; color: var(--text-dim); }
  .stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 24px; }
  .stat-card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 20px; position: relative; overflow: hidden; }
  .stat-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px; }
  .stat-card.gold::before { background: linear-gradient(90deg, var(--gold), transparent); }
  .stat-card.green::before { background: linear-gradient(90deg, var(--green), transparent); }
  .stat-card.red::before { background: linear-gradient(90deg, var(--red), transparent); }
  .stat-label { font-size: 11px; font-weight: 600; color: var(--text-dim); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px; }
  .stat-value { font-size: 36px; font-weight: 700; letter-spacing: -1px; line-height: 1; margin-bottom: 4px; }
  .stat-value.gold { color: var(--gold); }
  .stat-value.green { color: var(--green); }
  .stat-value.red { color: var(--red); }
  .stat-sub { font-size: 12px; color: var(--text-faint); }
  .panel { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); overflow: hidden; margin-bottom: 20px; }
  .panel-header { padding: 18px 24px; border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; }
  .panel-title { font-size: 14px; font-weight: 600; display: flex; align-items: center; gap: 8px; }
  .panel-title svg { width: 16px; height: 16px; color: var(--gold); }
  .panel-body { padding: 24px; }
  .table-wrap { overflow-x: auto; }
  table { width: 100%; border-collapse: collapse; font-size: 13px; }
  th { padding: 10px 14px; text-align: left; font-size: 11px; font-weight: 600; color: var(--text-faint); text-transform: uppercase; letter-spacing: 1px; border-bottom: 1px solid var(--border); }
  td { padding: 12px 14px; border-bottom: 1px solid rgba(99,132,255,0.05); color: var(--text); }
  tr:last-child td { border-bottom: none; }
  tr:hover td { background: var(--surface2); }
  .mono-td { font-family: 'JetBrains Mono', monospace; font-size: 12px; color: var(--text-dim); }
  .badge { display: inline-flex; align-items: center; gap: 5px; padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
  .badge svg { width: 11px; height: 11px; }
  .badge-green { background: var(--green-dim); color: var(--green); border: 1px solid rgba(34,197,94,0.2); }
  .badge-red { background: var(--red-dim); color: var(--red); border: 1px solid rgba(239,68,68,0.2); }
  .badge-gold { background: var(--gold-dim); color: var(--gold); border: 1px solid rgba(245,200,66,0.2); }
  .ward-list { display: flex; flex-direction: column; gap: 10px; }
  .ward-row { display: flex; align-items: center; gap: 12px; }
  .ward-name { font-size: 13px; color: var(--text-dim); width: 140px; flex-shrink: 0; }
  .ward-bar-wrap { flex: 1; height: 6px; background: var(--surface2); border-radius: 3px; overflow: hidden; }
  .ward-bar { height: 100%; background: linear-gradient(90deg, var(--gold), var(--blue)); border-radius: 3px; transition: width 0.8s cubic-bezier(0.16,1,0.3,1); }
  .ward-count { font-size: 13px; font-weight: 600; color: var(--text); width: 24px; text-align: right; }
  .search-bar { position: relative; margin-bottom: 0; }
  .search-bar svg { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); width: 15px; height: 15px; color: var(--text-faint); pointer-events: none; }
  .search-input { width: 240px; background: var(--surface2); border: 1px solid var(--border); border-radius: var(--radius-sm); padding: 9px 14px 9px 38px; font-family: 'Sora', sans-serif; font-size: 13px; color: var(--text); outline: none; }
  .search-input:focus { border-color: var(--blue); }

  .realtime-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--green); display: inline-block; margin-right: 6px; animation: blink 2s ease infinite; }
  @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.3} }

  .enum-wrap { min-height: 100vh; background: radial-gradient(ellipse 80% 50% at 50% 0%, rgba(245,200,66,0.08) 0%, transparent 60%), var(--bg); padding: 24px 16px; display: flex; flex-direction: column; max-width: 480px; margin: 0 auto; }
  .enum-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 28px; }
  .enum-logo { display: flex; align-items: center; gap: 10px; }
  .enum-logo-icon { width: 36px; height: 36px; background: linear-gradient(135deg, var(--gold), #e8a020); border-radius: 9px; display: flex; align-items: center; justify-content: center; color: #0a0f1e; }
  .enum-logo-icon svg { width: 18px; height: 18px; }
  .enum-logo-text { font-size: 15px; font-weight: 700; }
  .enum-session { font-size: 11px; color: var(--text-dim); background: var(--surface); border: 1px solid var(--border); border-radius: 20px; padding: 5px 12px; }
  .id-input-panel { background: var(--surface); border: 1px solid var(--border); border-radius: 16px; padding: 24px; margin-bottom: 20px; }
  .id-field-label { font-size: 11px; font-weight: 600; color: var(--text-dim); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px; display: flex; align-items: center; gap: 6px; }
  .id-field-label svg { width: 12px; height: 12px; color: var(--gold); }
  .id-input-large { width: 100%; background: var(--surface2); border: 1.5px solid var(--border); border-radius: var(--radius-sm); padding: 16px; font-family: 'JetBrains Mono', monospace; font-size: 18px; letter-spacing: 2px; color: var(--text); outline: none; transition: border-color 0.2s, box-shadow 0.2s; text-transform: uppercase; }
  .id-input-large:focus { border-color: var(--gold); box-shadow: 0 0 0 3px var(--gold-dim); }
  .id-format-hint { font-size: 11px; color: var(--text-faint); margin-top: 8px; font-family: 'JetBrains Mono', monospace; }
  .verify-btn { width: 100%; margin-top: 16px; padding: 16px; background: linear-gradient(135deg, var(--gold), #e8a020); border: none; border-radius: var(--radius-sm); font-family: 'Sora', sans-serif; font-size: 15px; font-weight: 700; color: #0a0f1e; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; transition: all 0.2s; box-shadow: 0 4px 20px var(--gold-glow); }
  .verify-btn:hover { transform: translateY(-1px); box-shadow: 0 8px 28px var(--gold-glow); }
  .verify-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
  .verify-btn svg { width: 18px; height: 18px; }
  .result-card { border-radius: 16px; padding: 24px; margin-bottom: 20px; animation: fadeUp 0.3s ease; }
  .result-card.verified { background: var(--green-dim); border: 1.5px solid rgba(34,197,94,0.3); }
  .result-card.unverified { background: var(--red-dim); border: 1.5px solid rgba(239,68,68,0.3); }
  .result-icon { width: 48px; height: 48px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-bottom: 14px; }
  .result-icon.green { background: rgba(34,197,94,0.2); color: var(--green); }
  .result-icon.red { background: rgba(239,68,68,0.2); color: var(--red); }
  .result-icon svg { width: 24px; height: 24px; }
  .result-status { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 4px; }
  .result-status.green { color: var(--green); }
  .result-status.red { color: var(--red); }
  .result-name { font-size: 22px; font-weight: 700; letter-spacing: -0.5px; margin-bottom: 14px; }
  .result-fields { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
  .result-field-label { font-size: 10px; color: var(--text-faint); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 3px; font-weight: 600; }
  .result-field-value { font-size: 13px; font-weight: 500; }
  .member-form { background: var(--surface); border: 1px solid var(--border); border-radius: 16px; padding: 24px; margin-bottom: 20px; animation: fadeUp 0.3s ease 0.1s both; }
  .member-form-title { font-size: 13px; font-weight: 600; color: var(--text-dim); margin-bottom: 16px; text-transform: uppercase; letter-spacing: 1px; }
  .action-row { display: flex; gap: 10px; }
  .action-row .btn { flex: 1; }
  .success-state { text-align: center; padding: 32px 24px; background: var(--surface); border: 1px solid var(--border); border-radius: 16px; animation: fadeUp 0.4s ease; }
  .success-icon { width: 64px; height: 64px; border-radius: 50%; background: linear-gradient(135deg, var(--green), #16a34a); display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; box-shadow: 0 8px 24px rgba(34,197,94,0.4); }
  .success-icon svg { width: 32px; height: 32px; color: #fff; }
  .success-title { font-size: 20px; font-weight: 700; margin-bottom: 6px; }
  .success-sub { font-size: 13px; color: var(--text-dim); margin-bottom: 8px; }
  .success-reg { font-family: 'JetBrains Mono', monospace; font-size: 14px; color: var(--gold); font-weight: 600; margin-bottom: 24px; }
  .empty-state { text-align: center; padding: 48px 24px; color: var(--text-faint); }
  .empty-state svg { width: 40px; height: 40px; margin-bottom: 12px; opacity: 0.4; }
  .empty-state p { font-size: 13px; }
  @keyframes fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
  .loading { animation: pulse 1.2s ease infinite; }
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: var(--surface3); border-radius: 3px; }
  @media (max-width: 640px) { .stats-grid { grid-template-columns: 1fr; } .sidebar { display: none; } .main { padding: 20px 16px; } }
`;

// ─── USERS ────────────────────────────────────────────────────────────────────
const USERS = {
  admin:  { username: "admin",  password: "admin123", role: "admin",       name: "Admin Portal",              initials: "AD" },
  enum1:  { username: "enum1",  password: "enum123",  role: "enumerator",  name: "Enumerator — Harare South", initials: "E1" },
  enum2:  { username: "enum2",  password: "enum456",  role: "enumerator",  name: "Enumerator — Bulawayo",     initials: "E2" },
};

// ─── LOGIN PAGE ───────────────────────────────────────────────────────────────
function LoginPage({ onLogin }) {
  const [role, setRole] = useState("enumerator");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = () => {
    const user = Object.values(USERS).find(u => u.username === username && u.password === password && u.role === role);
    if (user) { onLogin(user); }
    else { setError("Invalid credentials. Please try again."); }
  };

  const fillDemo = (u) => { setUsername(u.username); setPassword(u.password); setRole(u.role); setError(""); };

  return (
    <div className="login-wrap">
      <style>{styles}</style>
      <div className="login-card">
        <div className="login-logo">
          <div className="login-logo-icon"><Icon.Shield /></div>
          <div>
            <div className="login-logo-name">VerifyZW</div>
            <div className="login-logo-sub">Member Verification</div>
          </div>
        </div>
        <div className="login-title">Sign in</div>
        <div className="login-sub">Select your role and enter your credentials</div>
        <div className="role-tabs">
          <button className={`role-tab ${role === "enumerator" ? "active" : ""}`} onClick={() => { setRole("enumerator"); setError(""); }}>Enumerator</button>
          <button className={`role-tab ${role === "admin" ? "active" : ""}`} onClick={() => { setRole("admin"); setError(""); }}>Admin</button>
        </div>
        {error && <div className="login-error">{error}</div>}
        <div className="form-group">
          <label className="form-label">Username</label>
          <input className="form-input" placeholder="Enter username" value={username} onChange={e => { setUsername(e.target.value); setError(""); }} onKeyDown={e => e.key === "Enter" && handleLogin()} />
        </div>
        <div className="form-group">
          <label className="form-label">Password</label>
          <div className="input-wrap">
            <input className="form-input" type={showPw ? "text" : "password"} placeholder="Enter password" value={password} onChange={e => { setPassword(e.target.value); setError(""); }} onKeyDown={e => e.key === "Enter" && handleLogin()} />
            <button className="pw-toggle" onClick={() => setShowPw(p => !p)}>{showPw ? <Icon.EyeOff /> : <Icon.Eye />}</button>
          </div>
        </div>
        <button className="btn btn-gold" onClick={handleLogin}>Sign In</button>
        <div className="demo-hint">
          <strong>Demo Credentials</strong>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "8px" }}>
            <button className="btn btn-ghost btn-sm" onClick={() => fillDemo(USERS.admin)}>Admin Login</button>
            <button className="btn btn-ghost btn-sm" onClick={() => fillDemo(USERS.enum1)}>Enumerator 1</button>
            <button className="btn btn-ghost btn-sm" onClick={() => fillDemo(USERS.enum2)}>Enumerator 2</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── ADMIN PORTAL ─────────────────────────────────────────────────────────────
function AdminPortal({ user, onLogout }) {
  const [activeNav, setActiveNav] = useState("dashboard");
  const [search, setSearch] = useState("");
  const [selectedEnum, setSelectedEnum] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Initial load
  useEffect(() => {
    fetchRegistrations().then(data => { setRegistrations(data); setLoading(false); });
  }, []);

  // Realtime subscription — rows appear instantly when enumerator submits
  useEffect(() => {
    const channel = supabase
      .channel("registrations-live")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "registrations" }, payload => {
        const r = payload.new;
        const newReg = {
          regId: r.reg_id, idNumber: r.id_number, fullName: r.full_name,
          ward: r.ward, status: r.status, phone: r.phone, enumerator: r.enumerator,
          dob: r.dob, gender: r.gender, timestamp: r.timestamp,
        };
        setRegistrations(prev => [newReg, ...prev]);
      })
      .subscribe();
    return () => supabase.removeChannel(channel);
  }, []);

  const total = registrations.length;
  const verified = registrations.filter(r => r.status === "VERIFIED").length;
  const unverified = registrations.filter(r => r.status === "UNVERIFIED").length;
  const rate = total > 0 ? Math.round((verified / total) * 100) : 0;

  const byWard = registrations.reduce((acc, r) => { acc[r.ward] = (acc[r.ward] || 0) + 1; return acc; }, {});
  const wardEntries = Object.entries(byWard).sort((a, b) => b[1] - a[1]);
  const maxWard = wardEntries[0]?.[1] || 1;

  const filtered = registrations.filter(r =>
    r.fullName?.toLowerCase().includes(search.toLowerCase()) ||
    r.idNumber?.toLowerCase().includes(search.toLowerCase()) ||
    r.ward?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="app">
      <style>{styles}</style>
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon"><Icon.Shield /></div>
          <div>
            <div className="sidebar-logo-name">VerifyZW</div>
            <div className="sidebar-logo-sub">Admin</div>
          </div>
        </div>
        <div className="sidebar-section">Navigation</div>
        <button className={`nav-item ${activeNav === "dashboard" ? "active" : ""}`} onClick={() => { setActiveNav("dashboard"); setSelectedEnum(null); }}><Icon.BarChart /> Dashboard</button>
        <button className={`nav-item ${activeNav === "registrations" ? "active" : ""}`} onClick={() => { setActiveNav("registrations"); setSelectedEnum(null); }}><Icon.List /> Registrations</button>
        <button className={`nav-item ${activeNav === "enumerators" ? "active" : ""}`} onClick={() => { setActiveNav("enumerators"); setSelectedEnum(null); }}><Icon.User /> By Enumerator</button>
        <div className="sidebar-spacer" />
        <div className="sidebar-user">
          <div className="user-avatar">{user.initials}</div>
          <div className="user-info">
            <div className="user-name">Administrator</div>
            <div className="user-role">Admin Access</div>
          </div>
        </div>
        <button className="btn btn-outline btn-sm" style={{ width: "100%", marginTop: "10px", gap: "8px", color: "var(--red)", borderColor: "rgba(239,68,68,0.3)" }} onClick={onLogout}>
          <Icon.LogOut /> Sign Out
        </button>
      </aside>

      <main className="main">
        {loading && (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "var(--text-faint)", fontSize: "14px" }}>
            Loading data…
          </div>
        )}

        {!loading && activeNav === "dashboard" && (
          <>
            <div className="page-header">
              <div className="page-title">Dashboard</div>
              <div className="page-sub"><span className="realtime-dot" />Live — updates instantly as enumerators register members</div>
            </div>
            <div className="stats-grid">
              <div className="stat-card gold"><div className="stat-label">Total Registrations</div><div className="stat-value gold">{total}</div><div className="stat-sub">All submissions</div></div>
              <div className="stat-card green"><div className="stat-label">Verified</div><div className="stat-value green">{verified}</div><div className="stat-sub">{rate}% pass rate</div></div>
              <div className="stat-card red"><div className="stat-label">Unverified</div><div className="stat-value red">{unverified}</div><div className="stat-sub">Require manual review</div></div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
              <div className="panel">
                <div className="panel-header"><div className="panel-title"><Icon.MapPin /> By Ward</div></div>
                <div className="panel-body">
                  {wardEntries.length === 0 ? <div className="empty-state"><Icon.MapPin /><p>No data yet</p></div> : (
                    <div className="ward-list">
                      {wardEntries.map(([ward, count]) => (
                        <div className="ward-row" key={ward}>
                          <div className="ward-name">{ward}</div>
                          <div className="ward-bar-wrap"><div className="ward-bar" style={{ width: `${(count / maxWard) * 100}%` }} /></div>
                          <div className="ward-count">{count}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="panel">
                <div className="panel-header"><div className="panel-title"><Icon.AlertTriangle /> Recent Unverified</div></div>
                <div className="panel-body">
                  {registrations.filter(r => r.status === "UNVERIFIED").length === 0 ? (
                    <div className="empty-state"><Icon.Check /><p>No unverified records</p></div>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                      {registrations.filter(r => r.status === "UNVERIFIED").slice(0, 5).map(r => (
                        <div key={r.regId} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 12px", background: "var(--red-dim)", borderRadius: "8px", border: "1px solid rgba(239,68,68,0.15)" }}>
                          <div>
                            <div style={{ fontSize: "13px", fontWeight: 600 }}>{r.fullName || "Unknown"}</div>
                            <div style={{ fontSize: "11px", color: "var(--text-faint)", fontFamily: "JetBrains Mono, monospace" }}>{r.idNumber}</div>
                          </div>
                          <span className="badge badge-red"><Icon.X />Unverified</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}

        {!loading && activeNav === "enumerators" && (() => {
          const enumNames = [...new Set(registrations.map(r => r.enumerator))];
          const enumStats = enumNames.map(name => {
            const recs = registrations.filter(r => r.enumerator === name);
            const v = recs.filter(r => r.status === "VERIFIED").length;
            const u = recs.filter(r => r.status === "UNVERIFIED").length;
            const rt = recs.length > 0 ? Math.round((v / recs.length) * 100) : 0;
            return { name, total: recs.length, verified: v, unverified: u, rate: rt };
          }).sort((a, b) => b.total - a.total);
          const selectedRecs = selectedEnum ? registrations.filter(r => r.enumerator === selectedEnum) : [];
          return (
            <>
              <div className="page-header" style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                <div><div className="page-title">By Enumerator</div><div className="page-sub">Performance breakdown per field enumerator</div></div>
                {selectedEnum && <button className="btn btn-ghost btn-sm" onClick={() => setSelectedEnum(null)}>← All Enumerators</button>}
              </div>
              {!selectedEnum ? (
                enumStats.length === 0 ? <div className="panel"><div className="empty-state" style={{ padding: "48px" }}><Icon.User /><p>No registrations yet.</p></div></div> : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                    {enumStats.map(e => (
                      <div key={e.name} className="panel" style={{ cursor: "pointer" }} onClick={() => setSelectedEnum(e.name)}>
                        <div style={{ padding: "20px 24px", display: "flex", alignItems: "center", gap: "20px" }}>
                          <div className="user-avatar" style={{ width: "42px", height: "42px", fontSize: "14px", flexShrink: 0 }}>{e.name.split(" ").map(w => w[0]).join("").slice(0,2).toUpperCase()}</div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: "14px", fontWeight: 600, marginBottom: "4px" }}>{e.name}</div>
                            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                              <span className="badge badge-gold">{e.total} total</span>
                              <span className="badge badge-green"><Icon.Check />{e.verified} verified</span>
                              {e.unverified > 0 && <span className="badge badge-red"><Icon.X />{e.unverified} flagged</span>}
                            </div>
                          </div>
                          <div style={{ textAlign: "right", flexShrink: 0 }}>
                            <div style={{ fontSize: "28px", fontWeight: 700, color: e.rate >= 80 ? "var(--green)" : e.rate >= 50 ? "var(--gold)" : "var(--red)", lineHeight: 1 }}>{e.rate}%</div>
                            <div style={{ fontSize: "11px", color: "var(--text-faint)", marginTop: "2px" }}>pass rate</div>
                          </div>
                          <div style={{ width: "80px", height: "6px", background: "var(--surface2)", borderRadius: "3px", overflow: "hidden", flexShrink: 0 }}>
                            <div style={{ width: `${e.rate}%`, height: "100%", background: e.rate >= 80 ? "var(--green)" : e.rate >= 50 ? "var(--gold)" : "var(--red)", borderRadius: "3px" }} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )
              ) : (
                <div className="panel">
                  <div style={{ padding: "20px 24px", display: "flex", gap: "24px", borderBottom: "1px solid var(--border)" }}>
                    {[{ label: "Total", value: selectedRecs.length, color: "var(--gold)" }, { label: "Verified", value: selectedRecs.filter(r => r.status === "VERIFIED").length, color: "var(--green)" }, { label: "Flagged", value: selectedRecs.filter(r => r.status === "UNVERIFIED").length, color: "var(--red)" }, { label: "Pass Rate", value: selectedRecs.length > 0 ? `${Math.round(selectedRecs.filter(r => r.status === "VERIFIED").length / selectedRecs.length * 100)}%` : "—", color: "var(--blue)" }].map(s => (
                      <div key={s.label}><div style={{ fontSize: "11px", color: "var(--text-faint)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "4px" }}>{s.label}</div><div style={{ fontSize: "24px", fontWeight: 700, color: s.color }}>{s.value}</div></div>
                    ))}
                  </div>
                  <div className="table-wrap">
                    <table>
                      <thead><tr><th>Reg ID</th><th>Full Name</th><th>National ID</th><th>Ward</th><th>Status</th><th>Time</th></tr></thead>
                      <tbody>
                        {selectedRecs.map(r => (
                          <tr key={r.regId}>
                            <td className="mono-td">{r.regId}</td>
                            <td style={{ fontWeight: 500 }}>{r.fullName || "—"}</td>
                            <td className="mono-td">{r.idNumber}</td>
                            <td style={{ color: "var(--text-dim)" }}>{r.ward}</td>
                            <td>{r.status === "VERIFIED" ? <span className="badge badge-green"><Icon.Check />Verified</span> : <span className="badge badge-red"><Icon.X />Unverified</span>}</td>
                            <td style={{ color: "var(--text-faint)", fontSize: "12px" }}>{new Date(r.timestamp).toLocaleTimeString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          );
        })()}

        {!loading && activeNav === "registrations" && (
          <>
            <div className="page-header" style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
              <div><div className="page-title">Registrations</div><div className="page-sub">{registrations.length} total records</div></div>
              <div className="search-bar"><Icon.Search /><input className="search-input" placeholder="Search name, ID, ward…" value={search} onChange={e => setSearch(e.target.value)} /></div>
            </div>
            <div className="panel">
              {filtered.length === 0 ? (
                <div className="empty-state" style={{ padding: "48px" }}><Icon.Clipboard /><p>{search ? "No matching records" : "No registrations yet."}</p></div>
              ) : (
                <div className="table-wrap">
                  <table>
                    <thead><tr><th>Reg ID</th><th>Full Name</th><th>National ID</th><th>Ward</th><th>Status</th><th>Time</th><th>Enumerator</th></tr></thead>
                    <tbody>
                      {filtered.map(r => (
                        <tr key={r.regId}>
                          <td className="mono-td">{r.regId}</td>
                          <td style={{ fontWeight: 500 }}>{r.fullName || "—"}</td>
                          <td className="mono-td">{r.idNumber}</td>
                          <td style={{ color: "var(--text-dim)" }}>{r.ward}</td>
                          <td>{r.status === "VERIFIED" ? <span className="badge badge-green"><Icon.Check />Verified</span> : <span className="badge badge-red"><Icon.X />Unverified</span>}</td>
                          <td style={{ color: "var(--text-faint)", fontSize: "12px" }}>{new Date(r.timestamp).toLocaleTimeString()}</td>
                          <td style={{ color: "var(--text-dim)", fontSize: "12px" }}>{r.enumerator}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}

// ─── ENUMERATOR PORTAL ────────────────────────────────────────────────────────
function EnumeratorPortal({ user, onLogout }) {
  const [idInput, setIdInput] = useState("");
  const [lookupResult, setLookupResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState("input");
  const [form, setForm] = useState({ phone: "", ward: "", notes: "" });
  const [submitted, setSubmitted] = useState(null);
  const [sessionCount, setSessionCount] = useState(0);

  // Load session count on mount
  useEffect(() => {
    fetchRegistrations().then(data => {
      setSessionCount(data.filter(r => r.enumerator === user.name).length);
    });
  }, []);

  const handleVerify = async () => {
    if (!idInput.trim()) return;
    setLoading(true);
    const dup = await checkDuplicate(idInput.trim());
    if (dup) {
      setLookupResult({ duplicate: true, found: false, voter: null });
      setStep("form");
      setLoading(false);
      return;
    }
    const voter = lookupID(idInput.trim());
    setLookupResult({ duplicate: false, found: !!voter, voter });
    setLoading(false);
    setStep("form");
  };

  const handleSubmit = async () => {
    const voter = lookupResult?.voter;
    const normId = formatID(normaliseID(idInput.trim()));
    const record = {
      idNumber: normId,
      fullName: voter ? `${voter.firstName} ${voter.surname}` : (form.notes || "Unverified Member"),
      ward: voter?.ward || form.ward || "Unknown",
      status: lookupResult?.found ? "VERIFIED" : "UNVERIFIED",
      phone: form.phone,
      enumerator: user.name,
      dob: voter?.dob || "—",
      gender: voter?.gender || "—",
    };
    try {
      const saved = await saveRegistration(record);
      setSubmitted(saved);
      setSessionCount(c => c + 1);
      setStep("success");
    } catch (err) {
      alert("Failed to save. Check your internet connection and try again.");
    }
  };

  const handleReset = () => {
    setIdInput(""); setLookupResult(null); setStep("input");
    setForm({ phone: "", ward: "", notes: "" }); setSubmitted(null); setLoading(false);
  };

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh" }}>
      <style>{styles}</style>
      <div className="enum-wrap">
        <div className="enum-header">
          <div className="enum-logo">
            <div className="enum-logo-icon"><Icon.Shield /></div>
            <div className="enum-logo-text">VerifyZW</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div className="enum-session">{sessionCount} registered</div>
            <button className="btn btn-ghost btn-sm" style={{ width: "auto", gap: "6px" }} onClick={onLogout}><Icon.LogOut style={{ width: 14, height: 14 }} /> Out</button>
          </div>
        </div>

        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "10px", padding: "12px 16px", marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px" }}>
          <div className="user-avatar" style={{ width: "28px", height: "28px", fontSize: "11px" }}>{user.initials}</div>
          <div>
            <div style={{ fontSize: "12px", fontWeight: 600 }}>{user.name}</div>
            <div style={{ fontSize: "11px", color: "var(--text-faint)" }}>Active session</div>
          </div>
        </div>

        {step === "input" && (
          <>
            <div className="id-input-panel">
              <div className="id-field-label"><Icon.Search /> National ID Number</div>
              <input
                className="id-input-large"
                placeholder="631234567A75 or 63-1234567-A-75"
                value={idInput}
                onChange={e => setIdInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleVerify()}
                autoFocus
              />
              <div className="id-format-hint">
                {idInput.trim() && normaliseID(idInput).length > 0
                  ? <>Formatted: <span style={{ color: "var(--gold)" }}>{formatID(normaliseID(idInput.trim()))}</span></>
                  : "Dashes and spaces optional — just type the digits and letter"}
              </div>
              <button className="verify-btn" onClick={handleVerify} disabled={!idInput.trim() || loading}>
                {loading ? <span className="loading">Checking…</span> : <><Icon.Search /> Verify ID</>}
              </button>
            </div>
            <div style={{ textAlign: "center", color: "var(--text-faint)", fontSize: "12px", padding: "12px" }}>
              Enter the member's national ID to check against the voters' roll
            </div>
          </>
        )}

        {step === "form" && lookupResult && (
          <>
            {lookupResult.duplicate && (
              <div className="result-card unverified" style={{ borderColor: "rgba(245,200,66,0.4)", background: "var(--gold-dim)" }}>
                <div className="result-icon" style={{ background: "rgba(245,200,66,0.2)", color: "var(--gold)" }}><Icon.AlertTriangle /></div>
                <div className="result-status" style={{ color: "var(--gold)" }}>⚠ Duplicate — Already Registered</div>
                <div className="result-name" style={{ color: "var(--gold)", fontSize: "16px" }}>This ID has already been submitted. Registration blocked.</div>
                <div style={{ marginTop: "12px" }}><span className="mono-td" style={{ fontSize: "13px" }}>{formatID(normaliseID(idInput.trim()))}</span></div>
              </div>
            )}

            {!lookupResult.duplicate && (
              <div className={`result-card ${lookupResult.found ? "verified" : "unverified"}`}>
                <div className={`result-icon ${lookupResult.found ? "green" : "red"}`}>
                  {lookupResult.found ? <Icon.Check /> : <Icon.X />}
                </div>
                <div className={`result-status ${lookupResult.found ? "green" : "red"}`}>
                  {lookupResult.found ? "✓ ID Verified" : "⚠ Not Found in Register"}
                </div>
                {lookupResult.found ? (
                  <>
                    <div className="result-name">{lookupResult.voter.firstName} {lookupResult.voter.surname}</div>
                    <div className="result-fields">
                      <div><div className="result-field-label">National ID</div><div className="result-field-value" style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "12px" }}>{lookupResult.voter.id}</div></div>
                      <div><div className="result-field-label">Date of Birth</div><div className="result-field-value">{lookupResult.voter.dob}</div></div>
                      <div><div className="result-field-label">Gender</div><div className="result-field-value">{lookupResult.voter.gender === "M" ? "Male" : "Female"}</div></div>
                      <div><div className="result-field-label">Ward</div><div className="result-field-value">{lookupResult.voter.ward}</div></div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="result-name" style={{ color: "var(--red)" }}>ID Not Recognised</div>
                    <div style={{ fontSize: "13px", color: "var(--text-dim)" }}>
                      The ID <span style={{ fontFamily: "JetBrains Mono, monospace", color: "var(--red)" }}>{idInput.toUpperCase()}</span> was not found in the voters' roll. This record will be flagged for manual review.
                    </div>
                  </>
                )}
              </div>
            )}

            {!lookupResult.duplicate && (
              <div className="member-form">
                <div className="member-form-title">Additional Details</div>
                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input className="form-input" placeholder="+263 7X XXX XXXX" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
                </div>
                {!lookupResult.found && (
                  <div className="form-group">
                    <label className="form-label">Ward (Manual Entry)</label>
                    <input className="form-input" placeholder="Enter ward" value={form.ward} onChange={e => setForm(f => ({ ...f, ward: e.target.value }))} />
                  </div>
                )}
                <div className="form-group">
                  <label className="form-label">Notes {lookupResult.found ? "(optional)" : "(required)"}</label>
                  <input className="form-input" placeholder={lookupResult.found ? "Any additional notes…" : "Describe the situation…"} value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
                </div>
              </div>
            )}

            <div className="action-row">
              <button className="btn btn-ghost" onClick={handleReset}>← New Search</button>
              {!lookupResult.duplicate && (
                <button className={`btn ${lookupResult.found ? "btn-green" : "btn-outline"}`} onClick={handleSubmit}>
                  {lookupResult.found ? "Submit Registration" : "Submit (Flagged)"}
                </button>
              )}
            </div>
          </>
        )}

        {step === "success" && submitted && (
          <div className="success-state">
            <div className="success-icon"><Icon.Check /></div>
            <div className="success-title">Registration Saved</div>
            <div className="success-sub">{submitted.fullName}</div>
            <div className="success-reg">{submitted.regId}</div>
            <div style={{ marginBottom: "20px" }}>
              {submitted.status === "VERIFIED"
                ? <span className="badge badge-green"><Icon.Check />Verified Member</span>
                : <span className="badge badge-red"><Icon.AlertTriangle />Flagged for Review</span>}
            </div>
            <button className="btn btn-gold" onClick={handleReset}>Register Next Member</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [user, setUser] = useState(null);
  if (!user) return <LoginPage onLogin={setUser} />;
  if (user.role === "admin") return <AdminPortal user={user} onLogout={() => setUser(null)} />;
  return <EnumeratorPortal user={user} onLogout={() => setUser(null)} />;
}

