interface RegisterRespones {
	response: Object | undefined;
}

export async function fetchContracts(): Promise<string> {
	return '';
}

export async function postRegister(
	user: string,
	email: string,
	password: string
): Promise<RegisterRespones> {
	return { response: 'mock' };
}
export async function fetchLogin(email: string, password: string): Promise<RegisterRespones> {
	if (email === 'error') {
		return { response: undefined };
	}
	if (email === 'false') {
		return { response: false };
	}

	return { response: 'mock' };
}
