// =============================
// User Routers
// =============================

import { Router } from 'express';
import Ctrl from '@/controllers/access/user.controllers';
import requiredFields from '@/middlewares/requiredfiels.middlewares';
import { requiredFields as fields, UserValidation } from '@/models/access/user.models';
import validate from '@/middlewares/validators.middlewares';
import auth from '@/middlewares/auth.middlewares';
import permissions from '@/middlewares/permission.middlewares';


const router = Router();


// staff register
router.post(
    '/admin/sign',
    auth,
    permissions(['user.create']),
    requiredFields([...fields.create]),
    validate(UserValidation.create),
    Ctrl.sign
)

// all users
router.get(
    '/users',
    auth,
    permissions(['user.all']),
    Ctrl.getAllUsers
)

// get user
router.get(
    '/users/?id',
    auth,
    permissions(['user.get']),
    Ctrl.getUserById
)

// risk update user
router.put(
    '/admin/?id',
    auth,
    permissions(['user.update']),
    requiredFields([...fields.risk]),
    validate(UserValidation.update),
    Ctrl.updateUser
)

// update me
router.put(
    '/users/?id',
    auth,
    validate(UserValidation.update),
    Ctrl.updateUser
)

// delete my account
router.get()