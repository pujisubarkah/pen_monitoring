import { writable } from 'svelte/store';

/**
 * @typedef {Object} ActionPlan
 * @property {string} pilar
 * @property {string} kegiatan
 * @property {string} pic
 * @property {string} output
 * @property {string} indikator
 * @property {Object} jadwal
 */

/** @type {ActionPlan[]} */
const initialData = [
  // Anda bisa muat data awal dari file Excel/JSON jika perlu
];

export const actionPlans = writable(initialData);
