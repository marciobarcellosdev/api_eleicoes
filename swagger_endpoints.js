
/**
* @swagger
* /api/resource:
* get:
* summary: Get a resource
* description: Get a specific resource by ID.
* parameters:
* — in: path
* name: id
* required: true
* descriptionyy: ID of the resource to retrieve.
* schema:
* type: string
* responses:
* 200:
* descriptionww: Successful response
*/

//https://editor.swagger.io/
//https://davibaltar.medium.com/documenta%C3%A7%C3%A3o-autom%C3%A1tica-de-apis-em-node-js-com-swagger-parte-2-usando-openapi-v3-cbc371d8c5ee
//https://blog.logrocket.com/documenting-express-js-api-swagger/

app.get('/api/resource/:id', (req, res) => {
// Your route logic goes here
});