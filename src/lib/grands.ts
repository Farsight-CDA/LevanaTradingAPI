import type { SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import type { StdFee } from '@keplr-wallet/types';
import { GenericAuthorization, Grant } from 'cosmjs-types/cosmos/authz/v1beta1/authz';
import { MsgGrant } from 'cosmjs-types/cosmos/authz/v1beta1/tx';
import {
	AcceptedMessageKeysFilter,
	ContractExecutionAuthorization,
	MaxFundsLimit
} from 'cosmjs-types/cosmwasm/wasm/v1/authz';

export async function grantGenericAuthorization(
	client: SigningCosmWasmClient,
	granter: string,
	grantee: string,
	expirationSeconds: number
) {
	if (granter === grantee) {
		throw new Error('granter and grantee are the same');
	}

	if (expirationSeconds < Date.now() / 100) {
		throw new Error('expiration is in the past');
	}

	const genauth = GenericAuthorization.encode(
		GenericAuthorization.fromPartial({
			msg: '/osmosis.concentratedliquidity.v1beta1.MsgWithdrawPosition'
		})
	).finish();

	const msgGrant = MsgGrant.fromPartial({
		grant: {
			authorization: {
				typeUrl: '/cosmos.authz.v1beta1.GenericAuthorization',
				value: genauth
			},

			expiration: { seconds: expirationSeconds }
		},
		grantee: grantee,
		granter: granter
	});
	const msg = {
		typeUrl: '/cosmos.authz.v1beta1.MsgGrant',
		value: msgGrant
	};

	await client.signAndBroadcast(granter, [msg], 1);
}

export async function grantContractAuthorization(
	client: SigningCosmWasmClient,
	granter: string,
	grantee: string,
	expirationDate: Date | null,
	contractAddress: string,
	acceptedMessageKeys: string[],
	volume: number
) {
	if (granter === grantee) {
		throw new Error('granter and grantee are the same');
	}

	if (expirationDate !== null && expirationDate.getTime() < Date.now()) {
		throw new Error('expiration is in the past');
	}

	const contractExecutionAuthorization = {
		typeUrl: '/cosmwasm.wasm.v1.ContractExecutionAuthorization',
		value: ContractExecutionAuthorization.encode(
			ContractExecutionAuthorization.fromPartial({
				grants: [
					{
						contract: contractAddress,
						filter: {
							typeUrl: '/cosmwasm.wasm.v1.AcceptedMessageKeysFilter',
							value: AcceptedMessageKeysFilter.encode({ keys: acceptedMessageKeys }).finish()
						},
						limit: {
							typeUrl: '/cosmwasm.wasm.v1.MaxFundsLimit',
							value: MaxFundsLimit.encode({
								amounts: [{ amount: volume.toString(), denom: 'uosmo' }]
							}).finish()
						}
					}
				]
			})
		).finish()
	};

	const msgGrant = MsgGrant.fromPartial({
		grant: {
			authorization: contractExecutionAuthorization,
			expiration: {
				seconds: expirationDate == undefined ? Date.now() / 100 : expirationDate.getTime() / 1000
			}
		},
		grantee: grantee,
		granter: granter
	});
	const msg = {
		typeUrl: '/cosmos.authz.v1beta1.MsgGrant',
		value: msgGrant
	};
	const nr = (await client.simulate(granter, [msg], '')) + 60000;
	console.log(nr);

	const lol: StdFee = { gas: nr.toString(), amount: [{ amount: '400', denom: 'uosmo' }] };
	await client.signAndBroadcast(granter, [msg], lol);
}
