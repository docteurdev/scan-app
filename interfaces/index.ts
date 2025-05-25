export type TPointage = {
  code_pointage: number;
  code_site: string;
  day: string;       // e.g. "2024-3-7" - you might want to use Date if parsed
  id: number;
  num_tab: string;
  qrinfo: string;
  site: string;
  synchro: number;   // 0 or 1, could also be boolean if you convert it
  time: string;      // e.g. "11:23:47"
}
