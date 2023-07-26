



/**
 * As advertised
 * @param access_token Google OAuth 2.0 Access Token
 * @returns The email address of the authorized user
 */
export async function getEmailAddress(access_token : string) : Promise<string>{

    const userInfo = await (await fetch(`https://openidconnect.googleapis.com/v1/userinfo?access_token=${access_token}`)).json(); 
    
    return userInfo.email;

}