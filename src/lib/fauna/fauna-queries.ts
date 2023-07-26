import { goto } from "$app/navigation";
import { createMeetAndReturnLink } from "$lib/google/calendar-queries";
import { blocking } from "../../stores/app";

export const createNewLinkEntryAndUpdateDb = async (shortLink: string, userEmail: string, linksMap : [{ [x: string]: any }]) => {
    blocking.set(true)
    if (shortLink) {

        // * 

        let newLink;
        try { 
            newLink = await createMeetAndReturnLink(userEmail);

        } catch (e : any){
            alert("It seems you haven't given letsmeet permission to access your calendar. Your session will be revoked immediately. Please log in again and give the required permissions to letsmeetat this time");
            window.localStorage.clear();
            goto('/')
        }



        const faunaDB = window.faunadb;
        let q = faunadb.query;
        let client = new faunadb.Client({
            secret: '<INSERT FAUNA DB API SECRET HERE>',
            // Adjust the endpoint if you are using Region Groups
            endpoint: 'https://db.fauna.com/'
        });
        // client
        // 	.query(
        // 		q.Map(
        // 			q.Paginate(q.Match(q.Index('test'), $userEmail)),
        // 			q.Lambda('links', q.Get(q.Var('links')))
        // 		)
        // 	)
        // 	.then((ret) => {
        // 		linksMap = ret.data[0].data.links;
        // 	});

        const newlinkEntry = { short: shortLink, long: newLink };
        linksMap.push(newlinkEntry);
        const upsertResult = await client.query(
            q.Call(
                q.Function('upsert'),
                q.Select(
                    'ref',
                    q.Select(
                        0,
                        q.Map(
                            q.Paginate(q.Match(q.Index('test'), userEmail)),
                            q.Lambda('links', q.Get(q.Var('links')))
                        ),
                        []
                    ),
                    q.Ref(q.Collection('linksMap'), Math.floor(Math.random()*1000000000000000000))
                ),
                {
                    data: {
                        email: userEmail,
                        links: linksMap
                    }
                }
            )
        );

        const globalUpdatePayload = {};

        const newLinkPayload = {};
        newLinkPayload[shortLink] = newLink;

        globalUpdatePayload['data'] = newLinkPayload;

        const globalUpdateResult = await client.query(
            q.Update(
                q.Ref(q.Collection('globalLinksMap'), '354931132207202515'),
                globalUpdatePayload
            )
        );
        goto('/')
    }
    blocking.set(false)
}


export const retrieveLinksMapWithCallback = (email: string, callback : () => any ) => {
    const faunaDB = window.faunadb;

    const q = faunadb.query;
    const client = new faunadb.Client({
        secret: '<INSERT FAUNA DB API SECRET HERE>',
        // Adjust the endpoint if you are using Region Groups
        endpoint: 'https://db.fauna.com/'
    });

    client
        .query(
            q.Map(
                q.Paginate(q.Match(q.Index('test'), email)),
                q.Lambda('links', q.Get(q.Var('links')))
            )
        )
        .then(callback);
}

export const retrieveGlobalLinksMapWithCallback = (callback : (ret : any)=> void) =>{
    const faunaDB = window.faunadb;

    const q = faunadb.query;
    const client = new faunadb.Client({
        secret: '<INSERT FAUNA DB API SECRET HERE>',
        // Adjust the endpoint if you are using Region Groups
        endpoint: 'https://db.fauna.com/'
    });
    
    client.query(q.Get(q.Ref(q.Collection('globalLinksMap'), '354931132207202515'))).then(callback)
}