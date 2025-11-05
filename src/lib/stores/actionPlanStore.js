import { writable } from 'svelte/store';

/**
 * @typedef {Object} ActionPlan
 * @property {string} pilar
 * @property {string} kegiatan
 * @property {string} pic
 * @property {string} output
 * @property {string} indikator
 * @property {Object} jadwal - Monthly schedule with boolean values
 * @property {boolean} jadwal.jan
 * @property {boolean} jadwal.feb
 * @property {boolean} jadwal.mar
 * @property {boolean} jadwal.apr
 * @property {boolean} jadwal.may
 * @property {boolean} jadwal.jun
 * @property {boolean} jadwal.jul
 * @property {boolean} jadwal.aug
 * @property {boolean} jadwal.sep
 * @property {boolean} jadwal.oct
 * @property {boolean} jadwal.nov
 * @property {boolean} jadwal.dec
 */

/** @type {ActionPlan[]} */
const initialData = [
  // Anda bisa muat data awal dari file Excel/JSON jika perlu
];

export const actionPlans = writable(initialData);
