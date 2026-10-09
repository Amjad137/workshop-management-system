import { Express } from 'express';

interface IRouteLayer {
  route?: {
    path?: string | string[];
    methods?: Record<string, boolean>;
  };
  name?: string;
  handle?: {
    stack?: IRouteLayer[];
  };
  regexp?: RegExp & {
    fast_slash?: boolean;
    fast_star?: boolean;
  };
  keys?: Array<{ name: string | number }>;
}

export interface IRouteDefinition {
  method: string;
  path: string;
  note?: string;
}

export interface IPrintRoutesOptions {
  /** If true, hides the /v1/auth/* wildcard catch-all route */
  excludeAuth?: boolean;
}

const STANDARD_HTTP_METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD'];

const cleanLayerPrefix = (layer: IRouteLayer): string => {
  if (layer.route?.path) {
    if (typeof layer.route.path === 'string') {
      return layer.route.path;
    }
    if (Array.isArray(layer.route.path)) {
      return layer.route.path.join(', ');
    }
  }

  if (layer.regexp) {
    if (layer.regexp.fast_slash) {
      return '';
    }
    if (layer.regexp.fast_star) {
      return '*';
    }

    let source = layer.regexp.source;

    // Normalize source regex string from Express path-to-regexp
    source = source
      .replace(/^\\\^/, '')
      .replace(/^\^/, '')
      .replace(/\\\/\?\(\?=\\\/\|\$\)$/, '')
      .replace(/\/\?\(\?=\/\|\$\)$/, '')
      .replace(/\$\/?$/, '')
      .replace(/\\\//g, '/');

    // Replace parameter patterns
    if (layer.keys && layer.keys.length > 0) {
      let keyIdx = 0;
      source = source.replace(/\(\?:\[\^\\\/\]\+\?\)/g, () => {
        const key = layer.keys?.[keyIdx++];
        return key ? `:${String(key.name)}` : ':param';
      });
    }

    if (source && !source.startsWith('/') && !source.startsWith('*')) {
      source = `/${source}`;
    }

    return source;
  }

  return '';
};

export const getMountedRoutes = (stack: IRouteLayer[], prefix = ''): IRouteDefinition[] => {
  const routes: IRouteDefinition[] = [];

  for (const layer of stack) {
    if (layer.route && layer.route.methods) {
      const routePath = cleanLayerPrefix(layer);
      let fullPath = `${prefix}${routePath}`;
      fullPath = fullPath.replace(/\/+/g, '/');
      if (fullPath.length > 1 && fullPath.endsWith('/')) {
        fullPath = fullPath.slice(0, -1);
      }

      const activeMethods = Object.keys(layer.route.methods)
        .filter((m) => layer.route?.methods?.[m])
        .map((m) => m.toUpperCase());

      // If registered with app.all() / router.all(), Express internally registers all 35+ HTTP methods
      // (GET, POST, ACL, BIND, CHECKOUT, MKCOL, PROPFIND, etc.).
      // Collapse all 35 methods into a single clean 'ALL' entry instead of printing 35 lines.
      const isAllMethods =
        layer.route.methods._all === true ||
        activeMethods.length >= 10 ||
        (activeMethods.includes('GET') &&
          activeMethods.includes('POST') &&
          activeMethods.includes('PUT') &&
          activeMethods.includes('DELETE') &&
          activeMethods.includes('PATCH'));

      if (isAllMethods) {
        routes.push({
          method: 'ALL',
          path: fullPath || '/',
          note: fullPath.includes('auth') ? 'Better Auth Engine' : undefined
        });
      } else {
        const methodsToInclude = activeMethods.filter((m) => STANDARD_HTTP_METHODS.includes(m));
        for (const method of methodsToInclude.length > 0 ? methodsToInclude : activeMethods) {
          routes.push({
            method,
            path: fullPath || '/'
          });
        }
      }
    } else if (layer.name === 'router' && layer.handle?.stack) {
      const subPrefix = cleanLayerPrefix(layer);
      const subRoutes = getMountedRoutes(layer.handle.stack, `${prefix}${subPrefix}`);
      routes.push(...subRoutes);
    }
  }

  return routes;
};

const METHOD_COLORS: Record<string, string> = {
  GET: '\x1b[32m',     // Green
  POST: '\x1b[33m',    // Yellow
  PUT: '\x1b[34m',     // Blue
  PATCH: '\x1b[35m',   // Magenta
  DELETE: '\x1b[31m',  // Red
  ALL: '\x1b[36m'      // Cyan
};

const RESET_COLOR = '\x1b[0m';
const BOLD = '\x1b[1m';
const DIM = '\x1b[2m';

export const printRoutes = (app: Express, options: IPrintRoutesOptions = {}): void => {
  const router = (app as unknown as { _router?: { stack?: IRouteLayer[] } })._router;
  if (!router?.stack) {
    return;
  }

  let routes = getMountedRoutes(router.stack);
  if (routes.length === 0) {
    return;
  }

  // De-duplicate if exact same method and path
  routes = routes.filter(
    (route, index, self) =>
      index === self.findIndex((r) => r.method === route.method && r.path === route.path)
  );

  // Filter out auth routes if option enabled
  if (options.excludeAuth) {
    routes = routes.filter((r) => !r.path.includes('/v1/auth'));
  }

  const title = '📍 Mounted Routes';
  const divider = '─'.repeat(55);

  process.stdout.write(`\n${BOLD}${title}${RESET_COLOR}\n${DIM}${divider}${RESET_COLOR}\n`);

  for (const { method, path, note } of routes) {
    const color = METHOD_COLORS[method] || '\x1b[37m';
    const paddedMethod = `[${method}]`.padEnd(8, ' ');
    const noteText = note ? `  ${DIM}(${note})${RESET_COLOR}` : '';
    process.stdout.write(`  ${color}${BOLD}${paddedMethod}${RESET_COLOR}  ${path}${noteText}\n`);
  }

  process.stdout.write(`${DIM}${divider}${RESET_COLOR}\n  Total endpoints: ${routes.length}\n\n`);
};
