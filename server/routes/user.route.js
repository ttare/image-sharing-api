import express from 'express';
import userCtrl from '../controllers/user.controller';
import userValidation from '../validations/user.validation';
import validate from "../middlewares/validation.middleware";

const router = express.Router();

router.post('/create', validate(userValidation.create), userCtrl.create);
router.get('/list', userCtrl.list);
router.get('/:userId', userCtrl.get);

export default router;
