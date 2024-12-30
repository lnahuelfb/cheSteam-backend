import { Router } from 'express';
import Dolar from '../controllers/dolar';
import Games from '../controllers/games';
import Hola from '../controllers/hola';
import Taxes from '../controllers/taxes';

const router = Router();

router.use('/', Hola);
router.use('/dolar', Dolar);
router.use('/games', Games);
router.use('/taxes', Taxes);

export default router;