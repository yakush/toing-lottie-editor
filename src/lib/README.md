# lottie plugin integration

## Demo

https://yakush.github.io/toing-lottie-editor/#/demo

you can use the json files found in the `"/demo json files"` folder to play around

## Installation

All files are available in the `/CODE` folder

1. Install npm dependencies:  
   `npm i zustand events gif.js lottie-web @lottiefiles/react-lottie-player`

2. Install additional npm dependencies (for typescript) :  
   `npm i typescript @types/jest @types/node @types/react @types/react-dom @types/gif.js @types/uuid`

3. Copy the library files:  
   copy `CODE\lib` folder  
   into `/src` folder of the project

4. The _gif.js_ library requires public javascript files for background workers.  
   copy `gif.worker.js` and `gif.worker.js.map`  
   into `/public` folder of the project

5. Add typescript config file:  
   copy `tsconfig.json`  
   into `/` folder of the project

6. Add demo page:  
   copy `DemoPageJS.jsx` and `DemoPageJS.module.css`  
   into `/pages` folder of the project

7. Now everything **_should_** compile...

## Usage

Everything can be imported from the library root:

```javascript
import {
  ToingBuilder,
  ToingDebug,
  ToingDisplay,
  ToingEditor,
  createGif,
} from "../lib/lottie";
```

### components:

- `<ToingDisplay/>`  
  Displays a Toing to the user (looping, no controls)

  ```javascript
  /** toing data. src can be a url or json object */
  toingData?: {
    src: string | Lottie;
    config?: ToingConfig;
    execution?: ToingUserExecutions;
    campaign?: ToingCampaign;
  };
  ```

- `<ToingEditor/>`  
   Allows the user to edit the Toing  
   (generating an `execution` json)

  ```javascript
  /** fired when user exports the new execution*/
  onExportExecution?: (execution: ToingUserExecutions) => void;

  /** toing data. src can be a url or json object */
  toingData?: {
    src: string | Lottie;
    config?: ToingConfig;
    execution?: ToingUserExecutions;
    campaign?: ToingCampaign;
  };
  ```

- `<ToingBuilder/>`
  For admin. Builder for the Toing config  
   (generating an `config` json)

  ```javascript
  /** fired when user exports the new config*/
  onExportConfig?: (config: ToingConfig) => void;

  /** toing data. src can be a url or json object */
  toingData?: {
    src: string | Lottie;
    config?: ToingConfig;
    execution?: ToingUserExecutions;
    campaign?: ToingCampaign;
  };
  ```

- `<ToingDebug/>`
  ```javascript
  /** toing data. src can be a url or json object */
  toingData?: {
    src: string | Lottie;
    config?: ToingConfig;
    execution?: ToingUserExecutions;
    campaign?: ToingCampaign;
  };
  ```

### functions:

```javascript
async function createGif(params: CreateGifParams): Promise<Blob>

/** returns a Blob containing the gif file data
 * or rejects on error **/

params:
{
    /** url or lottie json object */
    src: string | Lottie;

    /** toing config */
    config?: ToingConfig;
    /** toing execution */
    execution?: ToingUserExecutions;
    /** toing campaign */
    campaign?: ToingCampaign;

    /** output width (you can specify only 1 dimension to keep aspect ratio )*/
    width?: number;
    /** output height (you can specify only 1 dimension to keep aspect ratio )*/
    height?: number;

    /** lower is better and slower (default is ~5)*/
    quality?: number;

    /** will be called with render progress (0 to 1) */
    progressCallback?: (progress: number) => void;
}

```

### Campaign json format:

```javascript
interface ToingCampaign {
  /** url to overlay logo */
  logoUrl?: string;

  /** campaign color schema colors in hex (ie. #1f5a3f) */
  colors?: {
    primary?: string,
    secondary?: string,
    // ...
  };

  /** campaign texts */
  texts?: {
    title?: {
      text: string,
      color: string,
    },
    subtitle?: {
      text: string,
      color: string,
    },
  };
}
```
