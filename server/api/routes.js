const createHmac = require('create-hmac')
const config = require('../../config')
const resizeOptions = require('./options/resize')
const enlargeOptions = require('./options/enlarge')
const extensionOptions = require('./options/extension')

module.exports.setup = function(app) {
  /**
   * @swagger
   * tags:
   *   name: URL
   */

  /**
   * @swagger
   * definitions:
   *   ApiResponse:
   *     type: object
   *     properties:
   *       data:
   *         type: array
   *         items:
   *           type: object
   *           properties:
   *             source_url:
   *               type: string
   *             imgproxy_url:
   *               type: string
   *   ApiError:
   *     type: object
   *     properties:
   *       error:
   *         type: string
   */

  /**
   * @swagger
   * /url:
   *   post:
   *     description: |
   *        **Get imgproxy URL**
   *
   *        This endpoint can consume the parameters in `application/x-www-form-urlencoded` or `application/json`.
   *
   *        For example, this request:
   *        ```
   *        curl --location --request POST 'http://localhost:3000/api/url/' \
   *        --header 'Content-Type: application/x-www-form-urlencoded' \
   *        --data-urlencode 'source_url=https://test.com/image.jpg' \
   *        --data-urlencode 'source_url=https://test.com/image2.jpg' \
   *        --data-urlencode 'width=600' \
   *        --data-urlencode 'height=300'
   *        ```
   *
   *        is exactly the same as this one:
   *        ```
   *        curl --location --request POST 'http://localhost:3000/api/url/' \
   *        --header 'Content-Type: application/json' \
   *        --data-raw '{
   *            "source_url": ["https://test.com/image.jpg", "https://test.com/image2.jpg"],
   *            "width": 600,
   *            "height": 300
   *        }'
   *        ```
   *     tags: [URL]
   *     consumes:
   *       - application/x-www-form-urlencoded
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: source_url
   *         in: formData
   *         description: Image source url. You can send multiple urls in one request.
   *         required: true
   *         type: array
   *         collectionFormat: multi
   *         items:
   *           type: "string"
   *       - name: resizing_type
   *         in: formData
   *         description: |
   *            Defines how imgproxy will resize the source image. Supported resizing types are:
   *            - `fit`: resizes the image while keeping aspect ratio to fit given size;
   *            - `fill`: resizes the image while keeping aspect ratio to fill given size and cropping projecting parts;
   *            - `auto`: if both source and resulting dimensions have the same orientation (portrait or landscape), imgproxy will use fill. Otherwise, it will use fit.
   *
   *            **Default:** `fit`
   *         type: string
   *         enum:
   *         - "fit"
   *         - "fill"
   *         - "auto"
   *       - name: width
   *         in: formData
   *         description: |
   *            Defines the width of the resulting image. When set to `0`, imgproxy will calculate the resulting width using the defined height and source aspect ratio.
   *
   *            **Default:** `0`
   *         type: integer
   *         minimum: 0
   *       - name: height
   *         in: formData
   *         description: |
   *            Defines the height of the resulting image. When set to `0`, imgproxy will calculate resulting height using the defined width and source aspect ratio.
   *
   *            **Default:** `0`
   *         type: integer
   *         minimum: 0
   *       - name: dpr
   *         in: formData
   *         description: |
   *            When set, imgproxy will multiply the image dimensions according to this factor for HiDPI (Retina) devices. The value must be greater than 0.
   *
   *            **Default:** `1`
   *         type: integer
   *         minimum: 0
   *       - name: enlarge
   *         in: formData
   *         description: |
   *            When set to `true`, imgproxy will enlarge the image if it is smaller than the given size.
   *
   *            **Default:** `false`
   *         type: string
   *         enum:
   *         - "true"
   *         - "false"
   *       - name: extend
   *         in: formData
   *         description: |
   *            **Format:** `%extend`:`%gravity`
   *            - When `extend` is set to `true`, imgproxy will extend the image if it is smaller than the given size.
   *            - `gravity` (optional) accepts the same values as `gravity` option, except `sm`. When gravity is not set, imgproxy will use `ce` gravity without offsets.
   *
   *            **Default:** `false:ce:0:0`
   *         type: string
   *       - name: gravity
   *         in: formData
   *         description: |
   *            **Format:** `%gravity_type`:`%x_offset`:`%y_offset`
   *
   *            When imgproxy needs to cut some parts of the image, it is guided by the gravity.
   *            - `gravity_type` - specifies the gravity type. Available values:
   *               - `no`: north (top edge);
   *               - `so`: south (bottom edge);
   *               - `ea`: east (right edge);
   *               - `we`: west (left edge);
   *               - `noea`: north-east (top-right corner);
   *               - `nowe`: north-west (top-left corner);
   *               - `soea`: south-east (bottom-right corner);
   *               - `sowe`: south-west (bottom-left corner);
   *               - `ce`: center.
   *            - `x_offset`, `y_offset` - (optional) specify gravity offset by X and Y axes.
   *
   *            **Default:** `ce:0:0`
   *
   *            **Special gravities:**
   *            - `gravity:sm` - smart gravity. `libvips` detects the most “interesting” section of the image and considers it as the center of the resulting image. Offsets are not applicable here;
   *            - `gravity:fp:%x:%y` - focus point gravity. `x` and `y` are floating point numbers between 0 and 1 that define the coordinates of the center of the resulting image. Treat 0 and 1 as right/left for `x` and top/bottom for `y`.
   *         type: string
   *       - name: crop
   *         in: formData
   *         description: |
   *            **Format:** `%width`:`%height`:`%gravity`
   *
   *            Defines an area of the image to be processed (crop before resize).
   *            - `width` and `height` define the size of the area. When `width` or `height` is set to `0`, imgproxy will use the full width/height of the source image.
   *            - `gravity` (optional) accepts the same values as gravity option. When `gravity` is not set, imgproxy will use the value of the gravity option.
   *         type: string
   *       - name: quality
   *         in: formData
   *         description: Redefines quality of the resulting image, percentage.
   *         type: integer
   *       - name: max_bytes
   *         in: formData
   *         description: |
   *            When set, imgproxy automatically degrades the quality of the image until the image is under the specified amount of bytes.
   *
   *            📝**Note:** Applicable only to `jpg`, `webp`, `heic`, and `tiff`.
   *
   *            **Warning:** When `max_bytes` is set, imgproxy saves image multiple times to achieve specified image size.
   *
   *            **Default:** `0`
   *         type: integer
   *         minimum: 0
   *       - name: background
   *         in: formData
   *         description: |
   *            **Format:** `%R`:`%G`:`%B` or `%hex_color`
   *
   *            When set, imgproxy will fill the resulting image background with the specified color. `R`, `G`, and `B` are red, green and blue channel values of the background color (0-255). `hex_color` is a hex-coded value of the color. Useful when you convert an image with alpha-channel to JPEG.
   *
   *            With no arguments provided, disables any background manipulations.
   *
   *            **Default:** disabled
   *         type: string
   *       - name: blur
   *         in: formData
   *         description: |
   *            When set, imgproxy will apply the gaussian blur filter to the resulting image. This parameter defines the size of a mask imgproxy will use.
   *
   *            **Default:** `disabled`
   *         type: integer
   *         minimum: 0
   *       - name: cachebuster
   *         in: formData
   *         description: |
   *            Cache buster doesn’t affect image processing but it’s changing allows to bypass CDN, proxy server and browser cache. Useful when you have changed some things that are not reflected in the URL like image quality settings, presets or watermark data.
   *
   *            It’s highly recommended to prefer `cachebuster` option over URL query string because the option can be properly signed.
   *
   *            **Default:** empty
   *         type: string
   *       - name: filename
   *         in: formData
   *         description: |
   *            Defines a filename for `Content-Disposition` header. When not specified, imgproxy will get filename from the source url.
   *
   *            **Default:** empty
   *         type: string
   *       - name: format
   *         in: formData
   *         description: |
   *            Specifies the resulting image format. Alias for extension URL part.
   *
   *            At the moment, imgproxy supports only `jpg`, `png`, `webp`, `gif`, `ico`, `heic`, and `tiff`, them being the most popular and useful image formats.
   *
   *            **Default:** `jpg`
   *         type: string
   *         enum:
   *         - "jpg"
   *         - "png"
   *         - "webp"
   *         - "gif"
   *         - "ico"
   *         - "heic"
   *         - "tiff"
   *     responses:
   *       200:
   *         description: Successful Operation
   *         schema:
   *           $ref: "#/definitions/ApiResponse"
   *       400:
   *         description: "Invalid Parameter Value"
   *         schema:
   *           $ref: "#/definitions/ApiError"
   */
  app.post('/url', (req, res) => {
    // Get source_url parameter
    let sourceUrls = []
    if (req.body.source_url) {
      sourceUrls =
        typeof req.body.source_url === 'string'
          ? [req.body.source_url]
          : req.body.source_url
      sourceUrls = sourceUrls.filter((url) => url !== null && url !== '')
    }
    if (!sourceUrls.length) {
      res.status(400)
      res.json({ error: 'Missing source_url parameter' })
      return
    }

    const params = [
      {
        type: 'options',
        name: 'resizing_type',
        ip_param: 'rt',
        options: resizeOptions
      },
      {
        type: 'integer',
        name: 'width',
        ip_param: 'w'
      },
      {
        type: 'integer',
        name: 'height',
        ip_param: 'h'
      },
      {
        type: 'integer',
        name: 'dpr',
        ip_param: 'dpr'
      },
      {
        type: 'options',
        name: 'enlarge',
        ip_param: 'el',
        options: enlargeOptions
      },
      {
        type: 'string',
        name: 'extend',
        ip_param: 'ex'
      },
      {
        type: 'string',
        name: 'gravity',
        ip_param: 'g'
      },
      {
        type: 'string',
        name: 'crop',
        ip_param: 'c'
      },
      {
        type: 'integer',
        name: 'quality',
        ip_param: 'q'
      },
      {
        type: 'integer',
        name: 'max_bytes',
        ip_param: 'mb'
      },
      {
        type: 'string',
        name: 'background',
        ip_param: 'bg'
      },
      {
        type: 'integer',
        name: 'blur',
        ip_param: 'bl'
      },
      {
        type: 'string',
        name: 'cachebuster',
        ip_param: 'cb'
      },
      {
        type: 'options',
        name: 'format',
        ip_param: 'f',
        options: extensionOptions
      }
    ]

    const processingOptions = []

    for (const param of params) {
      const { result = null, error = null } = paramParse(
        req,
        param.type,
        param.name,
        param.ip_param,
        param.options
      )
      if (error) {
        res.status(400)
        res.json({ error })
        return
      } else if (result) {
        processingOptions.push(result)
      }
    }

    const strProcessingOptions = processingOptions.length
      ? `/${processingOptions.join('/')}`
      : ''
    const extension = req.body.format || 'jpg'

    const urls = sourceUrls.map((url) => {
      const urlBase64 = urlSafeBase64(url)
        .match(/.{1,24}/g)
        .join('/')
      const path = `${strProcessingOptions}/${urlBase64}.${extension}`
      const key = config.imgProxy.key
      const salt = config.imgProxy.salt
      const signedUrl = key && salt ? sign(salt, path, key) : 'unsecure'
      const imgProxyUrl = `${config.imgProxy.url}/${signedUrl}${path}`
      return {
        source_url: url,
        imgproxy_url: imgProxyUrl
      }
    })

    res.json({ data: urls })
  })
}

const validOption = (option, options) => {
  const optionKeys = options.map((opt) => opt.key)
  return optionKeys.includes(option)
}

const paramParse = (req, type, valueName, param, options) => {
  if (req.body[valueName]) {
    if (type === 'options' && validOption(req.body[valueName], options)) {
      return { result: `${param}:${req.body[valueName]}` }
    }
    if (type === 'integer' && !isNaN(parseInt(req.body[valueName]))) {
      return { result: `${param}:${parseInt(req.body[valueName])}` }
    }
    if (type === 'string' && typeof req.body[valueName] === 'string') {
      return { result: `${param}:${req.body[valueName]}` }
    }
    return {
      error: `'${req.body[valueName]}' is not a valid '${valueName}' value`
    }
  }
  return {}
}

const urlSafeBase64 = (string) => {
  return Buffer.from(string)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
}

const hexDecode = (hex) => Buffer.from(hex, 'hex')

const sign = (salt, target, secret) => {
  const hmac = createHmac('sha256', hexDecode(secret))
  hmac.update(hexDecode(salt))
  hmac.update(target)
  return urlSafeBase64(hmac.digest())
}
