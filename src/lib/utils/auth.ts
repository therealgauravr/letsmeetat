import { blocking } from "../../stores/app";
import { authenticated, tokenClient } from "../../stores/auth";

export function promptForSignIn(authButtonId : string) {
    console.log('GIS loaded... displaying google buttons');
    const authButton = document.getElementById(authButtonId);

    if (authButton) {
        authButton.style.visibility = 'visible';
        authButton.onclick = handleAuthClick;
    }
}


function handleAuthClick() {
    blocking.set(true);
    tokenClient.subscribe((value) => {
        value.callback = async (resp: {
            access_token: string;
            expires_in: number;
            scope: string;
            token_type: string;
            error?: Error;
        }) => {
            if (resp.error !== undefined) {
                throw resp;
            }

            window.localStorage.setItem('access_token', JSON.stringify(gapi.client.getToken()));
            window.localStorage.setItem('created',new Date().getTime().toString())

            // * set a token indicating current timestamp. Necessary for token invalidation


            // ? Is this sufficient to deal with token expiry?
            setTimeout(async () => {
                window.localStorage.removeItem('access_token');
            }, Number(gapi.client.getToken().expires_in) * 1000);
            authenticated.set(true);
            document.getElementById('auth_button').innerText = 'Refresh';
            blocking.set(false);

        };

        if (gapi.client.getToken() === null) {
            // Prompt the user to select a Google Account and ask for consent to share their data
            // when establishing a new session.
            value.requestAccessToken({ prompt: 'consent' });
        } else {
            // Skip display of account chooser and consent dialog for an existing session.
            value.requestAccessToken({ prompt: '' });
        }
    });
}