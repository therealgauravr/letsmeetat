// * App-wide stores

import { writable } from "svelte/store";


export const blocking = writable(false);
export const newMeetCreated = writable(false);
export const desiredShortLink = writable('');
// export const sideMenuOpen =writable(false);
// export const linkValid = writable(true);