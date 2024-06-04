export type Profiler = {
  NAME: string;
  FRAMEWORK: string | undefined;
  SAFE_NAME: string;
  LANGUAGE: 'TypeScript' | 'JavaScript';
  LANGEXT: 'js' | 'ts';
  PORT?: number;
  CSS_EXTENSION?: 'css' | 'scss' | 'less';
  CSS?: 'Tailwind' | 'Empty CSS';
  CONTAINER?: string;
  BUNDLER?: 'Webpack' | 'Rspack';
};

export type Project = {
  framework?: string;
  language?: 'javascript' | 'typescript';
  css?: 'CSS' | 'Tailwind';
  port?: number;
  name: string;
  type: 'Application' | 'Library' | 'API Server';
  bundler?: 'Webpack' | 'Rspack';
};
