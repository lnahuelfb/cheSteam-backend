import { Router } from 'express';
import Dolar from '../controllers/dolar';
import Games from '../controllers/games';

const router = Router();

router.use('/dolar', Dolar);
router.use('/games', Games);

export default router;