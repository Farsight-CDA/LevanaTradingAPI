export interface Contract {
	name: string;
	address: string;
}

export async function getContracts(): Promise<Contract[]> {
	return await [
		{
			name: 'Levana Perps Market - ATOM_USD	',
			address: 'osmo1hd7r733w49wrqnxx3daz4gy7kvdhgwsjwn28wj7msjfk4tde89aqjqhu8x'
		},
		{
			name: 'Levana Perps Market - ATOM_USD	',
			address: 'osmo1hd7r733w49wrqnxx3daz4gy7kvdhgwsjwn28wj7msjfk4tde89aqjqhu8x'
		}
	];
}

export const keys = [
	'cancel_limit_order',
	'claim_yield',
	'close_all_positions',
	'close_position',
	'collect_unstaked_lp',
	'crank',
	'deposit_liquidity',
	'liquidity_token_proxy',
	'nft_proxy',
	'open_position',
	'owner',
	'place_limit_order',
	'provide_crank_funds',
	'receive',
	'reinvest_yield',
	'set_manual_price',
	'set_trigger_order',
	'stake_lp',
	'stop_unstaking_xlp',
	'transfer_dao_fees',
	'unstake_xlp',
	'update_position_add_collateral_impact_leverage',
	'update_position_add_collateral_impact_size',
	'update_position_leverage',
	'update_position_max_gains',
	'update_position_remove_collateral_impact_leverage',
	'update_position_remove_collateral_impact_size',
	'withdraw_liquidity'
];
