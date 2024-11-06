# Hedit
_a WYSIWYG HTML editor desktop app_

Hedit is a graphical what-you-see-is-what-you-get (WYSIWYG) HTML richt text editor desktop app.
It bundles [ckeditor5](https://github.com/ckeditor/ckeditor5), the javascript library which provides the core rich, which provides the core rich text editing features, into an electron app with react.

## Running/Installing

### Linux
Head over to the releases tab on Github to download the AppImage.
Make sure the file is marked as executable in its permissions, and run it.
You can install AppImages with a tool like [Gearlever](https://github.com/mijorus/gearlever)

### Other

I don't have any prebuilt binaries for other OSs yet, so you'll have to build those yourself, following the instructions below.

## Building

### Prerequisites
- npm (tested with version 10.9.0)
- node (tested with version 22.22.0)

### Build Procedure

From the project's root directory, run the following command:
```sh
npm run dist
```

The compiled binary will be written to `/dist`.