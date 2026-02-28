// ================================================
// Auth Routers
// ================================================


import { Router } from 'express';
import Ctrl from '@/controllers/access/sign.controllers';
import requiredFields from '@/middlewares/requiredfiels.middlewares';
import { requiredFields as fields } from '@/models/access/user.models';
import auth from '@/middlewares/auth.middlewares';


const router = Router();


// register save
router.get(
    '/signup/?token',
    Ctrl.signUp
)

// login
router.post(
    '/signin',
    requiredFields([...fields.login]),
    Ctrl.signIn
)

// 2FA verify
router.post(
    '/2fa/?id',
    Ctrl.verifyTwoFactorAuth
)

// logOut
router.get(
    '/logout',
    auth,
    Ctrl.signOut
)

// forgot password
router.post(
    '/forgot',
    requiredFields([...fields.email]),
    Ctrl.forgotPassword
)

// reset password
router.post(
    '/reset/?token',
    requiredFields(['newPassword, confirmPassword']),
    Ctrl.resetPassword
)

// resend Link
router.post(
    '/resend',
    Ctrl.ResendLink
)


export default router;
