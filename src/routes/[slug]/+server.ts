import { building } from "$app/environment";
import { faunaClient, q } from "$lib/fauna/fauna-config.server";
import { redirect } from "@sveltejs/kit";



/** Primary redirect function - redirect short URL user to actual Google Meet  */
export async function GET({url, params}){
	const shortURL = params.slug; 
	const queryResult : { [x:string] : any} = await faunaClient.query(q.Get(q.Ref(q.Collection('globalLinksMap'), '354931132207202515')));
	const globalLinksMap : { [x:string] : any} = queryResult.data;
	if(Object.keys(globalLinksMap).find((value) => value === shortURL)){
		throw redirect(302,globalLinksMap[shortURL])
	} else {
		throw redirect(302,'/')
	}
}
