# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Planned
- **`@mini-webpack/parser`**: 支持 `ImportDefaultSpecifier`（默认导入）与 `Export` 语句的 AST 收集。
- **`@mini-webpack/transformer`**: 集成 `@babel/traverse` 和 `@babel/generator`，实现 AST 级别的 `import` 到 `__webpack_require__` 替换。
- **`@mini-webpack/runtime`**: 编写 IIFE 自执行函数的加载器模板与缓存机制。
- **`@mini-webpack/compiler`**: 串联各个子包，提供完整的打包器入口类与构建命令。

---

## [0.1.0-alpha.0] - 2026-08-29

### Added
- **Monorepo 架构初始化**：
  - 基于 `pnpm workspace` 与 TypeScript 配置多包协同开发环境。
  - 规划并创建 `types`, `parser`, `resolver`, `module`, `graph`, `transformer`, `generator`, `runtime`, `compiler` 九大核心子包。
- **核心模块与算法实现**：
  - **`@mini-webpack/types`**: 定义基础的 AST 类型体系（`Program`, `ImportDeclaration`, `ImportSpecifier`）。
  - **`@mini-webpack/parser`**: 基于 `@babel/parser` 提取 ES 模块中的 `ImportDeclaration`。
  - **`@mini-webpack/resolver`**: 实现基础的路径寻址转换。
  - **`@mini-webpack/module`**: 封装模块元数据结构，自动提取并挂载依赖信息。
  - **`@mini-webpack/graph`**:
    - 实现基于 BFS 队列的依赖图构建器（`buildModuleGraph`）。
    - 实现基于 DFS 与状态染色回溯的循环依赖检测算法（`detectCycles`）。
  - **`@mini-webpack/generator`**: 实现将模块集合包装为闭包字典格式的初步生成逻辑。
- **测试示例**：
  - 在 `examples/basic` 中引入基础模块相互引用与循环引用测试用例。
