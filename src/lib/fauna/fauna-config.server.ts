import { building } from '$app/environment';
import * as fauna from 'faunadb'

export let faunaClient : fauna.Client = null
export const q = fauna;

if(!building){
    faunaClient= new fauna.Client({
        secret:'<INSERT YOUR FAUNA API KEY HERE>',
        endpoint: 'https://db.fauna.com/'
    });

}

