/* Este código es un servidor web básico que maneja solicitudes HTTPS. Se utiliza la biblioteca de Node.js 'http' para crear el servidor web y 'fs' para leer y escribir archivos.

La constante 'PORT' establece el número del puerto en el que el servidor web escucha. En este caso, el servidor escucha en el puerto 80.

La función 'serveStaticFile' lee el archivo especificado y devuelve una promesa que resuelve en los datos del archivo leído.

La función 'sendResponse' establece los encabezados de respuesta HTTP y envía el contenido de respuesta.

La función 'handleRequest' maneja las solicitudes entrantes. Si el método HTTP es GET, se utiliza una instrucción 'switch' para determinar la ruta solicitada y servir el archivo correspondiente en caso de que la ruta sea válida. Si la ruta no es válida, se envía una respuesta de error al cliente. Si el método HTTP no es GET, se devuelve un error 405 "Método no permitido".

Finalmente, el servidor se crea utilizando la función 'createServer' de la biblioteca 'http' y se establece para escuchar el puerto especificado. */

const http = require('http');
const fs = require('fs');

const PORT = 80;

const serveStaticFile = async (file) => {
  return new Promise((resolve, reject) => {
    fs.readFile(file, function(err, data) {
      if(err) reject(err);
      resolve(data);
    });
  });
} 

const sendResponse = (response, content, contentType) => {
  response.writeHead(200, {"Content-Type": contentType});
  response.end(content);
}

const handleRequest = async (request, response) => {
  const url = request.url;

  if(request.method === "GET"){
    let content;
    let contentType;
    switch(url){
      case "/":
      case "/index.html":
        content = await serveStaticFile("www/index.html");
        contentType = "text/html";
        break;
      case "/script.js":
        content = await serveStaticFile("www/script.js");
        contentType = "text/javascript";
        break;
      case "/style.css":
        content = await serveStaticFile("www/style.css");
        contentType = "text/css";
        break;
      case "/tasklist/update":
        if (request.headers["content-type"] === "application/json") {
          let body = "";
          request.on("data", (chunk) => {
            body += chunk.toString();
          });
          request.on("end", async () => {
            try {
              const tasks = JSON.parse(body);
              fs.writeFile("tasks.json", JSON.stringify(tasks), (err) => {
                if (err) throw err;
                console.log("Tasks updated successfully!");
                sendResponse(response, JSON.stringify({ message: "Tasks updated successfully!" }), "application/json");
              });
            } catch (err) {
              console.log(err);
              sendResponse(response, JSON.stringify({ message: "Error updating tasks!" }), "application/json");
            }
          });
        } else {
          sendResponse(response, JSON.stringify({ message: "Invalid content type!" }), "application/json");
        }
        break;
      default: 
        content = "Ruta no v&aacutelida\r\n";
        contentType = "text/html";
    }

     sendResponse(response, content, contentType);
  } else{
     response.writeHead(405, {"Content-Type": "text/html"});
     response.write(`M&eacutetodo ${request.method} no permitido!\r\n`);
  }
}



const server = http.createServer(handleRequest);
server.listen(PORT);