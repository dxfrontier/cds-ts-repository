import type { UserConfig } from '@commitlint/types';
import { RuleConfigSeverity } from '@commitlint/types';

const Configuration: UserConfig = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      RuleConfigSeverity.Error,
      'always',
      ['feat', 'fix', 'doc', 'perf', 'refactor', 'style', 'test', 'chore', 'revert', 'delete'],
    ],
    'scope-enum': [
      RuleConfigSeverity.Error,
      'always',
      [
        'active-entity',
        'draft',
        'types',
        'filter',
        'builder',
        // config: Changes to prettier, lint, github actions, husky, lint-staged ...
        'config',
        // Changes that affect the build system or external dependencies.
        'build',
        // docs: Changes to documentation.
        'docs',
        // deps: Updates to dependencies.
        'deps',
        // unit: Updates to the unit tests
        'tests',
      ],
    ],
    'scope-empty': [RuleConfigSeverity.Error, 'never'],
    'subject-empty': [RuleConfigSeverity.Error, 'never'],
  },
  helpUrl: 'https://github.com/conventional-changelog/commitlint/#what-is-commitlint',
};

export default Configuration;
