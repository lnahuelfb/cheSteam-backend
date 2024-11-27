import { Router } from 'express';
import Dolar from '../controllers/dolar';
import Games from '../controllers/games';
import Hola from '../controllers/hola';

const router = Router();

router.use('/dolar', Dolar);
router.use('/games', Games);
router.use('/hola', Hola);

export default router;