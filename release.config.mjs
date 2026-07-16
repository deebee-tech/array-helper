export default {
  branches: [
    'main',
    {
      name: 'beta',
      prerelease: true,
    },
    {
      name: 'alpha',
      prerelease: true,
    },
    {
      name: 'next',
      prerelease: true,
    },
  ],
  plugins: [
    [
      '@semantic-release/commit-analyzer',
      {
        // Default Angular parser rejects `feat!:`; conventionalcommits supports it.
        preset: 'conventionalcommits',
      },
    ],
    [
      '@semantic-release/release-notes-generator',
      {
        preset: 'conventionalcommits',
      },
    ],
    [
      '@semantic-release/changelog',
      {
        changelogFile: 'CHANGELOG.md',
      },
    ],
    [
      '@semantic-release/changelog',
      {
        changelogFile: './dist/CHANGELOG.md',
      },
    ],
    [
      'semantic-release-replace-plugin',
      {
        replacements: [
          {
            files: ['./dist/package.json'],
            from: 'dist/index',
            to: 'index',
            results: [
              {
                file: './dist/package.json',
                hasChanged: true,
                // Must equal the `dist/index` count in package.json (main + types + the
                // four nested exports conditions). The plugin asserts it and fails the
                // release on a mismatch, so it changes whenever the exports map does.
                numMatches: 6,
                numReplacements: 6,
              },
            ],
            countMatches: true,
          },
        ],
      },
    ],
    [
      'semantic-release-replace-plugin',
      {
        replacements: [
          {
            files: ['jsr.json'],
            from: '"version": ".*"',
            to: '"version": "${nextRelease.version}"',
            results: [
              {
                file: 'jsr.json',
                hasChanged: true,
                numMatches: 1,
                numReplacements: 1,
              },
            ],
            countMatches: true,
          },
        ],
      },
    ],
    [
      '@semantic-release/npm',
      {
        pkgRoot: 'dist',
      },
    ],
    [
      '@semantic-release/npm',
      {
        npmPublish: false,
      },
    ],
    [
      '@semantic-release/git',
      {
        assets: ['CHANGELOG.md', 'package.json', 'jsr.json', 'dist/**/*', 'coverage/**/*'],
      },
    ],
    // Registries BEFORE the GitHub release: on SQLEasy's 2.0.0 the GitHub plugin crashed uploading
    // release assets ("invalid content-length header" from octokit/undici) and, because JSR was
    // listed after it, JSR never published at all. npm/JSR are the product; the GitHub release is
    // cosmetic, so it goes last where its failure can't strand a registry.
    '@sebbo2002/semantic-release-jsr',
    // No `assets` here: that upload is exactly what crashed, and the built files already ship via
    // npm and JSR. The GitHub release still gets its generated notes.
    '@semantic-release/github',
  ],
};
