import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeApiError,
	NodeConnectionTypes,
	NodeOperationError,
	IHttpRequestOptions,
	JsonObject,
} from 'n8n-workflow';

export class NullBounce implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'NullBounce',
		name: 'nullBounce',
		icon: {
			light: 'file:../../icons/nullbounce.svg',
			dark: 'file:../../icons/nullbounce.dark.svg',
		},
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description:
			'Verify and validate email addresses, reduce bounce rates, and check account balance using NullBounce API',
		defaults: {
			name: 'NullBounce',
		},
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		usableAsTool: true,
		credentials: [
			{
				name: 'nullBounceApi',
				required: true,
			},
		],
		properties: [
			// ----------------------------------
			//         RESOURCES
			// ----------------------------------
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Account',
						value: 'account',
					},
					{
						name: 'Email',
						value: 'email',
					},
				],
				default: 'email',
			},

			// ----------------------------------
			//         OPERATIONS
			// ----------------------------------
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['email'],
					},
				},
				options: [
					{
						name: 'Validate',
						value: 'validate',
						description: 'Validate a single email address',
						action: 'Validate an email address',
					},
				],
				default: 'validate',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['account'],
					},
				},
				options: [
					{
						name: 'Get Balance',
						value: 'getBalance',
						description: 'Get current credit balance',
						action: 'Get current balance',
					},
				],
				default: 'getBalance',
			},

			// ----------------------------------
			//         PARAMETERS
			// ----------------------------------
			{
				displayName: 'Email',
				name: 'email',
				type: 'string',
				placeholder: 'name@example.com',
				default: '={{ $json.email }}',
				description: 'The email address you want to validate',
				required: true,
				displayOptions: {
					show: {
						resource: ['email'],
						operation: ['validate'],
					},
				},
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;

		// ======================================================================
		//                         RESOURCE: ACCOUNT
		// ======================================================================
		if (resource === 'account') {
			if (operation === 'getBalance') {
				try {
					const options: IHttpRequestOptions = {
						method: 'GET',
						url: 'https://app.nullbounce.com/api/v1/balance/',
						json: true,
					};

					const responseData = await this.helpers.httpRequestWithAuthentication.call(
						this,
						'nullBounceApi',
						options,
					);

					const json =
						typeof responseData === 'object' && responseData !== null
							? (responseData as JsonObject)
							: { balance: responseData };

					const executionData: INodeExecutionData = {
						json,
						pairedItem: { item: 0 },
					};

					returnData.push(executionData);
					return [returnData];
				} catch (error) {
					throw new NodeApiError(this.getNode(), error as JsonObject);
				}
			}
		}

		// ======================================================================
		//                         RESOURCE: EMAIL
		// ======================================================================
		if (resource === 'email') {
			if (operation === 'validate') {
				for (let i = 0; i < items.length; i++) {
					try {
						const email = this.getNodeParameter('email', i, '') as string;

						if (!email) {
							throw new NodeOperationError(
								this.getNode(),
								'No email provided. Please specify an email address.',
								{ itemIndex: i },
							);
						}

						const options: IHttpRequestOptions = {
							method: 'POST',
							url: 'https://app.nullbounce.com/api/v1/validate/',
							body: {
								email,
							},
							json: true,
						};

						const responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'nullBounceApi',
							options,
						);

						const executionData: INodeExecutionData = {
							json: {
								...items[i].json,
								nullbounce: responseData,
							},
							pairedItem: { item: i },
						};

						returnData.push(executionData);
					} catch (error) {
						if (this.continueOnFail()) {
							const errorMessage =
								error instanceof Error
									? error.message
									: typeof error === 'object' && error !== null && 'message' in error
										? String((error as Record<string, unknown>).message)
										: String(error);
							returnData.push({
								json: {
									...items[i].json,
									error: errorMessage,
								},
								pairedItem: { item: i },
							});
							continue;
						}
						throw new NodeApiError(this.getNode(), error as JsonObject, { itemIndex: i });
					}
				}

				return [returnData];
			}
		}

		return [returnData];
	}
}
