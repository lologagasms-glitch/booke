
import { betterAuth } from "better-auth";
import { admin } from "better-auth/plugins/admin";
import nodemailer from "nodemailer"
import { db } from "@/db";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { schema } from "@/db/schema";
import { anonymous } from "better-auth/plugins/anonymous";
export const transporter = nodemailer.createTransport({
  host: 'smtp.zoho.com',
  port: 465,
  secure: true, 
  auth: {
    user: process.env.MAIL_ZOHO_FROM,         
    pass: process.env.PASSWORD_MAIL_APP_ZOHO 
    }
});

export const auth = betterAuth({

  appName: "bookeing",
  database: drizzleAdapter(db, {
    schema:schema,
    provider: "sqlite",
  }),

  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    minPasswordLength: 8,
    maxPasswordLength: 20,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url }) => {
      await transporter.sendMail({
        from: process.env.MAIL_ZOHO_FROM||"",
        to: user.email,
        subject: "Reset Password",
        html: `Click the link to reset your password: ${url}`,
      }, function(error, info) {
        if (error) {
          console.error('Erreur lors de l’envoi :', error);
        } else {
          console.log('Email envoyé : ' + info.response);
        }
      })
    }
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
   
    sendVerificationEmail: async ({ user, url }) => {
      try {
        await transporter.sendMail({
          from: process.env.MAIL_ZOHO_FROM||"",
          to: user.email,
          subject: "Email Verification",
          html: `Click the link to verify your email: ${url}`,
        }, function(error, info) {
        if (error) {
          console.error('Erreur lors de l’envoi :', error);
        } else {
          console.log('Email envoyé : ' + info.response);
        }
      })
      } catch (error) {
        console.log(error);
        throw error
      }
    },
  },
  socialProviders: {
    google: {
      prompt: "select_account", 
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    },
  },
 
 
  plugins: [
    admin({
      adminRoles:["admin"],
      defaultRole:"user",
    }),
    anonymous(),
  ],
});