import axios from 'axios';
import { AUTH_SERVER_URL } from "../config";

const CLLogin = (username, password) => {

	const formData = new FormData();
	formData.append('grant_type', 'password');
	formData.append('username', username);
	formData.append('password', password);

	return axios({
		method: 'post',
		url: AUTH_SERVER_URL,
		headers: {
			Authorization: 'Basic dHJ1Y2FkZW5jZTpmRHc3TXBrazVjekhOdVNSdG1oR21BR0w0MkNheFFCOQ=='
		},
		data: formData
	});
}

export default CLLogin;