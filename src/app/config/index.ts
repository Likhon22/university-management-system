import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

export default {
  port: process.env.PORT,
  database_url: process.env.DB_URL,
  bcrypt_salt_round: process.env.BCRYPT_SALT_ROUND,
  default_password: process.env.DEFAULT_PASSWORD,
  node_env: process.env.NODE_ENV,
  jwt_access_secret: process.env.JWT_ACCESS_SECRET,
  jwt_refresh_secret: process.env.JWT_REFRESH_SECRET,
  jwt_access_token_duration: process.env.JWT_ACCESS_TOKEN_DURATION,
  jwt_refresh_token_duration: process.env.JWT_REFRESH_TOKEN_DURATION,
  reset_password_ui_link: process.env.RESET_PASSWORD_UI_LINK,
  smtp_email_pass: process.env.EMAIL_SMTP_PASSWORD,
};
