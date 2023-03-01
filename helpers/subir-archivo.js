import path from "path";
import * as url from 'url';
import { v4 as uuidv4 } from 'uuid';
uuidv4();

// import dirname para path
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

const subirArchivo = (files, extensionesValidas = ["png", "jpg", "jpeg", "gif"], carpeta = '' ) => {
    return new Promise((resolve, reject) => {

        // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
        const { archivo } = files;

        const nombreCortado = archivo.name.split(".");

        const extension = nombreCortado[nombreCortado.length - 1];

        if (!extensionesValidas.includes(extension)) {
            return reject(`La extension ${extension} no esta permitida - ${extensionesValidas}`);
        }

        const nombreTemporal = uuidv4() + "." + extension;

        const uploadPath = path.join(__dirname, "../uploads/", carpeta, nombreTemporal);

        // Use the mv() method to place the file somewhere on your server
        archivo.mv(uploadPath, (err) => {
            if (err) {
                return reject(err)                
            }
            resolve(nombreTemporal);
        });
    });
};

export { subirArchivo };
