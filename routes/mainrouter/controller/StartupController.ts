const mysql = require("mysql");
const mysql2 = require("mysql2");
const cors = require("cors");
const { Resend } = require("resend");
require("dotenv").config();

const resend = new Resend(process.env.MAIL_RESEND_API_KEY);
const connection = getOneTimeConnection();
const transporter = getOneTimeTransporterData();

export function getConnection() {
    return connection;
}

export function getTransporterData() {
    return transporter;
}

export function getConnectionForDbCreation() {
  return connection;
}

function getOneTimeConnection() {
    return mysql2.createPool({
      connectionLimit: process.env.DB_LOCAL_CON_LIMMIT,
      port: process.env.DB_LOCAL_PORT,
      host: process.env.DB_LOCAL_HOST,
      user: process.env.DB_LOCAL_USER,
      password: process.env.DB_LOCAL_PASSWORD,
      database: process.env.DB_LOCAL_DBNAME,
      waitForConnections: true,
      queueLimit: 0,
    });
}

export function getOneTimeTransporterData() {
  return {
    sendMail: async (mailOptions: {
      from?: string;
      to: string | string[];
      subject?: string;
      text?: string;
      html?: string;
    }, callback?: (error: any, info?: any) => void
    ) => {
      try {
        const response = await resend.emails.send({
          from: "onboarding@resend.dev",
          // to: Array.isArray(mailOptions.to) ? mailOptions.to.join(", ") : mailOptions.to,
          to: "gamingsanth@gmail.com",
          subject: mailOptions.subject || "",
          text: mailOptions.text,
          html: mailOptions.html,
        });
        if(callback) {  
            callback(null, response);
        }
        return response;
      } catch (err) {
        console.error("Resend API sendMail error:", err);
        if(callback) {  
            callback(err, null);
        }
        throw err;
      }
    },
  };
}

export function useCors() {
  return cors({
    origin: [process.env.CLIENT_BASE_URL, process.env.CHAT_BASE_URL],
    methods: ["GET", "POST"],
    credentials: false,
    exposedHeaders: [
      process.env.AUTH_NAME,
      process.env.NEW_USER_AUTH_KEY,
      process.env.FORGOT_PASS_CHANGE_AUTH,
    ],
  });
}

module.exports = {
  getConnection,
  getConnectionForDbCreation,
  getTransporterData,
  useCors,
};
