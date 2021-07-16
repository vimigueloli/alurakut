import {SiteClient} from 'datocms-client'
export default async function RecebedorDeRequests(request,response){
    if(request.method === "POST"){
        const TOKEN = "530867b5aa29d87a1258a278016865"
        const client = new SiteClient(TOKEN)
        const registroCriado = await client.items.create({
            itemType: "967968",
            ...request.body
            /*title: 'comunidade',
            imageUrl: 'https://www.github.com/vimigueloli.png',
            creatorSlug: 'vimigueloli',*/
        })
        response.json({
            dados: 'algum dado',
            registroCriado: registroCriado,
        })
        return;
    }
    response.status(404).json({
        message: "nada no GET mas sim no POST "
    })
}