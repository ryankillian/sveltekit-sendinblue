import client from '@sendinblue/client';
import type { RequestHandler } from '@sveltejs/kit';
import dotenv from 'dotenv';
dotenv.config();

const SENDER_NAME = process.env['SENDER_NAME'];
const SENDER_EMAIL = process.env['SENDER_EMAIL'];

const API_KEY = process.env['API_KEY'];

let api = new client.TransactionalEmailsApi();
api.setApiKey(client.TransactionalEmailsApiApiKeys.apiKey, API_KEY as string);

export const post: RequestHandler = async ({ request }) => {
	const { to } = await request.json();
	const messageId = await sendEmail(to);
	return {
		body: {
			success: messageId ? true : false
		}
	};
};

export async function sendEmail(to: string) {
	let sendSmtpEmail = new client.SendSmtpEmail();

	sendSmtpEmail.subject = 'My first trial';
	sendSmtpEmail.textContent = 'Testing this';
	sendSmtpEmail.htmlContent =
		'<html><body><h1>This is my first transactional email</h1></body></html>';
	sendSmtpEmail.sender = { name: SENDER_NAME, email: SENDER_EMAIL };
	sendSmtpEmail.to = [{ email: to }];

	const result = await api.sendTransacEmail(sendSmtpEmail);

	return result.response?.statusCode === 201 ? true : false;
}
