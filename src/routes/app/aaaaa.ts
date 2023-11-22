import { Grant } from 'cosmjs-types/cosmos/authz/v1beta1/authz';

async function handleSubmit() {
	if (true) {
		console.log('Form data:', formData);

		const authorization = {
			typeUrl: ContractExecutionAuthorization.typeUrl as any,
			value: ContractExecutionAuthorization.encode(
				ContractExecutionAuthorization.fromPartial({
					grants: [
						{
							contract: 'osmo1yg8930mj8pk288lmkjex0qz85mj8wgtns5uzwyn2hs25pwdnw42sf745wc',
							filter: {
								typeUrl: AllowAllMessagesFilter.typeUrl,
								value: AllowAllMessagesFilter.encode(
									AllowAllMessagesFilter.fromPartial({})
								).finish()
							},
							limit: {
								typeUrl: MaxFundsLimit.typeUrl,
								value: MaxFundsLimit.encode({
									amounts: [{ amount: '2', denom: 'uosmo' }]
								}).finish()
							}
						}
					]
				})
			).finish()
		};

		const grant = {
			typeUrl: Grant.typeUrl,
			value: authorization.value
		};

		const msg = {
			typeUrl: MsgGrant.typeUrl,
			value: MsgGrant.encode(
				MsgGrant.fromPartial({
					grant: grant,
					grantee: 'osmo1gewl3hfvf8tu4lncmh0rgj564suyqk3cyl8j7f',
					granter: address
				})
			).finish()
		};

		const lol = await client.signAndBroadcast(address, [msg], 1).catch((error) => {
			console.error('Error connecting with signer:', error);
		});
	} else {
		console.log('Please fill in all fields.');
	}
}
