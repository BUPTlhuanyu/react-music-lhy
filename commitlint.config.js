const types = [
    'build', // 修改项目的的构建系统（xcodebuild、webpack、glup等）的提交
    'ci', // 修改项目的持续集成流程（Kenkins、Travis等）的提交
    'chore', // 构建过程或辅助工具的变化
    'docs', // 文档提交（documents）
    'feat', // 新增功能（feature）
    'fix', // 修复 bug
    'pref', // 性能、体验相关的提交
    'refactor', // 代码重构
    'revert', // 回滚某个更早的提交
    'style', // 不影响程序逻辑的代码修改、主要是样式方面的优化、修改
    'test' // 测试相关的开发
  ]
  
  // 规则参考格式为 feat: 功能说明
  const typeEnum = {
    rules: {
      'type-enum': [2, 'always', types]
    },
    value: () => types
  }
  
  module.exports = {
    extends: [
      '@commitlint/config-conventional'
    ],
    rules: {
      'type-case': [0],
      'type-empty': [0],
      'scope-empty': [0],
      'scope-case': [0],
      'subject-full-stop': [0, 'never'],
      'subject-case': [0, 'never'],
      'header-max-length': [0, 'always', 72],
      'type-enum': typeEnum.rules['type-enum']
    }
  }