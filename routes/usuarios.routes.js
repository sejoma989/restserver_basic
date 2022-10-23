import Router from "express";
import { 
    usuariosDelete, 
    usuariosGet, 
    usuariosPatch, 
    usuariosPost, 
    ususariosPut 
} from "../controllers/usuarios.js";

const router = Router();

router.get('/', usuariosGet );
router.post('/', usuariosPost );
router.put('/:id', ususariosPut );
router.patch('/', usuariosPatch );
router.delete('/', usuariosDelete );


export default router;