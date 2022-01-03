import nodeResolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';

export default {
	input: 'src/index.ts',
	output: {
		file: 'dist/service-worker.min.js',
		format: 'iife',
	},
	plugins: [
		typescript(),
		nodeResolve(),
	],
};
