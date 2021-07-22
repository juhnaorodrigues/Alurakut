import { SiteClient } from 'datocms-client'

export default async function RespostaServidor (request, response) {
    
    if (request.method === 'POST') {
        const TOKEN = '780565f66c079dd4fef241d9020ba6';
        const client = new SiteClient(TOKEN);
        console.log(TOKEN);
        
        request.json

        const registroCriado = await client.items.create({
            itemType: "976510",
            ... request.body    
        });
        
        console.log(registroCriado);
        
        response.json({
            teste:"juhnao teste",
            registroCriado: registroCriado
        })
        return;
    }

}