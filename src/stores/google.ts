import { writable } from "svelte/store";


export const gapisInited = writable(false);
export const gisInited = writable(false);
export const profile =writable<any>(null);