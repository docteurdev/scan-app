// db.js
import { TPointage } from '@/interfaces';
import * as SQLite from 'expo-sqlite';



let db: SQLite.SQLiteDatabase | null = null;

export const initializeDatabase = async (): Promise<void> => {
  if (!db) {
    db = await SQLite.openDatabaseAsync('ins.db');
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS pointage (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        time TEXT,
        day TEXT,
        qrinfo TEXT,
        site TEXT,
        num_tab TEXT,
        code_site TEXT,
        synchro INTEGER
      );
    `);
    console.log('Database initialized and table created.');
  }
};

export const getDatabase = (): SQLite.SQLiteDatabase => {
  if (!db) {
    throw new Error('Database not initialized. Call initializeDatabase() first.');
  }
  return db;
};

// Usage example functions

export const getItems = async () => {
  try {
    const db = getDatabase();
    const items = await db.getAllAsync('SELECT * FROM pointage');
    return items;
  } catch (error) {
    console.error('Error fetching items:', error);
  }
};

export const getItemsNonSynchro = async (): Promise<TPointage[]> => {
  try {
    const db = getDatabase();
    const items: TPointage[] = await db.getAllAsync('SELECT * FROM pointage');
    console.log('------+++++++++++++++--------', items);
    return items;
  } catch (error) {
    console.error('Error fetching items:', error);
    return [];  // Return empty array on error for safer calling
  }
};

export const updateAllSynchro = async (successCallback, errorCallback) => {
  try {
    const db = getDatabase();
    const result = await db.runAsync('UPDATE pointage SET synchro = 1');
    console.log(`Rows affected: ${result.changes}`);
    if (successCallback) successCallback(result);
  } catch (error) {
    if (errorCallback) errorCallback(error);
  }
};

export const getIt = async (id, currentDay, successCallback, errorCallback) => {
  try {
    const db = getDatabase();
    // Use parameter binding to prevent SQL injection
    const items = await db.getAllAsync('SELECT * FROM pointage WHERE id = ? AND day = ?', [id, currentDay]);
    console.log('------+++++++++++++++--------', items);
    if (successCallback) successCallback(items);
  } catch (error) {
    if (errorCallback) errorCallback(error);
  }
};


export const insertItem = async (
  time: string,
  day: string,
  qrinfo: string,
  site: string,
  num_tab: string,
  code_site: string,
  synchro: number = 0
) => {
  try {
    console.log("Inserting item with data:");
    const db = await SQLite.openDatabaseAsync('ins.db', { useNewConnection: true });

    const results = await db.runAsync(
      'INSERT INTO pointage (time, day, qrinfo, site, num_tab, code_site, synchro) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [time, day, qrinfo, site, num_tab, code_site, synchro]
    );
    // console.log(",,,,,,,,,,,,,,,,,,,,,,,,,",results);
    return results;
  } catch (error) {
    console.error('Error in insertItem:', error);
  }
};


export const deleteAllPointageRecords = async (): Promise<void> => {
  try {
    const database = getDatabase();
    await database.runAsync('DELETE FROM pointage');
    console.log('All records deleted from the pointage table.');
  } catch (error) {
    console.error('Error deleting records from pointage table:', error);
  }
};


