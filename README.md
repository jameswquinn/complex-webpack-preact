# Preact Webpack App

This project is a Preact application configured with Webpack. It includes setup for CSS handling, image optimization, PWA support, and other modern web development features.

## Features

- **Preact**: A fast 3kB alternative to React with the same modern API.
- **Webpack**: For bundling JavaScript, CSS, and assets.
- **CSS Handling**: Extracts CSS into separate files and minifies them.
- **Image Optimization**: Converts images to WebP format and optimizes them.
- **PWA Support**: Configures service workers with `workbox-webpack-plugin`.
- **Favicons**: Generates favicons from a source image.
- **Compression**: Compresses assets to improve load times.
- **TypeScript**: Type checking with `fork-ts-checker-webpack-plugin` (if using TypeScript).
- **Bundle Analysis**: Analyzes bundle size with `webpack-bundle-analyzer`.
- **Development Server**: Configured for live reloading and compatibility with CodeSandbox.

## Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/your-username/preact-webpack-app.git
    ```
2. Navigate to the project directory:
    ```bash
    cd preact-webpack-app
    ```
3. Install the dependencies:
    ```bash
    npm install
    ```

## Scripts

- **Start Development Server**:
    ```bash
    npm start
    ```
    This will start Webpack DevServer on `http://localhost:3000`.

- **Build for Production**:
    ```bash
    npm run build
    ```
    This will create a production-ready build in the `dist` directory.

- **Lint Code**:
    ```bash
    npm run lint
    ```

- **Format Code**:
    ```bash
    npm run prettier
    ```

## Configuration

The project is configured to work with both development and production environments. Adjustments can be made in the `webpack.config.js` file to suit your needs.

For more information on Webpack and Preact, refer to their [documentation](https://webpack.js.org/) and [Preact documentation](https://preactjs.com/).

## Contributing

We welcome contributions to this project. Please see our [CONTRIBUTING.md](CONTRIBUTING.md) for more details on how to get involved.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
