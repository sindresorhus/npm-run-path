export interface RunPathOptions {
	/**
	 * Working directory.
	 *
	 * @default process.cwd()
	 */
	readonly cwd?: string;

	/**
	 * PATH to be appended. Default: [`PATH`](https://github.com/sindresorhus/path-key).
	 *
	 * Set it to an empty string to exclude the default PATH.
	 */
	readonly path?: string;
}

export interface ProcessEnv {
	[key: string]: string | undefined;
}

export interface EnvOptions {
	/**
	 * Working directory.
	 *
	 * @default process.cwd()
	 */
	readonly cwd?: string;

	/**
	 * Accepts an object of environment variables, like `process.env`, and modifies the PATH using the correct [PATH key](https://github.com/sindresorhus/path-key). Use this if you're modifying the PATH for use in the `child_process` options.
	 */
	readonly env?: ProcessEnv;
}

/**
 * Get your [PATH](https://en.wikipedia.org/wiki/PATH_(variable)) prepended with locally installed binaries.
 */
declare const npmRunPath: {
	/**
	 * Get your [PATH](https://en.wikipedia.org/wiki/PATH_(variable)) prepended with locally installed binaries.
	 *
	 * @returns The augmented path string.
	 */
	(options?: RunPathOptions): string;

	/**
	 * @returns The augmented [`process.env`](https://nodejs.org/api/process.html#process_process_env) object.
	 */
	env(options?: EnvOptions): ProcessEnv;
};

export default npmRunPath;
