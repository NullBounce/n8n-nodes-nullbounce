import {
	IAuthenticateGeneric,
	Icon,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class NullBounceApi implements ICredentialType {
	name = 'nullBounceApi';
	displayName = 'NullBounce API';
	documentationUrl = 'https://nullbounce.com/docs/api/';
	icon: Icon = {
		light: 'file:../icons/nullbounce.svg',
		dark: 'file:../icons/nullbounce.dark.svg',
	};

	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			description: 'The API key for Nullbounce authentication',
			required: true,
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '=Token {{$credentials.apiKey}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://app.nullbounce.com/api/v1',
			url: '/balance_changes/current_balance/',
		},
	};
}
