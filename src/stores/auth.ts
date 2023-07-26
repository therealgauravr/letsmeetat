import { writable } from "svelte/store";


/**
 * This state variable maintains auth state across the application
 */
export const authenticated = writable<boolean>(false)
export const tokenClient = writable<any>(null);
export const userEmail = writable<string>(null);