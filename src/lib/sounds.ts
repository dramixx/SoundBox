export interface Sound {
	id: string;
	label: string;
	file: string;
}

export interface Category {
	id: string;
	label: string;
	sounds: Sound[];
}

export const categories: Category[] = [
	{
		id: 'ig',
		label: 'IG',
		sounds: [
			{ id: 'fermela', label: 'Ferme la', file: '/mp3/fermela.mp3' },
			{ id: 'allezciao', label: 'Allez Ciao', file: '/mp3/allezciao.mp3' },
			{ id: 'ohlavachelesac', label: 'Oh la vache le sac', file: '/mp3/ohlavachelesac.mp3' },
			{ id: 'anick', label: 'Anniiick', file: '/mp3/anick.mp3' },
			{ id: 'mowtdewiwe', label: 'MOWT DE WIWE', file: '/mp3/mowtdewiwe.mp3' },
			{ id: 'navette', label: 'La naveeeette', file: '/mp3/navette.mp3' },
			{ id: 'ilbrume', label: 'Il brûme', file: '/mp3/ilbrume.mp3' },
			{ id: 'ehgaston', label: 'Eh Gaston', file: '/mp3/ehgaston.mp3' },
			{ id: 'monlegrossanglier', label: 'MÔÔÔN le gros sanglier', file: '/mp3/monlegrossanglier.mp3' }
		]
	},
	{
		id: 'eddy',
		label: 'Eddy Malou',
		sounds: [
			{
				id: 'congolexicomatisation',
				label: 'Congolexicomatisation',
				file: '/mp3/congolexicomatisation.mp3'
			},
			{ id: 'eddymalou', label: 'Eddy Malou', file: '/mp3/eddymalou.mp3' },
			{ id: 'maisouicestclair', label: "Mais oui c'est clair", file: '/mp3/maisouicestclair.mp3' }
		]
	},
	{
		id: 'autres',
		label: 'Autres',
		sounds: [
			{ id: 'houloucouptere', label: 'Houloucouptère', file: '/mp3/houloucouptere.mp3' },
			{ id: 'mouyoumed', label: 'Mouyoumed', file: '/mp3/mouyoumed.mp3' },
			{
				id: 'pizzas4chaussures',
				label: 'Pizzas 4 chaussures',
				file: '/mp3/pizzas4chaussures.mp3'
			},
			{ id: 'worstnoiseever', label: 'Worst noise ever', file: '/mp3/worstnoiseever.mp3' },
			{
				id: 'hinhinhintresmarrant',
				label: 'Hinhinhin très marrant',
				file: '/mp3/hinhinhintresmarrant.mp3'
			}
		]
	}
];

export const allSounds: Sound[] = categories.flatMap((c) => c.sounds);
