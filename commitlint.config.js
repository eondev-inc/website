module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat', // Nueva característica
        'fix', // Corrección de bug
        'docs', // Documentación
        'style', // Formateo, puntos y comas faltantes, etc
        'refactor', // Refactorización
        'perf', // Mejoras de rendimiento
        'test', // Añadir tests
        'build', // Cambios en el sistema de build
        'ci', // Cambios en CI
        'chore', // Cambios de mantenimiento
        'revert' // Revertir un commit anterior
      ]
    ],
    'type-case': [2, 'always', 'lower-case'],
    'type-empty': [2, 'never'],
    'scope-case': [2, 'always', 'lower-case'],
    'subject-empty': [2, 'never'],
    'subject-full-stop': [2, 'never', '.'],
    'header-max-length': [2, 'always', 100],
    'body-leading-blank': [1, 'always'],
    'body-max-line-length': [2, 'always', 100],
    'footer-leading-blank': [1, 'always'],
    'footer-max-line-length': [2, 'always', 100]
  }
}
